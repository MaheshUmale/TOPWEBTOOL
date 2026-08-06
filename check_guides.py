import os, re

tools = ['car-lease-estimator', 'inflation-calculator', 'mortgage-calculator', 'rent-vs-buy-calculator']
for tool in tools:
    path = os.path.join('PUBLIC', tool, 'index.html')
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    guides = re.findall(r'href=["\'](\./([^"\']+))["\']', content)
    guide_files = [g for g in guides if 'guide' in g[1] or 'best-practices' in g[1] or 'common-errors' in g[1] or 'optimization-tips' in g[1] or 'future-trends' in g[1]]
    print(f'{tool}: {len(guide_files)} guide links found')
    for g in guide_files[:5]:
        print(f'  - {g[0]}')
