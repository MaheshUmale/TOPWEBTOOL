with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
import re
# Find category sections with their IDs
sections = re.findall(r'<section[^>]*data-cat="([^"]+)"[^>]*aria-labelledby="category-title-[^"]+"[^>]*>', content)
print('Categories:', sections)
# Check a sample section structure
sample = re.search(r'<section[^>]*data-cat="finance"[^>]*>.*?</section>', content, re.DOTALL)
if sample:
    print('Sample section:', sample.group(0)[:500])
