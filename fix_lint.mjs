import fs from 'fs'

// Fix AuthorBox.jsx
let authorBox = fs.readFileSync('src/components/blog/AuthorBox.jsx', 'utf-8')
authorBox = authorBox.replace(/import { Link } from 'react-router-dom'\n/, '')
fs.writeFileSync('src/components/blog/AuthorBox.jsx', authorBox)

// Fix FileCard.jsx
let fileCard = fs.readFileSync('src/components/files/FileCard.jsx', 'utf-8')
fileCard = fileCard.replace(/const \[imgError, setImgError\] = useState\(false\)\n/, '')
fileCard = fileCard.replace(/const extColor = getFileExtColor\(file.name\)\n/, '')
// Note: useState might still be imported but if it's unused we should replace it, but we'll see if it causes an error. Let's let it be for now.
fs.writeFileSync('src/components/files/FileCard.jsx', fileCard)

// Fix BlogPostPage.jsx
let blogPostPage = fs.readFileSync('src/pages/blog/BlogPostPage.jsx', 'utf-8')
blogPostPage = blogPostPage.replace(/, BookOpen/, '')
fs.writeFileSync('src/pages/blog/BlogPostPage.jsx', blogPostPage)

// Fix blogPosts.js
let blogPosts = fs.readFileSync('src/data/blogPosts.js', 'utf-8')
blogPosts = blogPosts.replace(/\\</g, '<').replace(/\\'/g, "'")
fs.writeFileSync('src/data/blogPosts.js', blogPosts)

console.log('Lint fixes applied.')
