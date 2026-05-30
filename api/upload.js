import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient } from '@supabase/supabase-js'

// ─── Admin email list ─────────────────────────────────────────────────────────
const ADMIN_EMAILS = ['krishnabhosale265@gmail.com', 'bgmloverhub@gmail.com']

// ─── Lazy-initialised singletons (re-used across warm invocations) ────────────
let r2
let supabase

function getR2 () {
  if (!r2) {
    r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return r2
}

function getSupabase () {
  if (!supabase) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY,
    )
  }
  return supabase
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function requireAdmin (req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: 'Unauthorized: Missing token', status: 401 }
  }
  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await getSupabase().auth.getUser(token)
  if (error || !user) {
    return { user: null, error: 'Unauthorized: Invalid token', status: 401 }
  }
  const email = user.email?.toLowerCase() ?? ''
  if (!ADMIN_EMAILS.some(e => e.toLowerCase() === email)) {
    return { user: null, error: 'Forbidden: Admin access required', status: 403 }
  }
  return { user, error: null, status: 200 }
}

// ─── CORS helper — applied to every response, including errors ────────────────
function setCors (res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler (req, res) {
  setCors(res)

  // Handle preflight — must return 204 with no body
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { error: authError, status: authStatus } = await requireAdmin(req)
  if (authError) return res.status(authStatus).json({ error: authError })

  // ── Validate body ─────────────────────────────────────────────────────────
  const { key, contentType } = req.body ?? {}
  if (!key) return res.status(400).json({ error: 'Missing key' })

  const ct = contentType || 'application/octet-stream'
  const bucket = process.env.R2_BUCKET_NAME || 'stlmirror-files'

  try {
    // ── Generate presigned PUT URL (valid 1 hour) ─────────────────────────
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: ct,
    })

    const presignedUrl = await getSignedUrl(getR2(), command, { expiresIn: 3600 })

    // ── Derive the public-facing URL for this object ──────────────────────
    const base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')
    const publicUrl = base
      ? `${base}/${key}`
      : `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucket}/${key}`

    console.log(`✅ Presigned URL generated for: ${key}`)
    return res.status(200).json({ presignedUrl, publicUrl, key })
  } catch (err) {
    console.error('Presign error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate upload URL' })
  }
}
