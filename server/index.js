import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

// ─── Config ───────────────────────────────────────────────────────────────────
const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME = 'stlmirror-files',
  R2_PUBLIC_URL,      // e.g. https://pub-xxxx.r2.dev  OR custom domain
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  PORT = 3001,
} = process.env

if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌  Missing R2 environment variables. Check your .env file.')
  process.exit(1)
}

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('❌  Missing Supabase environment variables. Check your .env file.')
  process.exit(1)
}

// ─── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

// ─── Authentication Middleware ────────────────────────────────────────────────
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    const adminEmails = [
      'krishnabhosale265@gmail.com',
      'bgmloverhub@gmail.com',
    ]

    if (!user.email || !adminEmails.map((e) => e.toLowerCase()).includes(user.email.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' })
    }

    req.user = user
    next()
  } catch {
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}

// ─── S3 / R2 Client ───────────────────────────────────────────────────────────
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// ─── Public URL helper ────────────────────────────────────────────────────────
const getPublicUrl = (key) => {
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
  }
  // Fallback: Cloudflare R2 dev URL pattern
  return `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`
}


// ─── Express App ──────────────────────────────────────────────────────────────
const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    /^http:\/\/localhost:\d+$/,
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', bucket: R2_BUCKET_NAME })
})

// ─── Upload Route ─────────────────────────────────────────────────────────────
// POST /api/upload (Admin Authenticated)
// Body: application/json  { key: string, contentType: string }
// Returns: { presignedUrl: string, publicUrl: string, key: string }
//
// The browser then PUTs the raw file directly to presignedUrl (no size limit).
// R2 credentials never leave this server.
app.post('/api/upload', requireAdmin, async (req, res) => {
  try {
    const { key, contentType } = req.body ?? {}
    if (!key) return res.status(400).json({ error: 'Missing key' })

    const ct = contentType || 'application/octet-stream'

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: ct,
    })

    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 })
    const publicUrl = getPublicUrl(key)

    console.log(`✅  Presigned URL generated for: ${key} → ${publicUrl}`)
    return res.json({ presignedUrl, publicUrl, key })
  } catch (err) {
    console.error('Presign error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate upload URL' })
  }
})

// ─── Delete Route ─────────────────────────────────────────────────────────────
// DELETE /api/delete/:key (Admin Authenticated)
app.delete('/api/delete/:key', requireAdmin, async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key)

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    await r2.send(command)
    console.log(`🗑️   Deleted: ${key}`)

    return res.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return res.status(500).json({ error: err.message || 'Delete failed' })
  }
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  STL Mirror API server running on http://localhost:${PORT}`)
  console.log(`   R2 bucket: ${R2_BUCKET_NAME}`)
  console.log(`   Public URL base: ${R2_PUBLIC_URL || '(not set — using R2 storage URL)'}`)
})
