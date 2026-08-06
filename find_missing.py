import os, re

public = 'PUBLIC'
tool_dirs = sorted([d for d in os.listdir(public) if os.path.isdir(os.path.join(public, d)) and not d.startswith('.')])

missing_guides = []
missing_related = []

for tool in tool_dirs:
    guides = ['guide.html', 'best-practices.html', 'common-errors.html', 'optimization-tips.html', 'future-trends.html']
    missing = [g for g in guides if not os.path.isfile(os.path.join(public, tool, tool + '-' + g))]
    if missing:
        missing_guides.append((tool, missing))
    
    idx_path = os.path.join(public, tool, 'index.html')
    if os.path.exists(idx_path):
        with open(idx_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        related = re.findall(r'href=["\'](\.\./([^/\"]+)/)["\']', content)
        for rel, rel_tool in related:
            if not os.path.isdir(os.path.join(public, rel_tool)):
                missing_related.append((tool, rel_tool))

print(f'Tools missing guide pages: {len(missing_guides)}')
for tool, guides in missing_guides:
    print(f'  {tool}: {guides}')

print(f'\nTools with missing related tool links: {len(missing_related)}')
for tool, rel_tool in missing_related:
    print(f'  {tool} -> ../{rel_tool}/')
