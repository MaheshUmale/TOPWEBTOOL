#!/usr/bin/env python3
"""Quick link checker for PUBLIC tool pages."""
import os
import re
import urllib.parse

PUBLIC = "PUBLIC"
tool_dirs = sorted([d for d in os.listdir(PUBLIC) if os.path.isdir(os.path.join(PUBLIC, d)) and not d.startswith('.')])

broken = []
checked = 0

for tool in tool_dirs:
    tool_path = os.path.join(PUBLIC, tool)
    html_files = [f for f in os.listdir(tool_path) if f.endswith('.html')]
    for html_file in html_files:
        filepath = os.path.join(tool_path, html_file)
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        links = re.findall(r'href="([^"]+)"', content)
        for link in links:
            if link.startswith('http') or link.startswith('//') or link.startswith('#'):
                continue
            if link.startswith('/'):
                target = os.path.normpath(os.path.join(PUBLIC, link.lstrip('/')))
            else:
                target = os.path.normpath(os.path.join(os.path.dirname(filepath), link))
            if not os.path.exists(target):
                broken.append((filepath, link, target))
        checked += 1

print(f"Checked {checked} HTML files across {len(tool_dirs)} tools.")
if broken:
    print(f"BROKEN LINKS: {len(broken)}")
    for src, link, target in broken[:20]:
        print(f"  {src} -> {link} (expected: {target})")
else:
    print("No broken internal links found.")
