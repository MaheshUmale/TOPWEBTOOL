#!/usr/bin/env python3
"""
TopWebTool Automation Link Injector & Speed Optimizer (update_css_links.py)

A production-safe, dry-run friendly Python script to automatically:
1. Link 'global.css' across all HTML files with depth-appropriate relative paths.
2. Ensure that the 'global.js' script tag uses 'defer' to remove JS from the critical path.
3. Inject a render-blocking inline theme script at the very top of <head> to completely
   eliminate dark mode flickering/flashing during cross-page navigation.
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

def optimize_html_file(file_path, css_href, dry_run=True):
    """Links global.css, adds early theme script, and appends defer to global.js."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    modified = False
    log_actions = []

    # 1. INJECT EARLY BLOCKING THEME TOGGLE SCRIPT TO ELIMINATE FLICKER
    theme_script_sig = "localStorage.getItem('theme')"
    if theme_script_sig not in content:
        theme_script = (
            "\n  <!-- Early Blocking Theme Loader: Eliminates Light/Dark Flashing/Flickering -->\n"
            "  <script>\n"
            "    (function() {\n"
            "      try {\n"
            "        const theme = localStorage.getItem('theme');\n"
            "        if (theme === 'dark') {\n"
            "          document.documentElement.classList.add('dark');\n"
            "          document.documentElement.classList.remove('light');\n"
            "        } else {\n"
            "          document.documentElement.classList.remove('dark');\n"
            "          document.documentElement.classList.add('light');\n"
            "        }\n"
            "      } catch (e) {}\n"
            "    })();\n"
            "  </script>"
        )

        # Inject immediately after opening <head> tag
        head_start_match = re.search(r'<head[^>]*>', content, re.IGNORECASE)
        if head_start_match:
            head_start_tag = head_start_match.group(0)
            replacement = f"{head_start_tag}{theme_script}"
            content = content.replace(head_start_tag, replacement, 1)
            modified = True
            log_actions.append("Injected early theme load script")

    # 2. LINK GLOBAL.CSS
    if "global.css" not in content:
        target_link = f'<link rel="stylesheet" href="{css_href}">'
        # Search for an existing stylesheet link to place global.css adjacent to
        style_pattern = r'<link\s+[^>]*rel="stylesheet"[^>]*>'
        match = re.search(style_pattern, content, re.IGNORECASE)

        if match:
            existing_link = match.group(0)
            replacement = f"{existing_link}\n  {target_link}"
            content = content.replace(existing_link, replacement, 1)
            modified = True
            log_actions.append(f"Linked global.css as: {css_href}")
        else:
            # Fallback: Inject before the closing </head> tag
            head_end = re.search(r'</head>', content, re.IGNORECASE)
            if head_end:
                replacement = f"  {target_link}\n</head>"
                content = content.replace(head_end.group(0), replacement, 1)
                modified = True
                log_actions.append(f"Linked global.css before </head> as: {css_href}")

    # 3. ADD DEFER TO GLOBAL.JS
    global_js_pattern = r'<script\s+([^>]*src="[^"]*global\.js"[^>]*)>'
    js_match = re.search(global_js_pattern, content, re.IGNORECASE)
    if js_match:
        attrs = js_match.group(1)
        if "defer" not in attrs:
            # Add defer attribute
            replacement_attrs = attrs + " defer"
            content = content.replace(attrs, replacement_attrs, 1)
            modified = True
            log_actions.append("Appended 'defer' to global.js")

    if not modified:
        return False, "Already optimized"

    if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, ", ".join(log_actions)

    return True, f"[Dry Run] {', '.join(log_actions)}"

def main():
    # Force dry-run unless user explicitly specifies --write
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] == "--write":
        dry_run = False

    root_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = find_html_files(root_dir)

    print("======================================================================")
    print("      TopWebTool - Global CSS & JS Defer Link Optimizer")
    print("======================================================================")
    print(f"Found {len(html_files)} total HTML files to process.")
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
            status, msg = optimize_html_file(path, css_href, dry_run=dry_run)
            if status:
                success_count += 1
                print(f"[OK]  {rel_path:<50} -> {msg}")
            else:
                skipped_count += 1
        except Exception as e:
            error_count += 1
            print(f"[ERR] {rel_path:<50} -> Error: {str(e)}")

    print("----------------------------------------------------------------------")
    print("Optimization Summary:")
    print(f"  - Total files processed: {len(html_files)}")
    print(f"  - Modified/Would modify: {success_count}")
    print(f"  - Skipped (already optimized): {skipped_count}")
    print(f"  - Errors encountered: {error_count}")
    print("======================================================================")

if __name__ == "__main__":
    main()
