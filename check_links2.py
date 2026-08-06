import os, re, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = 'http://localhost:8000'
tool_dirs = sorted([d for d in os.listdir('PUBLIC') if os.path.isdir(os.path.join('PUBLIC', d)) and not d.startswith('.')])

href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)
src_pattern = re.compile(r'src=["\']([^"\']+)["\']', re.IGNORECASE)

def find_links(tool):
    url = f'{BASE}/{tool}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read(100000).decode('utf-8', errors='ignore')
    except Exception as e:
        return tool, [], [f'Failed to load: {e}']
    
    links = href_pattern.findall(content) + src_pattern.findall(content)
    links = [l for l in links if l and not l.startswith(('http://', 'https://', '//', 'data:', '#'))]
    
    broken = []
    for link in set(links):
        if link.startswith('/'):
            check_url = f'{BASE}{link}'
        elif link.startswith('./'):
            check_url = f'{BASE}/{tool}/{link[2:]}'
        elif link.startswith('../'):
            parts = tool.split('/')
            up = link.count('../')
            base = '/'.join(parts[:-up]) if up < len(parts) else ''
            check_url = f'{BASE}/{base}/{link.replace("../", "")}'
        else:
            check_url = f'{BASE}/{tool}/{link}'
        try:
            req = urllib.request.Request(check_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status >= 400:
                    broken.append((link, resp.status))
        except urllib.error.HTTPError as e:
            broken.append((link, e.code))
        except Exception as e:
            broken.append((link, str(e)[:50]))
    
    return tool, links, broken

issues = []
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(find_links, t): t for t in tool_dirs}
    for future in as_completed(futures):
        tool, links, broken = future.result()
        if broken:
            issues.append((tool, broken[:10]))

print(f'Checked {len(tool_dirs)} tool pages')
if issues:
    print(f'Pages with broken links: {len(issues)}')
    for tool, broken in issues[:15]:
        print(f'  {tool}: {len(broken)} broken')
        for link, err in broken[:5]:
            print(f'    - {link} ({err})')
else:
    print('No broken internal links found.')

# Also check homepage and global assets
print()
print('Checking homepage and global assets...')
for path in ['/', '/global.js', '/global.css', '/styles.css', '/worker.js']:
    try:
        req = urllib.request.Request(f'{BASE}{path}', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            size = len(resp.read())
            print(f'  {path}: {resp.status} ({size} bytes)')
    except Exception as e:
        print(f'  {path}: ERROR - {e}')
