#!/usr/bin/env python3
"""TopWebTool build script: validate + zip directly from source, no temp copy."""
import os, re, sys, json, zipfile, datetime
from pathlib import Path

ROOT = Path(r"D:\TOPWEBTOOL")
ZIP = ROOT / f"deployment_{datetime.datetime.now():%d%m%y_%H%M%S}.zip"

EXCLUDE_DIRS = {
    '.git', '.kilo', '.opencode', '.vscode', 'node_modules',
    'dist', '.agent-zero', '.playwright-mcp', '.well-known', '.test', 'js',
    '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache', 'build-tools',
}
EXCLUDE_FILES = {
    '.gitignore', 'opencode.json', '.session-state.json',
    'AGENTS.md', 'README.md', 'ACTION_PLAN.md',
    'DEVELOPER_GUIDE.md', 'TODO.md', 'EMOTIONAL_DESIGN.md', 'PROJECT_STRUCTURE.md',
    'build-deploy.py', 'build-deploy.ps1', 'BUILD_ZIP_LIVE_SITE.ps1',
    'outdated URLS.txt', 'HOW_TO_FIX_AUDIT.txt', 'OTHER_AUDIT_ISSUES.txt',
    'NON INDEXABLE PAGES LIST.csv', 'missing-old-pages.txt',
    'package-lock.json', 'src.css',
}
EXCLUDE_SUFFIXES = {'.ps1', '.zip', '.py'}
RESERVED_NAMES = {
    'NUL', 'CON', 'PRN', 'AUX',
    'COM1','COM2','COM3','COM4','COM5','COM6','COM7','COM8','COM9',
    'LPT1','LPT2','LPT3','LPT4','LPT5','LPT6','LPT7','LPT8','LPT9',
}

def should_include(path: Path, rel: str) -> bool:
    if rel == 'js' + os.sep + 'context-engine.js' or rel == 'js/context-engine.js':
        return True
    parts = rel.split(os.sep)
    # Exclude dirs
    for p in parts:
        if p in EXCLUDE_DIRS or p in RESERVED_NAMES:
            return False
    # Exclude files
    if path.name in EXCLUDE_FILES:
        return False
    if path.suffix.lower() in EXCLUDE_SUFFIXES:
        return False
    return True

def validate():
    errors = 0
    tool_dirs = [d for d in ROOT.iterdir() if d.is_dir() and d.name not in EXCLUDE_DIRS and d.name not in RESERVED_NAMES]
    slugs = [d.name for d in tool_dirs]
    print(f"Found {len(slugs)} tool directories")

    # llms.txt
    llms = (ROOT / "llms.txt").read_text(encoding='utf-8')
    missing = [s for s in slugs if f"https://topwebtool.com/{s}/" not in llms]
    for page in ('privacy/', 'terms/', 'contact/', 'about/'):
        if f"https://topwebtool.com/{page}" not in llms:
            missing.append(page)
    if missing:
        print(f"FAIL llms.txt missing {len(missing)} entries")
        errors += 1
    else:
        print(f"OK llms.txt has all {len(slugs)} tools + core pages")

    # llms-full.txt
    full = (ROOT / "llms-full.txt").read_text(encoding='utf-8')
    missing = [s for s in slugs if f"https://topwebtool.com/{s}/" not in full]
    if missing:
        print(f"FAIL llms-full.txt missing {len(missing)} entries")
        errors += 1
    else:
        print(f"OK llms-full.txt has all {len(slugs)} tools")

    # sitemap.xml
    sitemap = (ROOT / "sitemap.xml").read_text(encoding='utf-8')
    expected = ["https://topwebtool.com/"]
    for slug in slugs:
        expected.append(f"https://topwebtool.com/{slug}/")
        for sub in (ROOT / slug).iterdir():
            if sub.is_dir():
                expected.append(f"https://topwebtool.com/{slug}/{sub.name}/")
    missing = [u for u in expected if u not in sitemap]
    if missing:
        print(f"FAIL sitemap.xml missing {len(missing)} URLs")
        errors += 1
    else:
        print(f"OK sitemap.xml has all {len(expected)} URLs")

    sitemap_urls = re.findall(r'<loc>(https://topwebtool\.com/[^<]+)</loc>', sitemap)
    allowed_html = {
        'https://topwebtool.com/privacy/',
        'https://topwebtool.com/terms/',
        'https://topwebtool.com/contact/',
        'https://topwebtool.com/about/',
    }
    html_urls = [u for u in sitemap_urls if '.html' in u and u not in allowed_html]
    if html_urls:
        print(f"FAIL sitemap.xml contains {len(html_urls)} redirecting .html URLs")
        errors += 1
    else:
        print("OK sitemap.xml has no redirecting .html URLs")

    # robots.txt
    robots = (ROOT / "robots.txt").read_text(encoding='utf-8')
    if 'Sitemap: https://topwebtool.com/sitemap.xml' not in robots:
        print("FAIL robots.txt missing sitemap")
        errors += 1
    else:
        print("OK robots.txt references sitemap")
    if 'Allow: /llms.txt' not in robots:
        print("FAIL robots.txt missing llms.txt")
        errors += 1
    else:
        print("OK robots.txt allows llms.txt")

    # api-catalog
    catalog = json.loads((ROOT / ".well-known" / "api-catalog").read_text(encoding='utf-8'))
    if catalog.get('name') != 'TopWebTool':
        print("FAIL api-catalog name mismatch")
        errors += 1
    else:
        print("OK .well-known/api-catalog valid")

    # _headers
    headers = (ROOT / "_headers").read_text(encoding='utf-8')
    if 'rel="llms.txt"' not in headers:
        print("FAIL _headers missing llms.txt Link")
        errors += 1
    else:
        print("OK _headers has llms.txt Link")
    if 'rel="api-catalog"' not in headers:
        print("FAIL _headers missing api-catalog Link")
        errors += 1
    else:
        print("OK _headers has api-catalog Link")
    if 'Vary: Accept' not in headers:
        print("FAIL _headers missing Vary: Accept")
        errors += 1
    else:
        print("OK _headers has Vary: Accept")

    # worker.js basic check
    worker = (ROOT / "worker.js").read_text(encoding='utf-8')
    if "addEventListener" in worker and "fetch" in worker and 'text/markdown' in worker:
        print("OK worker.js looks valid")
    else:
        print("FAIL worker.js missing expected patterns")
        errors += 1

    # JSON-LD spot check
    samples = [
        ROOT / 'index.html',
        ROOT / 'biweekly-mortgage-calculator' / 'index.html',
        ROOT / 'biweekly-mortgage-calculator' / 'mortgage-payoff-strategies-that-work' / 'index.html',
        ROOT / 'age-calculator' / 'index.html',
        ROOT / 'mortgage-calculator' / 'index.html',
    ]
    import html
    json_errors = 0
    for p in samples:
        if not p.exists():
            continue
        text = p.read_text(encoding='utf-8')
        m = re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>', text)
        if not m:
            continue
        try:
            json.loads(m.group(1))
        except Exception:
            print(f"FAIL JSON-LD parse error in {p.name}")
            json_errors += 1
    if json_errors == 0:
        print("OK JSON-LD valid on sample pages")
    else:
        errors += json_errors

    # Malformed tag check
    malformed = 0
    for html_path in ROOT.rglob('*.html'):
        rel = str(html_path.relative_to(ROOT))
        if not should_include(html_path, rel):
            continue
        lines = html_path.read_text(encoding='utf-8', errors='ignore').splitlines()
        for i in range(len(lines) - 1):
            line = lines[i].rstrip()
            nxt = lines[i + 1].strip()
            if re.match(r'^<[a-zA-Z][a-zA-Z0-9]*\s*$', line) and nxt == f'</{line[1:].strip()}>':
                malformed += 1
                break
    if malformed:
        print(f"FAIL {malformed} HTML files have malformed tags")
        errors += 1
    else:
        print("OK No malformed HTML tags found")

    if errors:
        print(f"\nVALIDATION FAILED: {errors} error(s)")
        sys.exit(1)
    print("\nALL VALIDATIONS PASSED")

def build_zip():
    if ZIP.exists():
        ZIP.unlink()

    count = 0
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, dirnames, filenames in os.walk(ROOT):
            # Filter dirs in-place to skip excluded (keep js for whitelisted files)
            dirnames[:] = [
                d for d in dirnames
                if (d not in EXCLUDE_DIRS or d == 'js') and d not in RESERVED_NAMES
            ]
            for fname in filenames:
                file_path = Path(dirpath) / fname
                rel = str(file_path.relative_to(ROOT))
                if not should_include(file_path, rel):
                    continue
                arcname = rel.replace(os.sep, '/')
                zf.write(file_path, arcname)
                count += 1

    size = ZIP.stat().st_size
    print(f"\nBUILD COMPLETE")
    print(f"  ZIP: {ZIP}")
    print(f"  Size: {size/1024/1024:.2f} MB")
    print(f"  Files: {count}")

if __name__ == '__main__':
    validate()
    build_zip()
