import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

// ─── Admin emails ─────────────────────────────────────────────────────────────
const ADMIN_EMAILS = ['krishnabhosale265@gmail.com', 'bgmloverhub@gmail.com']

// ─── Allowed origins ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://www.stlmirror.in',
  'https://stlmirror.in',
  'http://localhost:5173',
  'http://localhost:3000',
]

function setCors (req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.stlmirror.in')
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Vary', 'Origin')
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function requireAdmin (req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: 'Unauthorized: Missing token', status: 401 }
  }
  const token = authHeader.split(' ')[1]
  const url  = process.env.SUPABASE_URL       || process.env.VITE_SUPABASE_URL
  const key  = process.env.SUPABASE_ANON_KEY  || process.env.VITE_SUPABASE_ANON_KEY
  const supabase = createClient(url, key)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return { user: null, error: 'Unauthorized: Invalid token', status: 401 }
  const email = user.email?.toLowerCase() ?? ''
  if (!ADMIN_EMAILS.some(e => e.toLowerCase() === email)) {
    return { user: null, error: 'Forbidden: Admin access required', status: 403 }
  }
  return { user, error: null, status: 200 }
}

// ─── Handler ──────────────────────────────────────────────────────────────────
// GET /api/r2-health
// Validates every env var and does a real HeadBucket call.
// Returns { ok: true } or { ok: false, stage, error, hint }
export default async function handler (req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  // ── Auth ────────────────────────────────────────────────────────────────────
  const { error: authError, status: authStatus } = await requireAdmin(req)
  if (authError) return res.status(authStatus).json({ ok: false, stage: 'auth', error: authError })

  // ── Env var check ───────────────────────────────────────────────────────────
  const required = {
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID:      process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY:  process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME:        process.env.R2_BUCKET_NAME || 'stlmirror-files',
  }
  for (const [name, value] of Object.entries(required)) {
    if (!value) {
      console.error(`[r2-health] Missing env var: ${name}`)
      return res.status(500).json({
        ok: false,
        stage: 'env',
        error: `Environment variable "${name}" is not set on the server.`,
        hint:  `Add ${name} to your Vercel project environment variables.`,
      })
    }
  }

  const accountId = required.CLOUDFLARE_ACCOUNT_ID
  const bucket    = required.R2_BUCKET_NAME

  // ── R2 connectivity + auth check ────────────────────────────────────────────
  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     required.R2_ACCESS_KEY_ID,
      secretAccessKey: required.R2_SECRET_ACCESS_KEY,
    },
  })

  try {
    await r2.send(new HeadBucketCommand({ Bucket: bucket }))

    const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')
      || `https://${accountId}.r2.cloudflarestorage.com/${bucket}`

    console.log(`[r2-health] ✅ Bucket "${bucket}" is accessible`)
    return res.status(200).json({
      ok:        true,
      bucket,
      publicUrl,
      endpoint:  `https://${accountId}.r2.cloudflarestorage.com`,
    })
  } catch (err) {
    console.error('[r2-health] HeadBucket failed:', err.name, err.message)

    const httpStatus = err.$metadata?.httpStatusCode
    const code       = err.name || err.Code || ''

    // Map known R2 / S3 error codes to actionable messages
    if (code === 'NoSuchBucket' || httpStatus === 404) {
      return res.status(500).json({
        ok:    false,
        stage: 'r2',
        error: `Bucket "${bucket}" does not exist in Cloudflare R2.`,
        hint:  `Verify the R2_BUCKET_NAME env var and that the bucket exists in your Cloudflare account.`,
        code,
      })
    }
    if (code === 'InvalidAccessKeyId' || httpStatus === 403) {
      return res.status(500).json({
        ok:    false,
        stage: 'r2',
        error: 'Cloudflare R2 returned 403 Forbidden — the Access Key ID is invalid or does not have permission.',
        hint:  'Check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your environment variables.',
        code,
      })
    }
    if (code === 'SignatureDoesNotMatch') {
      return res.status(500).json({
        ok:    false,
        stage: 'r2',
        error: 'Cloudflare R2 signature mismatch — R2_SECRET_ACCESS_KEY is incorrect.',
        hint:  'Regenerate an R2 API token in the Cloudflare dashboard and update R2_SECRET_ACCESS_KEY.',
        code,
      })
    }
    if (code === 'InvalidEndpoint' || code === 'ERR_INVALID_URL') {
      return res.status(500).json({
        ok:    false,
        stage: 'r2',
        error: `Invalid R2 endpoint — CLOUDFLARE_ACCOUNT_ID "${accountId}" may be wrong.`,
        hint:  'Find your Account ID in the Cloudflare dashboard → top-right account selector.',
        code,
      })
    }

    // Unknown error — return raw message for analysis
    return res.status(500).json({
      ok:         false,
      stage:      'r2',
      error:      `Cloudflare R2 error: ${err.message}`,
      code,
      httpStatus: httpStatus || null,
      hint:       'Check the server logs for the full stack trace.',
    })
  }
}
