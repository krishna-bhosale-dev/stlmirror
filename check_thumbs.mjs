import { blogPosts } from './src/data/blogPosts.js';
import https from 'https';

console.log('Checking thumbnails...');
let issues = 0;
let uniqueThumbnails = new Set();
let duplicateCount = 0;

for (const post of blogPosts) {
  if (!post.thumbnail) {
    console.log(`Missing thumbnail on post ${post.id}`);
    issues++;
  } else {
    if (uniqueThumbnails.has(post.thumbnail)) {
      console.log(`Duplicate thumbnail on post ${post.id}: ${post.thumbnail}`);
      duplicateCount++;
    } else {
      uniqueThumbnails.add(post.thumbnail);
    }
  }
}

console.log(`Total thumbnail issues: ${issues}`);
console.log(`Total duplicate thumbnails: ${duplicateCount}`);
