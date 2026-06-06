import { blogPosts } from './src/data/blogPosts.js';
import https from 'https';

console.log(`Loaded ${blogPosts.length} posts`);

let contents = new Map();
let duplicateContentIds = [];
let aiPatternPosts = [];

for (const post of blogPosts) {
  // Check exact duplicate content
  let trimmedContent = post.content.trim();
  if (contents.has(trimmedContent)) {
    duplicateContentIds.push({ id: post.id, duplicateOf: contents.get(trimmedContent) });
  } else {
    contents.set(trimmedContent, post.id);
  }
  
  let contentLower = post.content.toLowerCase();
  let hasIntro = contentLower.includes('<h2>introduction</h2>');
  let hasConclusion = contentLower.includes('<h2>conclusion</h2>');
  
  if (hasIntro && hasConclusion) {
    aiPatternPosts.push(post.id);
  }
}

console.log(`Exact duplicate content count: ${duplicateContentIds.length}`);
if (duplicateContentIds.length > 0) {
  console.log('Duplicate IDs:', duplicateContentIds);
}

console.log(`AI pattern matches (Intro + Conclusion): ${aiPatternPosts.length} out of ${blogPosts.length}`);
console.log('AI pattern post IDs to target for E-E-A-T:', aiPatternPosts.slice(0, 15));
