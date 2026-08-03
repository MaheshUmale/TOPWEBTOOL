<#
.SYNOPSIS
    Audits web source files for AdSense containers missing minimum heights to prevent CLS bugs.
.EXAMPLE
    .\Audit-AdSenseCLS.ps1 -TargetFolder "C:\Users\Username\Projects\my-website"
#>
param (
    [Parameter(Mandatory=$true)]
    [string]$TargetFolder
)

if (-not (Test-Path -Path $TargetFolder)) {
    Write-Error "Target folder path does not exist: $TargetFolder"
    exit 1
}

# Supported frontend extensions
$Extensions = "*.html", "*.js", "*.jsx", "*.tsx", "*.vue", "*.php"
$TargetFiles = Get-ChildItem -Path $TargetFolder -Include $Extensions -Recurse -File -ErrorAction SilentlyContinue

$ClsIssues = @()

foreach ($File in $TargetFiles) {
    $Content = Get-Content -Path $File.FullName -Raw -ErrorAction SilentlyContinue
    if ([string]::IsNullOrEmpty($Content)) { continue }

    # Identify files containing AdSense code blocks
    if ($Content -match "adsbygoogle" -or $Content -match "pagead2\.googlesyndication") {
        
        # Split file lines to pinpoint line numbers
        $Lines = Get-Content -Path $File.FullName
        for ($i = 0; $i -lt $Lines.Count; $i++) {
            $LineNum = $i + 1
            $CurrentLine = $Lines[$i]

            # Match ad container indicators or the ad tag itself
            if ($CurrentLine -match "class=.*?adsbygoogle" -or $CurrentLine -match "id=.*?ad-" -or $CurrentLine -match "<ins") {
                
                # Check if the code block explicitly defines an inline height or a wrapping CSS min-height layout
                if ($CurrentLine -notmatch "height:" -and $CurrentLine -notmatch "min-height" -and $CurrentLine -notmatch "h-\[") {
                    
                    # Log the vulnerability details
                    $Issue = [PSCustomObject]@{
                        FileName   = $File.Name
                        FilePath   = $File.FullName
                        LineNumber = $LineNum
                        Snippet    = $CurrentLine.Trim()
                        FixStatus  = "Needs min-height styling"
                    }
                    $ClsIssues += $Issue
                }
            }
        }
    }
}

# Process results
if ($ClsIssues.Count -gt 0) {
    Write-Host "`n[!] Found $($ClsIssues.Count) potential AdSense CLS vulnerabilities:" -ForegroundColor Yellow
    # Output to clean JSON layout so the AI Agent can parse the structure natively
    $ClsIssues | ConvertTo-Json
} else {
    Write-Host "`n[+] Success: No AdSense CLS bugs detected in your layout blocks!" -ForegroundColor Green
    @() | ConvertTo-Json
}
