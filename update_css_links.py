#!/usr/bin/env python3
"""
TopWebTool Automation Link Injector (update_css_links.py)

A lightweight, production-safe, dry-run friendly Python script to automatically
link the new 'global.css' file across all 130+ HTML files in the repository.
It automatically calculates correct relative paths (e.g., './global.css',
'../global.css') based on directory nesting depth, ensuring zero broken links.
"""

import os
import sys
import re

def find_html_files(root_dir):
    """Recursively crawls the directory and yields all HTML filepaths."""
    ignored_dirs = {'.git', '.agent-zero', '.playwright-mcp', 'node_modules'}

    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # Prune ignored directories in-place to prevent scanning
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def calculate_relative_css_path(file_path, root_dir):
    """Calculates the correct relative path to global.css based on directory depth."""
    file_dir = os.path.dirname(os.path.abspath(file_path))
    abs_root = os.path.abspath(root_dir)

    if file_dir == abs_root:
        return "./global.css"

    # Calculate depth from root
    relative_dir = os.path.relpath(abs_root, file_dir)
    return os.path.join(relative_dir, "global.css").replace("\\", "/")

def inject_global_css(file_path, css_href, dry_run=True):
    """Injects or replaces the global.css stylesheet reference inside the HTML <head>."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Check if global.css is already linked
    if "global.css" in content:
        return False, "Already linked"

    # Search for an existing stylesheet link to replace, or inject before </head>
    target_link = f'<link rel="stylesheet" href="{css_href}">'

    # 1. Try to find standard stylesheet link tag to place global.css adjacent to
    style_pattern = r'<link\s+[^>]*rel="stylesheet"[^>]*>'
    match = re.search(style_pattern, content, re.IGNORECASE)

    modified_content = None
    if match:
        existing_link = match.group(0)
        # Place the new global.css link right after the existing styles.css link for proper cascades
        replacement = f"{existing_link}\n  {target_link}"
        modified_content = content.replace(existing_link, replacement, 1)
    else:
        # 2. Fallback: Inject before the closing </head> tag
        head_end = re.search(r'</head>', content, re.IGNORECASE)
        if head_end:
            replacement = f"  {target_link}\n</head>"
            modified_content = content.replace(head_end.group(0), replacement, 1)

    if modified_content is None:
        return False, "No <head> or stylesheet link tag found"

    if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        return True, "Successfully linked"

    return True, f"[Dry Run] Would link as: {css_href}"

def main():
    # Force dry-run unless user explicitly specifies --write
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] == "--write":
        dry_run = False

    root_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = find_html_files(root_dir)

    print("======================================================================")
    print("         TopWebTool - Global CSS Link Automation Injector")
    print("======================================================================")
    print(f"Found {len(html_files)} total HTML files to inspect.")
    if dry_run:
        print("Status: DRY RUN MODE. (No files will be modified).")
        print("To apply changes, run: python update_css_links.py --write")
    else:
        print("Status: WRITE MODE. (Modifying files in-place).")
    print("----------------------------------------------------------------------")

    success_count = 0
    skipped_count = 0
    error_count = 0

    for path in html_files:
        rel_path = os.path.relpath(path, root_dir)
        css_href = calculate_relative_css_path(path, root_dir)

        try:
            status, msg = inject_global_css(path, css_href, dry_run=dry_run)
            if status:
                success_count += 1
                print(f"[OK]  {rel_path:<50} -> {msg}")
            else:
                skipped_count += 1
                print(f"[SKP] {rel_path:<50} -> {msg}")
        except Exception as e:
            error_count += 1
            print(f"[ERR] {rel_path:<50} -> Error: {str(e)}")

    print("----------------------------------------------------------------------")
    print("Automation Summary:")
    print(f"  - Total files processed: {len(html_files)}")
    print(f"  - Successfully modified/would modify: {success_count}")
    print(f"  - Skipped (already linked or no head): {skipped_count}")
    print(f"  - Errors encountered: {error_count}")
    print("======================================================================")

if __name__ == "__main__":
    main()
