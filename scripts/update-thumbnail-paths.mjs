/**
 * update-thumbnail-paths.mjs
 * Updates all thumbnail paths in aiToolsData.js from
 * /images/thumbnails/xxx.png → /images/ai-tools/xxx.png
 * Also adds/updates the altText field for each tool.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '..', 'src', 'data', 'aiToolsData.js');

// Map: old thumbnail path → { newPath, altText, toolName }
const UPDATES = [
  { slug: 'flow-ai-video-generation',           file: 'flow-ai.png',          alt: 'Flow AI logo' },
  { slug: 'scispace-ai-research-assistant',     file: 'scispace.png',         alt: 'SciSpace AI logo' },
  { slug: 'stealthwriter-ai-humanizer-review',  file: 'stealthwriter.png',    alt: 'StealthWriter AI logo' },
  { slug: 'perplexity-ai-search-engine-review', file: 'perplexity.png',       alt: 'Perplexity AI logo' },
  { slug: 'gamma-ai-presentation-generator',   file: 'gamma.png',            alt: 'Gamma AI logo' },
  { slug: 'elevenlabs-ai-voice-generator',      file: 'elevenlabs.png',       alt: 'ElevenLabs AI logo' },
  { slug: 'midjourney-ai-art-generator-review', file: 'midjourney.png',       alt: 'Midjourney logo' },
  { slug: 'runway-ml-ai-video-editing',         file: 'runway-ml.png',        alt: 'Runway ML logo' },
  { slug: 'claude-anthropic-ai-review',         file: 'claude.png',           alt: 'Claude AI logo' },
  { slug: 'windsurf-ai-code-editor-review',     file: 'windsurf.png',         alt: 'Windsurf AI logo' },
  { slug: 'lovable-ai-app-builder-review',      file: 'lovable.png',          alt: 'Lovable AI logo' },
  { slug: 'notebooklm-ai-research-tool-review', file: 'notebooklm.png',       alt: 'NotebookLM logo' },
  { slug: 'heygen-ai-video-avatar-review',      file: 'heygen.png',           alt: 'HeyGen AI logo' },
  { slug: 'suno-ai-music-generator-review',     file: 'suno.png',             alt: 'Suno AI logo' },
  { slug: 'descript-ai-video-editor-review',    file: 'descript.png',         alt: 'Descript AI logo' },
  { slug: 'fireflies-ai-meeting-assistant-review', file: 'fireflies.png',     alt: 'Fireflies.ai logo' },
  { slug: 'grok-ai-assistant-review',           file: 'grok.png',             alt: 'Grok AI logo' },
  { slug: 'bolt-new-ai-app-builder-review',     file: 'bolt-new.png',         alt: 'Bolt.new logo' },
  { slug: 'tavily-ai-search-api-review',        file: 'tavily.png',           alt: 'Tavily AI logo' },
  { slug: 'cursor-ai-code-editor-review',       file: 'cursor.png',           alt: 'Cursor AI logo' },
  { slug: 'kling-ai-video-generator-review',    file: 'kling-ai.png',         alt: 'Kling AI logo' },
  { slug: 'luma-dream-machine-review',          file: 'luma-dream-machine.png', alt: 'Luma Dream Machine logo' },
  { slug: 'leonardo-ai-image-generator-review', file: 'leonardo-ai.png',      alt: 'Leonardo AI logo' },
  { slug: 'pixlr-ai-photo-editor-review',       file: 'pixlr-ai.png',         alt: 'Pixlr AI logo' },
  { slug: 'otter-ai-meeting-transcription-review', file: 'otter-ai.png',      alt: 'Otter.ai logo' },
  { slug: 'elicit-ai-research-assistant-review', file: 'elicit.png',          alt: 'Elicit AI logo' },
  { slug: 'consensus-ai-academic-search-review', file: 'consensus.png',       alt: 'Consensus AI logo' },
  { slug: 'reclaim-ai-productivity-scheduler-review', file: 'reclaim-ai.png', alt: 'Reclaim.ai logo' },
  { slug: 'teal-ai-career-platform-review',     file: 'teal.png',             alt: 'Teal AI logo' },
  { slug: 'kickresume-ai-resume-builder-review', file: 'kickresume.png',      alt: 'Kickresume AI logo' },
];

let content = fs.readFileSync(FILE, 'utf8');
let updated = 0;

for (const { slug, file, alt } of UPDATES) {
  const slugMarker = `slug: '${slug}'`;
  const slugIdx = content.indexOf(slugMarker);
  if (slugIdx === -1) { console.log(`❌ Slug not found: ${slug}`); continue; }

  // Find the thumbnail: line after the slug
  const thumbPattern = /thumbnail: '\/images\/[^']+'/;
  const afterSlug = content.indexOf('\n', slugIdx);
  const nextChunk = content.slice(afterSlug, afterSlug + 400);
  const thumbMatch = nextChunk.match(thumbPattern);

  if (!thumbMatch) { console.log(`⚠️  No thumbnail found for: ${slug}`); continue; }

  const oldThumb = thumbMatch[0];
  const newThumb = `thumbnail: '/images/ai-tools/${file}'`;

  if (oldThumb === newThumb) {
    console.log(`⏭️  Already updated: ${slug}`);
    continue;
  }

  // Replace only the first occurrence after the slug
  const chunkStart = afterSlug;
  const chunkEnd = afterSlug + 400;
  const before = content.slice(0, chunkStart);
  const chunk = content.slice(chunkStart, chunkEnd);
  const after = content.slice(chunkEnd);

  const newChunk = chunk.replace(oldThumb, newThumb);
  content = before + newChunk + after;
  updated++;
  console.log(`✅ ${slug}\n     ${oldThumb} → ${newThumb}`);
}

fs.writeFileSync(FILE, content, 'utf8');
console.log(`\n✅ Updated ${updated} thumbnail paths`);
console.log(`📄 Verifying new paths in file:`);
const newPaths = [...content.matchAll(/thumbnail: '([^']+)'/g)].map(m => m[1]);
newPaths.forEach(p => {
  const isNewPath = p.includes('/images/ai-tools/');
  console.log(`  ${isNewPath ? '✅' : '❌'} ${p}`);
});
