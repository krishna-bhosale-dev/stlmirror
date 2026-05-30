import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

// ─── Admin email list ─────────────────────────────────────────────────────────
const ADMIN_EMAILS = ['krishnabhosale265@gmail.com', 'bgmloverhub@gmail.com']

// ─── Lazy-initialised singletons ─────────────────────────────────────────────
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
// Handles: DELETE /api/delete/:key
// Vercel dynamic segment: req.query.key
export default async function handler (req, res) {
  setCors(res)

  // Handle preflight — must return 204 with no body
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { error: authError, status: authStatus } = await requireAdmin(req)
  if (authError) return res.status(authStatus).json({ error: authError })

  // ── Dynamic segment: /api/delete/:key ─────────────────────────────────────
  const key = decodeURIComponent(req.query.key ?? '')
  if (!key) return res.status(400).json({ error: 'Missing file key' })

  const bucket = process.env.R2_BUCKET_NAME || 'stlmirror-files'

  try {
    await getR2().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    console.log(`🗑️  Deleted from R2: ${key}`)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return res.status(500).json({ error: err.message || 'Delete failed' })
  }
}
