import os
import json
import xml.etree.ElementTree as ET
from datetime import datetime
import openai # Setup your API key in environment variable

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITEMAP_FILE = os.path.join(BASE_DIR, "sitemap.xml")
INDEX_FILE = os.path.join(BASE_DIR, "index.html")

BLOG_TOPICS = [
    "{topic} Best Practices for 2026",
    "Common Errors When Using a {topic}",
    "Future Trends in {topic} Technology",
    "The Ultimate Guide to {topic}",
    "{topic} Optimization Tips for Professionals"
]

def generate_seo_content(topic, content_type="utility_description"):
    """
    Uses AI to generate unique, long-form HTML content to avoid AdSense thin-content penalties.
    Ensure OpenAI API key is set in your environment variables.
    """
    system_prompt = "You are an expert web developer and SEO writer. Output RAW HTML only. Do not use markdown wrappers like ```html."
    
    if content_type == "utility_description":
        prompt = f"Write a comprehensive, SEO-optimized 600-word HTML section explaining what a {topic} is, how it works, and why it's useful. Include <h2> and <h3> tags, lists, and FAQs. Mention it is 100% Free, No Sign-Up, No Registration."
    else:
        prompt = f"Write a unique, highly detailed 800-word SEO blog post in HTML format about: {topic}. Include actionable tips, structured headings, and bullet points to ensure high search engine rankings and zero plagiarism."

    # Replace with your actual LLM call
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

def create_tool_directory(tool_slug, tool_name):
    """Creates the tool folder, HTML page, and 5 interlinked blog posts."""
    tool_dir = os.path.join(BASE_DIR, tool_slug)
    os.makedirs(tool_dir, exist_ok=True)
    
    # 1. Generate Tool index.html
    description_html = generate_seo_content(tool_name, "utility_description")
    
    # Generate the breadcrumb, canonical, and layout
    html_content = f"""<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{tool_name} - 100% Free Exact Calculator & Tool | TopWebTool</title>
    <meta name="description" content="Use our free {tool_name} online. No Sign-Up / 100% Free / No Registration required. Lightning fast client-side processing.">
    <link rel="canonical" href="https://topwebtool.com/{tool_slug}/">
    <link rel="stylesheet" href="../styles.css">
</head>
<body class="bg-slate-100 dark:bg-[#090d16] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
    <header id="global-header"></header>

    <main class="flex-grow container mx-auto px-4 py-4 space-y-4 max-w-6xl">
        <!-- Breadcrumbs -->
        <nav class="text-sm font-medium mb-4" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
                <li class="flex items-center">
                    <a href="../" class="text-blue-600 dark:text-blue-400 hover:underline">Home</a>
                    <span class="mx-2 text-gray-500">/</span>
                </li>
                <li class="flex items-center text-gray-500" aria-current="page">{tool_name}</li>
            </ol>
        </nav>

        <h1 class="text-3xl font-bold mb-2">{tool_name}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">100% Free | No Sign-Up | Instant Results</p>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <!-- Main Utility Container -->
            <div class="lg:col-span-3 space-y-4">
                <!-- TOOL WIDGET GOES HERE -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                    <p><em>Developer: Insert specific JS/HTML for {tool_name} here</em></p>
                </div>
                
                <!-- SEO Content injected to bypass AdSense Thin Content -->
                <article class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
                    {description_html}
                </article>

                <!-- Interlinked Blog Directory -->
                <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-bold mb-3">Related Guides & Tutorials</h3>
                    <ul class="list-disc pl-5 space-y-2 text-blue-600 dark:text-blue-400">
"""
    
    # Generate the 5 blogs
    blog_urls = []
    for topic_template in BLOG_TOPICS:
        blog_title = topic_template.format(topic=tool_name)
        blog_slug = blog_title.lower().replace(" ", "-").replace("/", "").replace(",", "")
        blog_filename = f"{blog_slug}.html"
        
        # Write Blog File
        blog_html_body = generate_seo_content(blog_title, "blog")
        blog_full_html = create_blog_html(tool_slug, tool_name, blog_title, blog_html_body, blog_slug)
        with open(os.path.join(tool_dir, blog_filename), "w", encoding="utf-8") as f:
            f.write(blog_full_html)
            
        blog_urls.append(f"https://topwebtool.com/{tool_slug}/{blog_filename}")
        html_content += f'                        <li><a href="{blog_filename}">{blog_title}</a></li>\n'

    html_content += """
                    </ul>
                </section>
            </div>
            
            <!-- Trending Sidebar Search -->
            <aside class="lg:col-span-1 hidden lg:block">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                    <h3 class="font-bold mb-2">Search Tools</h3>
                    <input type="search" placeholder="Find a utility..." class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                    <div id="trending-utilities-sidebar" class="space-y-2 h-[500px] overflow-y-auto pr-2">
                        <!-- Populated by global.js -->
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <footer id="global-footer"></footer>
    <script src="../global.js"></script>
</body>
</html>"""

    # Save index.html
    with open(os.path.join(tool_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)
        
    return f"https://topwebtool.com/{tool_slug}/", blog_urls

def create_blog_html(tool_slug, tool_name, blog_title, blog_body, blog_slug):
    """Creates the template structure for a single SEO blog."""
    return f"""<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{blog_title} | TopWebTool</title>
    <link rel="canonical" href="https://topwebtool.com/{tool_slug}/{blog_slug}.html">
    <link rel="stylesheet" href="../styles.css">
</head>
<body class="bg-slate-100 dark:bg-[#090d16] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
    <header id="global-header"></header>
    <main class="flex-grow container mx-auto px-4 py-4 max-w-4xl space-y-4">
        <nav class="text-sm font-medium mb-4" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
                <li class="flex items-center">
                    <a href="../" class="text-blue-600 dark:text-blue-400 hover:underline">Home</a>
                    <span class="mx-2 text-gray-500">/</span>
                </li>
                <li class="flex items-center">
                    <a href="./" class="text-blue-600 dark:text-blue-400 hover:underline">{tool_name}</a>
                    <span class="mx-2 text-gray-500">/</span>
                </li>
                <li class="flex items-center text-gray-500" aria-current="page">Guide</li>
            </ol>
        </nav>
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
            <h1 class="text-3xl font-bold mb-4">{blog_title}</h1>
            {blog_body}
        </article>
    </main>
    <footer id="global-footer"></footer>
    <script src="../global.js"></script>
</body>
</html>"""

def update_sitemap(tool_url, blog_urls):
    """Parses existing sitemap.xml and appends the newly generated URLs."""
    ET.register_namespace('', "http://www.sitemaps.org/schemas/sitemap/0.9")
    tree = ET.parse(SITEMAP_FILE)
    root = tree.getroot()
    
    # Add Tool URL
    url_elem = ET.SubElement(root, "url")
    ET.SubElement(url_elem, "loc").text = tool_url
    ET.SubElement(url_elem, "changefreq").text = "weekly"
    ET.SubElement(url_elem, "priority").text = "0.9"

    # Add Blog URLs
    for b_url in blog_urls:
        b_elem = ET.SubElement(root, "url")
        ET.SubElement(b_elem, "loc").text = b_url
        ET.SubElement(b_elem, "changefreq").text = "monthly"
        ET.SubElement(b_elem, "priority").text = "0.7"

    tree.write(SITEMAP_FILE, encoding="utf-8", xml_declaration=True)
    print(f"Updated sitemap with {len(blog_urls) + 1} new URLs.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python builder.py <folder-slug> <Tool Name>")
        print("Example: python builder.py text-to-slug 'Text to Slug Converter'")
        sys.exit(1)
        
    t_slug = sys.argv[1]
    t_name = sys.argv[2]
    
    print(f"Generating {t_name} in /{t_slug} ...")
    main_url, b_urls = create_tool_directory(t_slug, t_name)
    update_sitemap(main_url, b_urls)
    print("Done! Ensure to run your Playwright verifications.")