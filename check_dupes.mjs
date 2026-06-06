import { blogPosts } from './src/data/blogPosts.js';

console.log('Checking for duplicate paragraphs across posts...');

let paragraphMap = new Map();
let duplicateParagraphs = new Set();

for (const post of blogPosts) {
  // Extract paragraphs
  let paragraphs = post.content.match(/<p>(.*?)<\/p>/g) || [];
  for (let p of paragraphs) {
    let cleanP = p.replace(/<[^>]*>?/gm, '').trim();
    if (cleanP.length > 50) { // Only check substantive paragraphs
      if (paragraphMap.has(cleanP)) {
        paragraphMap.get(cleanP).push(post.id);
        duplicateParagraphs.add(cleanP);
      } else {
        paragraphMap.set(cleanP, [post.id]);
      }
    }
  }
}

if (duplicateParagraphs.size > 0) {
  console.log(`Found ${duplicateParagraphs.size} duplicated paragraphs.`);
  for (let dp of duplicateParagraphs) {
    console.log(`\nParagraph: "${dp.substring(0, 100)}..."`);
    console.log(`Found in posts: ${paragraphMap.get(dp).join(', ')}`);
  }
} else {
  console.log('No duplicated paragraphs found across posts.');
}
