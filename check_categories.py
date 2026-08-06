import re
with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
ids = re.findall(r'id="category-title-([^"]+)"', content)
print('Category IDs:', ids)
aria_ids = re.findall(r'aria-labelledby="category-title-([^"]+)"', content)
print('Aria IDs:', aria_ids)
