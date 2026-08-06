import os, re

PUBLIC = 'PUBLIC'

# Tools with missing guide pages
tools_missing_guides = [
    'crypto-position-size', 'macro-diet-planner', 'markup-margin-tool',
    'student-loan-idr', 'rent-vs-buy-calculator'
]

for tool in tools_missing_guides:
    idx_path = os.path.join(PUBLIC, tool, 'index.html')
    if not os.path.exists(idx_path):
        continue
    
    with open(idx_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    
    # Remove "Informative Articles & Guides Section" if guide links are missing
    guide_section = re.search(r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->', content, re.DOTALL)
    if guide_section:
        section_text = guide_section.group(0)
        guide_links = re.findall(r'href=["\'](\./([^"\']+))["\']', section_text)
        any_exists = False
        for href, filename in guide_links:
            if os.path.exists(os.path.join(PUBLIC, tool, filename)):
                any_exists = True
                break
        
        if not any_exists:
            content = re.sub(r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->', '', content, flags=re.DOTALL)
            print(f'Removed guides section from {tool}')
    
    # Also handle rent-vs-buy which has no end comment
    if tool == 'rent-vs-buy-calculator' and 'Informative Articles & Guides Section' in content:
        # Remove from start comment to the next section start
        content = re.sub(
            r'<!-- Informative Articles & Guides Section -->.*?(?=<!-- TARGET INJECTION POINT)',
            '',
            content,
            flags=re.DOTALL
        )
        print(f'Removed guides section from {tool} (no end comment)')
    
    if content != original:
        with open(idx_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Saved {tool}')
    else:
        print(f'No changes for {tool}')

print('Done fixing broken links.')
