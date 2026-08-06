import re

with open('PUBLIC/crypto-position-size/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
match = re.search(r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->', content, re.DOTALL)
print('Match:', bool(match))
if match:
    text = match.group(0)
    links = re.findall(r'href=["\'](\./([^"\']+))["\']', text)
    print('Links found:', len(links))
    for l in links[:5]:
        print(l)
