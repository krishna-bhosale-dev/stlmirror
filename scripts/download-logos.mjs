/**
 * download-logos.mjs
 * Downloads official AI tool logos from brand asset sources.
 * Tries multiple URLs per tool in priority order.
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'ai-tools');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Official logo sources — multiple fallbacks per tool
// Priority: official CDN > GitHub > clearbit > favicons
const TOOLS = [
  {
    name: 'Claude (Anthropic)',
    file: 'claude.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/1024px-Claude_AI_logo.svg.png',
      'https://www.anthropic.com/images/icons/safari-pinned-tab.svg',
    ]
  },
  {
    name: 'Cursor AI',
    file: 'cursor.png',
    urls: [
      'https://www.cursor.com/favicon-32x32.png',
      'https://www.cursor.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Windsurf (Codeium)',
    file: 'windsurf.png',
    urls: [
      'https://windsurf.com/favicon-196x196.png',
      'https://codeium.com/favicon/favicon-196x196.png',
    ]
  },
  {
    name: 'Perplexity AI',
    file: 'perplexity.png',
    urls: [
      'https://www.perplexity.ai/favicon.svg',
      'https://www.perplexity.ai/favicon-192x192.png',
    ]
  },
  {
    name: 'NotebookLM',
    file: 'notebooklm.png',
    urls: [
      'https://notebooklm.google.com/favicon-192x192.png',
      'https://ssl.gstatic.com/notebooklm/icons/icon_512x512.png',
    ]
  },
  {
    name: 'Gamma',
    file: 'gamma.png',
    urls: [
      'https://gamma.app/icons/icon-512x512.png',
      'https://gamma.app/favicon.ico',
    ]
  },
  {
    name: 'ElevenLabs',
    file: 'elevenlabs.png',
    urls: [
      'https://elevenlabs.io/favicon-32x32.png',
      'https://elevenlabs.io/apple-touch-icon.png',
    ]
  },
  {
    name: 'Midjourney',
    file: 'midjourney.png',
    urls: [
      'https://www.midjourney.com/favicon-192x192.png',
      'https://www.midjourney.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Runway ML',
    file: 'runway-ml.png',
    urls: [
      'https://runwayml.com/apple-touch-icon.png',
      'https://runwayml.com/favicon-196x196.png',
    ]
  },
  {
    name: 'HeyGen',
    file: 'heygen.png',
    urls: [
      'https://www.heygen.com/favicon.ico',
      'https://app.heygen.com/favicon.ico',
    ]
  },
  {
    name: 'Suno AI',
    file: 'suno.png',
    urls: [
      'https://suno.com/favicon.ico',
      'https://suno.ai/favicon.ico',
    ]
  },
  {
    name: 'Descript',
    file: 'descript.png',
    urls: [
      'https://www.descript.com/favicon-196x196.png',
      'https://www.descript.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Fireflies.ai',
    file: 'fireflies.png',
    urls: [
      'https://fireflies.ai/favicon-196x196.png',
      'https://fireflies.ai/apple-touch-icon.png',
    ]
  },
  {
    name: 'Grok (xAI)',
    file: 'grok.png',
    urls: [
      'https://grok.com/favicon-196x196.png',
      'https://x.ai/favicon.ico',
    ]
  },
  {
    name: 'Bolt.new',
    file: 'bolt-new.png',
    urls: [
      'https://bolt.new/favicon-196x196.png',
      'https://bolt.new/apple-touch-icon.png',
    ]
  },
  {
    name: 'Tavily',
    file: 'tavily.png',
    urls: [
      'https://tavily.com/favicon.ico',
      'https://app.tavily.com/favicon.ico',
    ]
  },
  {
    name: 'Kling AI',
    file: 'kling-ai.png',
    urls: [
      'https://klingai.com/favicon-196x196.png',
      'https://klingai.com/favicon.ico',
    ]
  },
  {
    name: 'Luma Dream Machine',
    file: 'luma-dream-machine.png',
    urls: [
      'https://lumalabs.ai/favicon-196x196.png',
      'https://lumalabs.ai/apple-touch-icon.png',
    ]
  },
  {
    name: 'Leonardo AI',
    file: 'leonardo-ai.png',
    urls: [
      'https://leonardo.ai/apple-touch-icon.png',
      'https://app.leonardo.ai/favicon-196x196.png',
    ]
  },
  {
    name: 'Pixlr AI',
    file: 'pixlr-ai.png',
    urls: [
      'https://pixlr.com/apple-touch-icon.png',
      'https://pixlr.com/favicon-196x196.png',
    ]
  },
  {
    name: 'Otter.ai',
    file: 'otter-ai.png',
    urls: [
      'https://otter.ai/favicon-196x196.png',
      'https://otter.ai/apple-touch-icon.png',
    ]
  },
  {
    name: 'Elicit',
    file: 'elicit.png',
    urls: [
      'https://elicit.com/favicon-196x196.png',
      'https://elicit.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Consensus',
    file: 'consensus.png',
    urls: [
      'https://consensus.app/favicon-196x196.png',
      'https://consensus.app/apple-touch-icon.png',
    ]
  },
  {
    name: 'Reclaim.ai',
    file: 'reclaim-ai.png',
    urls: [
      'https://reclaim.ai/favicon-196x196.png',
      'https://reclaim.ai/apple-touch-icon.png',
    ]
  },
  {
    name: 'Teal',
    file: 'teal.png',
    urls: [
      'https://www.tealhq.com/favicon-196x196.png',
      'https://www.tealhq.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Kickresume',
    file: 'kickresume.png',
    urls: [
      'https://www.kickresume.com/favicon-196x196.png',
      'https://www.kickresume.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'Lovable',
    file: 'lovable.png',
    urls: [
      'https://lovable.dev/favicon-196x196.png',
      'https://lovable.dev/apple-touch-icon.png',
    ]
  },
  {
    name: 'Flow AI',
    file: 'flow-ai.png',
    urls: [
      'https://flow.microsoft.com/favicon-196x196.png',
    ]
  },
  {
    name: 'SciSpace',
    file: 'scispace.png',
    urls: [
      'https://scispace.com/favicon-196x196.png',
      'https://scispace.com/apple-touch-icon.png',
    ]
  },
  {
    name: 'StealthWriter',
    file: 'stealthwriter.png',
    urls: [
      'https://stealthwriter.ai/favicon-196x196.png',
      'https://stealthwriter.ai/apple-touch-icon.png',
    ]
  },
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/png,image/webp,image/jpeg,image/svg+xml,image/*,*/*',
      },
      timeout: 8000,
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location;
        if (location) {
          resolve(download(location.startsWith('http') ? location : new URL(location, url).href, destPath));
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const contentType = res.headers['content-type'] || '';
      if (!contentType.includes('image') && !contentType.includes('octet-stream') && !contentType.includes('svg')) {
        reject(new Error(`Not an image: ${contentType}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 200) { reject(new Error(`Too small: ${buf.length} bytes`)); return; }
        fs.writeFileSync(destPath, buf);
        resolve(buf.length);
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function downloadTool(tool) {
  const destPath = path.join(OUT_DIR, tool.file);
  for (const url of tool.urls) {
    try {
      const size = await download(url, destPath);
      console.log(`  ✅ ${tool.name} (${tool.file}) — ${size} bytes from ${url}`);
      return true;
    } catch (e) {
      console.log(`  ⚠️  ${tool.name}: ${url} → ${e.message}`);
    }
  }
  console.log(`  ❌ ${tool.name}: all URLs failed`);
  return false;
}

console.log('🔽 Downloading official AI tool logos...\n');
let ok = 0, fail = 0;
for (const tool of TOOLS) {
  const result = await downloadTool(tool);
  result ? ok++ : fail++;
}
console.log(`\n✅ Downloaded: ${ok}/${TOOLS.length}  |  ❌ Failed: ${fail}`);

// List what we have
const files = fs.readdirSync(OUT_DIR).filter(f => /\.(png|jpg|svg|ico|webp)$/i.test(f));
console.log(`\n📁 Files in ai-tools/: ${files.length}`);
files.forEach(f => {
  const size = fs.statSync(path.join(OUT_DIR, f)).size;
  console.log(`   ${f} — ${size} bytes`);
});
