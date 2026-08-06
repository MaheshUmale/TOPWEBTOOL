import os
import re
from pathlib import Path

BASE = Path(r"D:\TOPWEBTOOL")
PUBLIC = BASE / "PUBLIC"

errors = []
warnings = []

# 1. Check all tool directories
tool_dirs = [d for d in BASE.iterdir() if d.is_dir() and d.name not in {'.agent-zero', '.devUtilities', '.kilo', '.opencode', '.playwright-mcp', '.vscode', 'node_modules', 'PUBLIC'}]
print(f"Found {len(tool_dirs)} tool directories")

for d in tool_dirs:
    idx = d / "index.html"
    if not idx.exists():
        errors.append(f"Missing index.html: {d.name}")
        continue
    
    content = idx.read_text(encoding='utf-8')
    
    # Check for global.js
    if 'global.js' not in content:
        errors.append(f"Missing global.js: {d.name}/index.html")
    
    # Check for global-header
    if 'global-header' not in content:
        errors.append(f"Missing global-header: {d.name}/index.html")
    
    # Check for global-footer
    if 'global-footer' not in content:
        errors.append(f"Missing global-footer: {d.name}/index.html")
    
    # Check for ad-slot-a
    if 'ad-slot-a' not in content:
        errors.append(f"Missing ad-slot-a: {d.name}/index.html")
    
    # Check for trending-sidebar
    if 'trending-sidebar' not in content:
        errors.append(f"Missing trending-sidebar: {d.name}/index.html")

print(f"Tool pages checked: {len(tool_dirs)}")

# 2. Check all article pages
article_count = 0
article_issues = 0
for d in tool_dirs:
    articles = list(d.glob("*.html"))
    for a in articles:
        if a.name == 'index.html':
            continue
        article_count += 1
        content = a.read_text(encoding='utf-8')
        
        if 'global.js' not in content:
            article_issues += 1
            errors.append(f"Article missing global.js: {d.name}/{a.name}")
        
        if '<article class="prose' not in content:
            article_issues += 1
            errors.append(f"Article missing prose: {d.name}/{a.name}")

print(f"Total articles: {article_count}")
print(f"Article issues: {article_issues}")

# 3. Check homepage
homepage = BASE / "index.html"
if homepage.exists():
    content = homepage.read_text(encoding='utf-8')
    tool_cards = len(re.findall(r'class="tool-card', content))
    print(f"Homepage tool cards: {tool_cards}")
    
    if tool_cards != 84:
        warnings.append(f"Expected 84 tool cards, found {tool_cards}")
    
    # Check for corrupted icons
    corrupted = re.findall(r'<span class="text-2xl"[^>]*>([^<]{1,10})</span>', content)
    bad_icons = [c for c in corrupted if len(c) < 2 or c in ['ð', 'â', 'Ÿ', '', '¡', 'œ', '™', 'ž', '˜', '', '£', '¢', '±', '•', '¦', '°', '¥', '¬']]
    if bad_icons:
        errors.append(f"Found {len(bad_icons)} corrupted icons in homepage")
else:
    errors.append("Missing index.html")

# 4. Check global.js
global_js = BASE / "global.js"
if global_js.exists():
    content = global_js.read_text(encoding='utf-8')
    
    # Count tools in registry
    paths = re.findall(r"path: '/([^']+)'", content)
    print(f"Tools in global.js registry: {len(paths)}")
    
    if len(paths) != 84:
        warnings.append(f"Expected 84 tools in global.js, found {len(paths)}")
    
    # Check for unescaped quotes in desc
    descs = re.findall(r"desc: '([^']*)'", content)
    bad_descs = [d for d in descs if "'" in d]
    if bad_descs:
        errors.append(f"Found {len(bad_descs)} unescaped quotes in global.js desc fields")
else:
    errors.append("Missing global.js")

# 5. Check PUBLIC folder
public_tools = [d for d in PUBLIC.iterdir() if d.is_dir() and d.name not in {'.agent-zero', '.devUtilities', '.kilo', '.opencode', '.playwright-mcp', '.vscode', 'node_modules'}]
print(f"PUBLIC tool directories: {len(public_tools)}")

if len(public_tools) != 84:
    warnings.append(f"Expected 84 PUBLIC tool dirs, found {len(public_tools)}")

# Summary
print("\n=== VERIFICATION SUMMARY ===")
print(f"Errors: {len(errors)}")
print(f"Warnings: {len(warnings)}")

if errors:
    print("\nERRORS:")
    for e in errors[:20]:
        print(f"  - {e}")
    if len(errors) > 20:
        print(f"  ... and {len(errors) - 20} more")

if warnings:
    print("\nWARNINGS:")
    for w in warnings[:10]:
        print(f"  - {w}")
    if len(warnings) > 10:
        print(f"  ... and {len(warnings) - 10} more")

if not errors:
    print("\n✓ ALL CHECKS PASSED")
else:
    print("\n✗ VERIFICATION FAILED")
    exit(1)
