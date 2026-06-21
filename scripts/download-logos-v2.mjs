/**
 * download-logos-v2.mjs
 * Second pass — uses Google Favicon Service + alternative CDN paths
 * for logos that failed in the first pass.
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'ai-tools');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Google S2 favicon service returns high-quality official favicons
// sz=256 gets the largest available icon
const G = (domain, sz = 256) => `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`;

const TOOLS = [
  {
    name: 'Windsurf',
    file: 'windsurf.png',
    urls: [
      G('windsurf.com', 256),
      G('codeium.com', 256),
      'https://codeium.com/favicon.ico',
    ]
  },
  {
    name: 'NotebookLM',
    file: 'notebooklm.png',
    urls: [
      G('notebooklm.google.com', 256),
      G('notebooklm.google', 256),
      'https://www.gstatic.com/lamda/images/notebooklm_favicon_v1.png',
      'https://notebooklm.google.com/favicon.ico',
    ]
  },
  {
    name: 'ElevenLabs',
    file: 'elevenlabs.png',
    urls: [
      G('elevenlabs.io', 256),
      'https://storage.googleapis.com/eleven-public-prod/similar_posts/favicon.png',
    ]
  },
  {
    name: 'Midjourney',
    file: 'midjourney.png',
    urls: [
      G('midjourney.com', 256),
      'https://cdn.midjourney.com/images/favicon.ico',
    ]
  },
  {
    name: 'Runway ML',
    file: 'runway-ml.png',
    urls: [
      G('runwayml.com', 256),
      G('runway.com', 256),
      'https://runway.com/favicon.ico',
    ]
  },
  {
    name: 'Descript',
    file: 'descript.png',
    urls: [
      G('descript.com', 256),
      'https://assets.descript.com/images/favicon.ico',
    ]
  },
  {
    name: 'Bolt.new',
    file: 'bolt-new.png',
    urls: [
      G('bolt.new', 256),
      G('stackblitz.com', 256),
      'https://assets.stackblitz.com/favicon.ico',
    ]
  },
  {
    name: 'Luma Dream Machine',
    file: 'luma-dream-machine.png',
    urls: [
      G('lumalabs.ai', 256),
      G('dream-machine.lumalabs.ai', 256),
      'https://lumalabs.ai/favicon.ico',
    ]
  },
  {
    name: 'Leonardo AI',
    file: 'leonardo-ai.png',
    urls: [
      G('leonardo.ai', 256),
      'https://leonardo.ai/favicon.ico',
    ]
  },
  {
    name: 'Otter.ai',
    file: 'otter-ai.png',
    urls: [
      G('otter.ai', 256),
      'https://otter.ai/favicon-128.png',
    ]
  },
  {
    name: 'Elicit',
    file: 'elicit.png',
    urls: [
      G('elicit.com', 256),
      'https://elicit.com/favicon.ico',
    ]
  },
  {
    name: 'Consensus',
    file: 'consensus.png',
    urls: [
      G('consensus.app', 256),
      'https://consensus.app/favicon.ico',
    ]
  },
  {
    name: 'Reclaim.ai',
    file: 'reclaim-ai.png',
    urls: [
      G('reclaim.ai', 256),
      'https://reclaim.ai/favicon.ico',
    ]
  },
  {
    name: 'Teal',
    file: 'teal.png',
    urls: [
      G('tealhq.com', 256),
      'https://www.tealhq.com/favicon.ico',
    ]
  },
  {
    name: 'Kickresume',
    file: 'kickresume.png',
    urls: [
      G('kickresume.com', 256),
      'https://www.kickresume.com/favicon.ico',
    ]
  },
  {
    name: 'Flow AI (Flows.network / Flowith)',
    file: 'flow-ai.png',
    urls: [
      G('flowith.io', 256),
      G('flows.network', 256),
      'https://flowith.io/favicon.ico',
    ]
  },
  {
    name: 'SciSpace',
    file: 'scispace.png',
    urls: [
      G('scispace.com', 256),
      G('typeset.io', 256),
      'https://scispace.com/favicon.ico',
    ]
  },
  {
    name: 'StealthWriter',
    file: 'stealthwriter.png',
    urls: [
      G('stealthwriter.ai', 256),
      'https://stealthwriter.ai/favicon.ico',
    ]
  },
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/png,image/webp,image/jpeg,image/svg+xml,image/*,*/*',
        'Referer': url,
      },
      timeout: 10000,
    }, (res) => {
      if ([301,302,307,308].includes(res.statusCode)) {
        const loc = res.headers.location;
        if (loc) {
          const newUrl = loc.startsWith('http') ? loc : new URL(loc, url).href;
          resolve(download(newUrl, destPath));
          return;
        }
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const ct = res.headers['content-type'] || '';
      if (!ct.match(/image|octet-stream/i) && !url.endsWith('.svg')) {
        reject(new Error(`Not image: ${ct.split(';')[0]}`)); return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 200) { reject(new Error(`Too small: ${buf.length}B`)); return; }
        fs.writeFileSync(destPath, buf);
        resolve(buf.length);
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function run() {
  console.log('🔽 Second pass — downloading remaining logos via Google S2 + fallbacks...\n');
  let ok = 0, skip = 0, fail = 0;

  for (const tool of TOOLS) {
    const destPath = path.join(OUT_DIR, tool.file);
    // Skip if already exists and is real (>1KB)
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`  ⏭️  ${tool.name} — already exists`);
      skip++;
      continue;
    }
    let done = false;
    for (const url of tool.urls) {
      try {
        const size = await download(url, destPath);
        console.log(`  ✅ ${tool.name} (${tool.file}) — ${size}B`);
        done = true;
        ok++;
        break;
      } catch (e) {
        console.log(`  ⚠️  ${url} → ${e.message}`);
      }
    }
    if (!done) { console.log(`  ❌ ${tool.name}: all failed`); fail++; }
  }

  console.log(`\nPass 2 results — ✅ ${ok} new  |  ⏭️  ${skip} skipped  |  ❌ ${fail} failed`);

  // Final status
  const files = fs.readdirSync(OUT_DIR).filter(f => /\.(png|jpg|svg|ico|webp)$/i.test(f));
  const realFiles = files.filter(f => fs.statSync(path.join(OUT_DIR, f)).size > 500);
  console.log(`\n📁 Total real logos in ai-tools/: ${realFiles.length}/30`);
  realFiles.forEach(f => {
    const size = fs.statSync(path.join(OUT_DIR, f)).size;
    console.log(`   ✅ ${f} (${size}B)`);
  });
}

run();
