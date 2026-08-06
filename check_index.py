with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
import re
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\'][^>]*>', content)
links = re.findall(r'<link[^>]*href=["\']([^"\']+)["\'][^>]*>', content)
print('Scripts:', scripts[:10])
print('Links:', links[:10])
