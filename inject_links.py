import re

with open('src/data/blogPosts.js', 'r') as f:
    content = f.read()

# First we need to extract the slugs and categories to build internal links
posts = []
blocks = re.split(r'\n  \{', content)
for block in blocks:
    id_m = re.search(r"id:\s*(\d+),", block)
    slug_m = re.search(r"slug:\s*'([^']+)'", block)
    cat_m = re.search(r"category:\s*'([^']+)'", block)
    title_m = re.search(r"title:\s*'([^']+)'", block)
    if id_m and slug_m and cat_m and title_m:
        posts.append({
            'id': int(id_m.group(1)),
            'slug': slug_m.group(1),
            'cat': cat_m.group(1),
            'title': title_m.group(1)
        })

import random
random.seed(42)

def replace_content(match):
    full_block = match.group(0)
    
    # Extract this post's slug
    slug_m = re.search(r"slug:\s*'([^']+)'", full_block)
    if not slug_m: return full_block
    my_slug = slug_m.group(1)
    
    my_post = next((p for p in posts if p['slug'] == my_slug), None)
    if not my_post: return full_block

    # Skip if we already injected internal links
    if 'Related Resources' in full_block:
        return full_block

    # Pick 2-3 related posts in the same category
    same_cat = [p for p in posts if p['cat'] == my_post['cat'] and p['slug'] != my_slug]
    # Pick 1 random post from any category
    other_cat = [p for p in posts if p['cat'] != my_post['cat']]
    
    selected = random.sample(same_cat, min(2, len(same_cat))) + random.sample(other_cat, 1)
    
    links_html = "\\n\\n<h3>Related Resources</h3>\\n<ul>"
    for s in selected:
        links_html += f"\\n  <li><a href=\"/blog/{s['slug']}\">{s['title']}</a></li>"
    links_html += "\\n</ul>\\n"
    
    # Inject before Conclusion, or at the end of the content string
    # The content string is enclosed in backticks or quotes
    # Let's match the content field exactly.
    # Note: content: `...`
    
    # Find the content field
    content_m = re.search(r"(content:\s*`)(.*?)(`,)", full_block, flags=re.DOTALL)
    if content_m:
        c_prefix = content_m.group(1)
        c_body = content_m.group(2)
        c_suffix = content_m.group(3)
        
        # Inject links before <h2>Conclusion</h2> or at end
        if '<h2>Conclusion</h2>' in c_body:
            c_body = c_body.replace('<h2>Conclusion</h2>', links_html + '<h2>Conclusion</h2>')
        else:
            c_body += links_html
            
        new_block = full_block[:content_m.start()] + c_prefix + c_body + c_suffix + full_block[content_m.end():]
        return new_block
        
    return full_block

new_content = re.sub(r"(\n  \{.*?(?=\n  \{|\Z))", replace_content, content, flags=re.DOTALL)

with open('src/data/blogPosts.js', 'w') as f:
    f.write(new_content)

print("Injected internal links into all posts.")
