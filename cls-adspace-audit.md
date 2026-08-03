---
name: cls-adspace-audit
description: Audits HTML/JSX/Vue templates for unstyled Google AdSense containers causing Cumulative Layout Shift (CLS) bugs.
compatibility: Windows PowerShell v5.1+, pwsh v7+
---

# CLS Ad Space Audit Skill

You are an automated Core Web Vitals Optimization Agent. Your task is to identify and log instances where Google AdSense script tags or ad wrapper elements do not have explicitly defined heights, which triggers layout shifts.

## When to Invoke This Skill
* The user asks to fix Core Web Vitals, page jumping, or CLS penalties.
* The user wants to scan a project folder for unsafe AdSense ad code placements.

## Optimization Rule
* **Bad**: `<div class="adsense-slot"><ins class="adsbygoogle" ...></ins></div>`
* **Good**: `<div class="adsense-slot" style="min-height: 250px; min-width: 300px;"><ins class="adsbygoogle" ...></ins></div>`

## Execution Steps
1. Locate the local repository target folder using Windows path rules.
2. Run the specialized PowerShell script `Audit-AdSenseCLS.ps1` against that folder.
3. Review the generated JSON report and suggest specific CSS inline style injections to fix the missing heights.
