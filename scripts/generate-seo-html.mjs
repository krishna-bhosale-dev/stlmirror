/**
 * generate-seo-html.mjs
 * 
 * Post-build script that injects per-page SEO metadata into static HTML files.
 * This fixes the SPA canonical bug: every page gets its own index.html with
 * correct <title>, <meta description>, and <canonical> in the raw HTML.
 * 
 * Runs after `vite build` via `npm run build`.
 * Fully compatible with Vercel deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const BASE_URL = 'https://www.stlmirror.in';

// ─── Read source data ─────────────────────────────────────────────────────────
// Parse slugs/titles/excerpts from source JS files via regex (no bundler needed)
function parseDataFile(filePath, slugKey = 'slug', titleKey = 'title', excerptKey = 'excerpt') {
  const content = fs.readFileSync(filePath, 'utf8');
  const items = [];

  // Match objects by finding each slug and then nearby title/excerpt
  const slugRegex = new RegExp(`${slugKey}:\\s*['"\`]([^'"\`]+)['"\`]`, 'g');
  const titleRegex = new RegExp(`${titleKey}:\\s*['"\`]([^'"\`\\n]+)['"\`]`, 'g');
  const excerptRegex = new RegExp(`${excerptKey}:\\s*\\n?\\s*['"\`]([^'"\`]+)['"\`]`, 'g');

  const slugs = [...content.matchAll(slugRegex)].map(m => m[1]);
  const titles = [...content.matchAll(titleRegex)].map(m => m[1]);
  const excerpts = [...content.matchAll(excerptRegex)].map(m => m[1]);

  slugs.forEach((slug, i) => {
    items.push({
      slug,
      title: titles[i] || '',
      description: excerpts[i] || '',
    });
  });

  return items;
}

// ─── Route definitions ────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  {
    path: '/',
    title: 'STL Mirror — Software Resources, Tutorials & Downloads',
    description: 'STL Mirror is your trusted software resource platform. Read expert guides, software reviews, APK installation tutorials, and AI tool deep-dives.',
    canonical: '/',
  },
  {
    path: '/blog',
    title: 'Tech Blog — Software Guides, AI Tools & Developer Tips | STL Mirror',
    description: 'Browse 80+ expert articles on Android emulators, PDF tools, AI coding assistants, developer workflows, and software comparisons.',
    canonical: '/blog',
  },
  {
    path: '/ai-tools',
    title: 'AI Tools Directory — Honest Reviews & Comparisons | STL Mirror',
    description: 'Browse 30+ hands-on AI tool reviews covering coding assistants, video generators, writing tools, and research platforms. No affiliate bias.',
    canonical: '/ai-tools',
  },
  {
    path: '/software',
    title: 'Free Software Downloads — Safe & Reviewed | STL Mirror',
    description: 'Download trusted free software with expert reviews, installation guides, and safety verification. BlueStacks, VLC, 7-Zip, VS Code, and more.',
    canonical: '/software',
  },
  {
    path: '/about',
    title: 'About STL Mirror — Our Mission & Editorial Standards',
    description: 'Learn about STL Mirror, our editorial philosophy, and how we review software and AI tools with genuine hands-on testing.',
    canonical: '/about',
  },
  {
    path: '/contact',
    title: 'Contact STL Mirror — Corrections, Feedback & Partnerships',
    description: 'Get in touch with the STL Mirror team. Report errors, suggest new reviews, or enquire about editorial partnerships.',
    canonical: '/contact',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — STL Mirror',
    description: 'Read STL Mirror\'s privacy policy. Learn how we handle your data, use cookies, and comply with Google AdSense requirements.',
    canonical: '/privacy-policy',
  },
  {
    path: '/terms',
    title: 'Terms of Service — STL Mirror',
    description: 'STL Mirror terms of service. Understand your rights and responsibilities when using our software review and download platform.',
    canonical: '/terms',
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer — STL Mirror',
    description: 'Important disclaimers about STL Mirror content, affiliate links, software download safety, and accuracy of technical information.',
    canonical: '/disclaimer',
  },
  {
    path: '/dmca',
    title: 'DMCA Policy — Copyright & Content Removal | STL Mirror',
    description: 'STL Mirror\'s DMCA policy. Submit copyright infringement notices or content removal requests here.',
    canonical: '/dmca',
  },
  {
    path: '/editorial-policy',
    title: 'Editorial Policy — Research Standards & Independence | STL Mirror',
    description: 'Read STL Mirror\'s editorial standards, testing methodology, and commitment to independent, unbiased software and AI tool reviews.',
    canonical: '/editorial-policy',
  },
  {
    path: '/author/krishna-bhosale',
    title: 'Krishna Bhosale — Founder & Lead Editor | STL Mirror',
    description: 'Krishna Bhosale is the founder and sole author of STL Mirror. Software engineering student at VIT Pune reviewing AI tools, software, and developer tools since 2023.',
    canonical: '/author/krishna-bhosale',
  },
  {
    path: '/apk',
    title: 'APK Installation Guides — Safe Android Sideloading | STL Mirror',
    description: 'Step-by-step APK installation tutorials for Android emulators and devices. Safe, verified guides for sideloading Android apps.',
    canonical: '/apk',
  },
  {
    path: '/pdf-tools',
    title: 'Best Free PDF Tools — Readers, Editors & Converters | STL Mirror',
    description: 'Find the best free PDF readers, editors, and converters. Compare SumatraPDF, Foxit, Adobe Acrobat, and more.',
    canonical: '/pdf-tools',
  },
  {
    path: '/developer-tools',
    title: 'Developer Tools — VS Code, Git, Docker & More | STL Mirror',
    description: 'Reviews and guides for essential developer tools. VS Code setup, productivity extensions, debugging tools, and workflow optimization.',
    canonical: '/developer-tools',
  },
  {
    path: '/latest',
    title: 'Latest Software & AI Tool Reviews | STL Mirror',
    description: 'Browse the most recently published software reviews, AI tool comparisons, and tech guides on STL Mirror.',
    canonical: '/latest',
  },
  {
    path: '/most-downloaded',
    title: 'Most Popular Software Reviews | STL Mirror',
    description: 'The most-read software and AI tool reviews on STL Mirror. See what other readers are downloading and reviewing.',
    canonical: '/most-downloaded',
  },
  {
    path: '/recently-updated',
    title: 'Recently Updated Guides & Reviews | STL Mirror',
    description: 'Software reviews and guides recently updated with new information, version changes, and pricing updates on STL Mirror.',
    canonical: '/recently-updated',
  },
];

// ─── Read base HTML template ──────────────────────────────────────────────────
const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

// ─── Inject meta tags into HTML ───────────────────────────────────────────────
function generatePageHtml(route) {
  const { title, description, canonical } = route;
  const fullCanonical = `${BASE_URL}${canonical}`;
  const fullTitle = title.includes('STL Mirror') ? title : `${title} | STL Mirror`;

  let html = baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${fullTitle}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${fullCanonical}"`
  );

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${fullTitle.replace(/"/g, '&quot;')}"`
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}"`
  );

  // Replace OG URL
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${fullCanonical}"`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${fullTitle.replace(/"/g, '&quot;')}"`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}"`
  );

  // Replace Twitter URL
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*"/,
    `<meta name="twitter:url" content="${fullCanonical}"`
  );

  return html;
}

// ─── Write HTML file to dist ──────────────────────────────────────────────────
function writeRouteHtml(routePath, html) {
  // Remove leading slash
  const relPath = routePath.replace(/^\//, '');

  let outputPath;
  if (relPath === '') {
    // Homepage: dist/index.html (already exists, overwrite with SEO)
    outputPath = path.join(DIST_DIR, 'index.html');
  } else {
    // Sub-routes: dist/blog/slug/index.html
    const dirPath = path.join(DIST_DIR, relPath);
    fs.mkdirSync(dirPath, { recursive: true });
    outputPath = path.join(dirPath, 'index.html');
  }

  fs.writeFileSync(outputPath, html, 'utf8');
}

function getSitemapParams(routePath) {
  if (routePath === '/') {
    return { changefreq: 'daily', priority: '1.0' };
  }
  if (['/blog', '/ai-tools', '/software'].includes(routePath)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (['/apk', '/pdf-tools', '/developer-tools', '/latest', '/most-downloaded', '/recently-updated'].includes(routePath)) {
    return { changefreq: 'weekly', priority: '0.8' };
  }
  if (routePath.startsWith('/blog/')) {
    return { changefreq: 'monthly', priority: '0.8' };
  }
  if (routePath.startsWith('/ai-tools/')) {
    return { changefreq: 'monthly', priority: '0.8' };
  }
  if (routePath.startsWith('/software/')) {
    return { changefreq: 'monthly', priority: '0.8' };
  }
  if (['/about', '/contact', '/editorial-policy', '/author/krishna-bhosale'].includes(routePath)) {
    return { changefreq: 'monthly', priority: '0.7' };
  }
  return { changefreq: 'yearly', priority: '0.5' };
}

function generateSitemapXml(routes) {
  const lastmod = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of routes) {
    const { changefreq, priority } = getSitemapParams(route.path);
    const loc = `${BASE_URL}${route.path === '/' ? '/' : route.path}`;
    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('🔧 STL Mirror — Generating per-page SEO HTML files...\n');

  // Read dynamic data
  const blogPosts = parseDataFile(
    path.join(__dirname, '..', 'src', 'data', 'blogPosts.js')
  );
  const aiTools = parseDataFile(
    path.join(__dirname, '..', 'src', 'data', 'aiToolsData.js')
  );
  const software = parseDataFile(
    path.join(__dirname, '..', 'src', 'data', 'softwareData.js'),
    'slug',
    'name',
    'description'
  );

  console.log(`  Found: ${blogPosts.length} blog posts, ${aiTools.length} AI tools, ${software.length} software pages`);

  // Build all routes
  const dynamicRoutes = [
    ...blogPosts.map(p => ({
      path: `/blog/${p.slug}`,
      title: p.title,
      description: p.description || `Read our expert guide on ${p.title}. Detailed review with tips, comparisons, and step-by-step instructions.`,
      canonical: `/blog/${p.slug}`,
    })),
    ...aiTools.map(t => ({
      path: `/ai-tools/${t.slug}`,
      title: t.title,
      description: t.description || `Honest hands-on review of ${t.title.split(':')[0]}. Features, pricing, use cases, and who should use it.`,
      canonical: `/ai-tools/${t.slug}`,
    })),
    ...software.map(s => ({
      path: `/software/${s.slug}`,
      title: s.title,
      description: s.description || `Free download and expert review of ${s.title.split(':')[0]}. Install guide, safety info, and alternatives.`,
      canonical: `/software/${s.slug}`,
    })),
  ];

  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  let generated = 0;
  let errors = 0;

  for (const route of allRoutes) {
    try {
      const html = generatePageHtml(route);
      writeRouteHtml(route.path, html);
      generated++;
    } catch (err) {
      console.error(`  ❌ Error generating ${route.path}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Generated ${generated} HTML files (${errors} errors)`);
  console.log(`📁 Output: ${DIST_DIR}`);

  // Generate and write sitemap.xml
  try {
    console.log('🔧 Generating sitemap.xml...');
    const sitemapXml = generateSitemapXml(allRoutes);
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    console.log(`✅ Generated sitemap.xml with ${allRoutes.length} entries`);
  } catch (err) {
    console.error('❌ Error generating sitemap.xml:', err.message);
  }

  // Verify a sample
  const samplePath = path.join(DIST_DIR, 'ai-tools', 'cursor-ai-code-editor-review', 'index.html');
  if (fs.existsSync(samplePath)) {
    const sample = fs.readFileSync(samplePath, 'utf8');
    const titleMatch = sample.match(/<title>([^<]+)<\/title>/);
    const canonicalMatch = sample.match(/<link rel="canonical" href="([^"]+)"/);
    console.log('\n🔍 Sample verification (cursor page):');
    console.log('  Title:', titleMatch?.[1]);
    console.log('  Canonical:', canonicalMatch?.[1]);
  }

  if (errors > 0) {
    process.exit(1);
  }
}

main();
