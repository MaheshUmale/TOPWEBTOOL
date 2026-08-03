import os
import re
import json
import argparse
from typing import List, Dict, Any

# Regex patterns to detect AdSense tags and check for sizing styles
ADSENSE_INDICATOR = re.compile(r'(adsbygoogle|pagead2\.googlesyndication|class=["\'].*?ad-)')
TARGET_TAG_PATTERN = re.compile(r'(<ins\s+[^>]*class=["\'][^"\']*adsbygoogle[^"\']*["\'][^>]*>|<div\s+[^>]*?class=["\'][^"\']*ad-[^"\']*["\'][^>]*>)')
SIZE_CHECK_PATTERN = re.compile(r'(height\s*=|min-height\s*=|style=["\'][^"\']*(height|h-\[))')

def audit_directory(target_folder: str) -> List[Dict[str, Any]]:
    """Scans a directory for front-end files containing AdSense containers missing min-height."""
    target_extensions = ('.html', '.js', '.jsx', '.tsx', '.vue', '.php')
    cls_issues = []

    if not os.path.exists(target_folder):
        print(json.dumps({"error": f"Path not found: {target_folder}"}))
        return []

    for root, _, files in os.walk(target_folder):
        for file in files:
            if file.endswith(target_extensions):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                except Exception:
                    continue  # Skip unreadable or locked system files
                
                # Full scan block to spot files utilizing AdSense scripts
                file_content = "".join(lines)
                if not ADSENSE_INDICATOR.search(file_content):
                    continue

                # Granular line-by-line inspection to pinpoint the exact code line
                for index, line in enumerate(lines):
                    line_num = index + 1
                    
                    if TARGET_TAG_PATTERN.search(line):
                        # Verify if the target line misses layout height constraints
                        if not SIZE_CHECK_PATTERN.search(line):
                            cls_issues.append({
                                "file_name": file,
                                "file_path": os.path.abspath(file_path),
                                "line_number": line_num,
                                "snippet": line.strip(),
                                "fix_status": "Missing structural height layout"
                            })
                            
    return cls_issues

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audit AdSense templates for CLS layout vulnerabilities.")
    parser.add_argument("--dir", required=True, help="Path to the website directory to scan.")
    args = parser.parse_args()

    results = audit_directory(args.dir)
    
    # Print pure JSON output so the AI Agent can parse it cleanly
    print(json.dumps(results, indent=2))
