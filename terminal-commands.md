---
name: windows-terminal-commands
description: Maps abstract file management actions (list, search, edit, view) to native Windows PowerShell and CMD commands.
compatibility: Windows 10/11, PowerShell (v5.1+ / pwsh v7+), CMD
---

# Windows Terminal Command Abstraction Skill

You are operating on a native Windows environment. Linux/Unix commands (e.g., `ls`, `grep`, `sed`, `cat`, `rm -rf`, `touch`) will FAIL. You must strictly use the native Windows PowerShell or CMD equivalents mapped below.

## 1. File & Directory Listing
* **Intent**: List files, show hidden files, or view directory contents.
* **PowerShell**: `Get-ChildItem` or `Get-ChildItem -Force` (for hidden files).
* **CMD**: `dir` or `dir /a` (for hidden files).
* *CRITICAL*: Do NOT use `ls` or `ll`.

## 2. File Searching & Locating
* **Intent**: Find a specific file by name within a folder structure.
* **PowerShell**: `Get-ChildItem -Recurse -Filter "filename.ext"`
* **CMD**: `dir /s /b *filename.ext*`
* *CRITICAL*: Do NOT use `find . -name` or `locate`.

## 3. Text Searching inside Files (Grep Alternative)
* **Intent**: Scan file contents for a specific string or pattern.
* **PowerShell**: `Select-String -Path ".\*.md" -Pattern "SearchTerm"`
* **CMD**: `findstr /i "SearchTerm" *.md`
* *CRITICAL*: Do NOT use `grep`.

## 4. Viewing File Contents
* **Intent**: Read or display the contents of a file in the terminal.
* **PowerShell**: `Get-Content -Path ".\file.md"`
* **CMD**: `type file.md`
* *CRITICAL*: Do NOT use `cat` or `less`.

## 5. File Creation & Modification (Editing)
* **Intent**: Create empty files, append text, or overwrite contents.
* **PowerShell (Create Empty)**: `New-Item -Path ".\file.md" -ItemType File -Force`
* **PowerShell (Write/Overwrite)**: `"Content" | Set-Content -Path ".\file.md" -Encoding utf8`
* **PowerShell (Append)**: `"New Line" | Add-Content -Path ".\file.md" -Encoding utf8`
* **CMD (Append)**: `echo New Line >> file.md`
* *CRITICAL*: Do NOT use `touch`, `sed -i`, `nano`, or `vim`. Windows terminals do not natively support interactive terminal text editors unless explicitly installed.

## 6. Deleting & Cleaning
* **Intent**: Delete files or recursively remove folders.
* **PowerShell**: `Remove-Item -Path ".\target" -Recurse -Force`
* **CMD**: `del file.txt` (files) or `rmdir /s /q folder` (directories).
* *CRITICAL*: Do NOT use `rm -rf`.

---

## Strict Execution Guardrails

1. **Verify Terminal First**: Run `connection_check` or look at your environment context. If the shell profile indicates Windows, intercept your own thought process before emitting a command block.
2. **Handle Aliases Cautiously**: While PowerShell has built-in aliases like `ls` or `cat`, they do not support Linux flags (like `ls -la` or `cat -n`). To prevent syntax errors, completely avoid the aliases and write out the full native cmdlet (e.g., `Get-ChildItem`).
3. **Path Separators**: Always use backslashes (`\`) for local Windows paths if using CMD, or standard relative paths (`.\folder\file.md`) in PowerShell. Do not use trailing forward slashes for directories.
