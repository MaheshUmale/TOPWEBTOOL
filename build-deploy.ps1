<#
.SYNOPSIS
    TopWebTool Build & Deploy Script
    Validates AI-friendliness files are in sync and creates deployment ZIP
.DESCRIPTION
    Checks llms.txt, llms-full.txt, sitemap.xml, robots.txt, api-catalog, _headers
    then builds a clean deployment.zip excluding dev files and reserved device names.
#>

param(
    [switch]$SkipValidation,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$liveSite = 'D:\LIVE_SITE'
$zipPath = Join-Path $root 'deployment.zip'

function Write-Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "  [FAIL] $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  $msg" -ForegroundColor Yellow }

# --------------------------------------------------
# 1. COLLECT PROJECT STRUCTURE
# --------------------------------------------------
Write-Step "Scanning project structure"

$toolDirs = Get-ChildItem -Path $root -Directory | Where-Object {
    $_.Name -notlike '.*' -and
    $_.Name -ne 'node_modules' -and
    $_.Name -ne 'dist' -and
    $_.Name -ne '.kilo' -and
    $_.Name -ne '.opencode' -and
    $_.Name -ne '.vscode' -and
    $_.Name -ne '.agent-zero'
}
$toolSlugs = $toolDirs | ForEach-Object { $_.Name }
$toolCount = $toolSlugs.Count
Write-Info "Found $toolCount tool directories"

# Collect all HTML pages (tool dirs + article subdirs)
$htmlPages = @()
$htmlPages += Join-Path $root 'index.html'
$htmlPages += Get-ChildItem -Path $root -Filter 'index.html' -Recurse | Where-Object {
    $_.FullName -notlike '*node_modules*' -and
    $_.FullName -notlike '*.dist*' -and
    $_.FullName -notlike '*.kilo*' -and
    $_.FullName -notlike '*.opencode*' -and
    $_.FullName -notlike '*.vscode*' -and
    $_.FullName -notlike '*.agent-zero*' -and
    $_.FullName -notlike '*.playwright-mcp*'
} | ForEach-Object { $_.FullName }

$pageCount = $htmlPages.Count
Write-Info "Found $pageCount HTML pages"

# --------------------------------------------------
# 2. VALIDATION
# --------------------------------------------------
if (-not $SkipValidation) {
    Write-Step "Validating AI-friendliness files"

    $errors = 0

    # --- llms.txt ---
    Write-Info "Checking llms.txt..."
    $llmsPath = Join-Path $root 'llms.txt'
    if (-not (Test-Path $llmsPath)) {
        Write-Fail "llms.txt missing"
        $errors++
    } else {
        $llmsContent = Get-Content -Path $llmsPath -Raw
        $missingFromLlms = @()
        foreach ($slug in $toolSlugs) {
            if ($llmsContent -notmatch [regex]::Escape("https://topwebtool.com/$slug/")) {
                $missingFromLlms += $slug
            }
        }
        # Check core pages
        $corePages = @('privacy.html', 'terms.html', 'contact.html', 'about.html')
        foreach ($page in $corePages) {
            if ($llmsContent -notmatch [regex]::Escape("https://topwebtool.com/$page")) {
                $missingFromLlms += $page
            }
        }
        if ($missingFromLlms.Count -gt 0) {
            Write-Fail "llms.txt missing $($missingFromLlms.Count) entries: $($missingFromLlms -join ', ')"
            $errors++
        } else {
            Write-Ok "llms.txt has all $toolCount tools + core pages"
        }
    }

    # --- llms-full.txt ---
    Write-Info "Checking llms-full.txt..."
    $llmsFullPath = Join-Path $root 'llms-full.txt'
    if (-not (Test-Path $llmsFullPath)) {
        Write-Fail "llms-full.txt missing"
        $errors++
    } else {
        $llmsFullContent = Get-Content -Path $llmsFullPath -Raw
        $missingFromFull = @()
        foreach ($slug in $toolSlugs) {
            if ($llmsFullContent -notmatch [regex]::Escape("https://topwebtool.com/$slug/")) {
                $missingFromFull += $slug
            }
        }
        if ($missingFromFull.Count -gt 0) {
            Write-Fail "llms-full.txt missing $($missingFromFull.Count) entries: $($missingFromFull -join ', ')"
            $errors++
        } else {
            Write-Ok "llms-full.txt has all $toolCount tools"
        }
    }

    # --- sitemap.xml ---
    Write-Info "Checking sitemap.xml..."
    $sitemapPath = Join-Path $root 'sitemap.xml'
    if (-not (Test-Path $sitemapPath)) {
        Write-Fail "sitemap.xml missing"
        $errors++
    } else {
        try {
            $xml = [xml](Get-Content -Path $sitemapPath -Raw)
            $sitemapUrls = $xml.urlset.url | ForEach-Object { $_.loc }
            $expectedUrls = @('https://topwebtool.com/')
            foreach ($slug in $toolSlugs) {
                $toolDir = Join-Path $root $slug
                $expectedUrls += "https://topwebtool.com/$slug/"
                $articleDirs = Get-ChildItem -Path $toolDir -Directory -ErrorAction SilentlyContinue
                foreach ($article in $articleDirs) {
                    $expectedUrls += "https://topwebtool.com/$slug/$($article.Name)/"
                }
            }
            $missingFromSitemap = $expectedUrls | Where-Object { $_ -notin $sitemapUrls }
            if ($missingFromSitemap.Count -gt 0) {
                Write-Fail "sitemap.xml missing $($missingFromSitemap.Count) URLs"
                $errors++
            } else {
                Write-Ok "sitemap.xml has all $($expectedUrls.Count) URLs"
            }
        } catch {
            Write-Fail "sitemap.xml parse error: $_"
            $errors++
        }
    }

    # --- robots.txt ---
    Write-Info "Checking robots.txt..."
    $robotsPath = Join-Path $root 'robots.txt'
    if (-not (Test-Path $robotsPath)) {
        Write-Fail "robots.txt missing"
        $errors++
    } else {
        $robots = Get-Content -Path $robotsPath -Raw
        $hasSitemap = $robots -match 'Sitemap:\s*https://topwebtool.com/sitemap.xml'
        $hasLlms = $robots -match 'Allow:\s*/llms\.txt'
        if (-not $hasSitemap) {
            Write-Fail "robots.txt missing sitemap reference"
            $errors++
        } else {
            Write-Ok "robots.txt references sitemap"
        }
        if (-not $hasLlms) {
            Write-Fail "robots.txt missing llms.txt allow"
            $errors++
        } else {
            Write-Ok "robots.txt allows llms.txt"
        }
    }

    # --- .well-known/api-catalog ---
    Write-Info "Checking .well-known/api-catalog..."
    $catalogPath = Join-Path (Join-Path $root '.well-known') 'api-catalog'
    if (-not (Test-Path $catalogPath)) {
        Write-Fail ".well-known/api-catalog missing"
        $errors++
    } else {
        try {
            $catalog = Get-Content -Path $catalogPath -Raw | ConvertFrom-Json
            if ($catalog.name -ne 'TopWebTool') {
                Write-Fail "api-catalog name mismatch"
                $errors++
            } else {
                Write-Ok ".well-known/api-catalog valid JSON"
            }
        } catch {
            Write-Fail ".well-known/api-catalog parse error: $_"
            $errors++
        }
    }

    # --- _headers ---
    Write-Info "Checking _headers..."
    $headersPath = Join-Path $root '_headers'
    if (-not (Test-Path $headersPath)) {
        Write-Fail "_headers missing"
        $errors++
    } else {
        $headers = Get-Content -Path $headersPath -Raw
        $hasLlmsLink = $headers -match 'rel="llms\.txt"'
        $hasApiLink = $headers -match 'rel="api-catalog"'
        $hasVary = $headers -match 'Vary:\s*Accept'
        if (-not $hasLlmsLink) {
            Write-Fail "_headers missing llms.txt Link header"
            $errors++
        } else {
            Write-Ok "_headers has llms.txt Link"
        }
        if (-not $hasApiLink) {
            Write-Fail "_headers missing api-catalog Link header"
            $errors++
        } else {
            Write-Ok "_headers has api-catalog Link"
        }
        if (-not $hasVary) {
            Write-Fail "_headers missing Vary: Accept"
            $errors++
        } else {
            Write-Ok "_headers has Vary: Accept"
        }
    }

    # --- worker.js ---
    Write-Info "Checking worker.js..."
    $workerPath = Join-Path $root 'worker.js'
    if (-not (Test-Path $workerPath)) {
        Write-Fail "worker.js missing"
        $errors++
    } else {
        $worker = Get-Content -Path $workerPath -Raw
        if ($worker -match "addEventListener\('fetch'" -and $worker -match 'text/markdown') {
            Write-Ok "worker.js looks valid"
        } else {
            Write-Fail "worker.js missing expected patterns"
            $errors++
        }
    }

    # --- JSON-LD spot check (sample 5 pages) ---
    Write-Info "Checking JSON-LD on sample pages..."
    $samplePages = @(
        (Join-Path $root 'index.html'),
        (Join-Path (Join-Path $root 'biweekly-mortgage-calculator') 'index.html'),
        (Join-Path (Join-Path (Join-Path $root 'biweekly-mortgage-calculator') 'mortgage-payoff-strategies-that-work') 'index.html'),
        (Join-Path (Join-Path $root 'age-calculator') 'index.html'),
        (Join-Path (Join-Path $root 'mortgage-calculator') 'index.html')
    )
    $jsonLdErrors = 0
    foreach ($page in $samplePages) {
        if (-not (Test-Path $page)) { continue }
        $html = Get-Content -Path $page -Raw
        if ($html -match '<script type="application/ld\+json">([\s\S]*?)</script>') {
            try {
                $null = $Matches[1] | ConvertFrom-Json
            } catch {
                Write-Fail "JSON-LD parse error in $page"
                $jsonLdErrors++
            }
        }
    }
    if ($jsonLdErrors -eq 0) {
        Write-Ok "JSON-LD valid on sample pages"
    } else {
        $errors += $jsonLdErrors
    }

    # --- Malformed HTML tags ---
    Write-Info "Checking for malformed HTML tags..."
    $malformed = 0
    foreach ($page in $htmlPages) {
        $lines = Get-Content -Path $page
        for ($i = 0; $i -lt $lines.Count - 1; $i++) {
            $line = $lines[$i].TrimEnd()
            $next = $lines[$i + 1].Trim()
            if ($line -match '^<[a-zA-Z][a-zA-Z0-9]*\s*$' -and $next -eq ('</' + $line.Substring(1).Trim() + '>')) {
                $malformed++
                break
            }
        }
    }
    if ($malformed -gt 0) {
        Write-Fail "$malformed HTML files have malformed tags (opening tag split across lines)"
        $errors++
    } else {
        Write-Ok "No malformed HTML tags found"
    }

    if ($errors -gt 0) {
        Write-Host "`nVALIDATION FAILED: $errors error(s) found. Fix before deploying." -ForegroundColor Red
        if (-not $DryRun) { exit 1 }
    } else {
        Write-Host "`nALL VALIDATIONS PASSED" -ForegroundColor Green
    }
}

# --------------------------------------------------
# 3. BUILD DEPLOYMENT ZIP
# --------------------------------------------------
Write-Step "Building deployment package"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem

$excludeDirs = @('.git','.kilo','.opencode','.vscode','node_modules','dist','.agent-zero','.playwright-mcp','.well-known','js')
$excludeFiles = @('.gitignore','opencode.json','.session-state.json','AGENTS.md','README.md','ACTION_PLAN.md','build-deploy.ps1','build-deploy.py','BUILD_ZIP_LIVE_SITE.ps1')
$excludeSuffixes = @('.ps1','.zip','.py')
$reservedNames = @('NUL','CON','PRN','AUX','COM1','COM2','COM3','COM4','COM5','COM6','COM7','COM8','COM9','LPT1','LPT2','LPT3','LPT4','LPT5','LPT6','LPT7','LPT8','LPT9')

function Should-Include($path, $rel) {
    if ($rel -eq 'js/context-engine.js') { return $true }
    $parts = $rel -split '/'
    foreach ($p in $parts) {
        if ($excludeDirs.Contains($p) -or $reservedNames.Contains($p)) { return $false }
    }
    if ($excludeFiles.Contains($path)) { return $false }
    $ext = [System.IO.Path]::GetExtension($path)
    if ($ext -and $excludeSuffixes.Contains($ext.ToLower())) { return $false }
    return $true
}

Write-Info "Creating deployment.zip directly from source..."
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0
$allFiles = Get-ChildItem -Path $root -File -Recurse | Where-Object { $_.FullName -notlike '*\node_modules\*' }
foreach ($f in $allFiles) {
    $rel = $f.FullName.Substring($root.Length + 1)
    if (-not (Should-Include $f.Name $rel)) { continue }
    $entry = $zip.CreateEntry($rel.Replace('\','/'), [System.IO.Compression.CompressionLevel]::Fastest)
    $stream = $entry.Open()
    $fs = [System.IO.File]::OpenRead($f.FullName)
    $fs.CopyTo($stream)
    $stream.Close()
    $fs.Close()
    $count++
}
$zip.Dispose()

$zipSize = (Get-Item $zipPath).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)

Write-Host "`nBUILD COMPLETE" -ForegroundColor Green
Write-Host "  ZIP: $zipPath" -ForegroundColor Cyan
Write-Host "  Size: $zipSizeMB MB" -ForegroundColor Cyan
Write-Host "  Files: $count" -ForegroundColor Cyan
