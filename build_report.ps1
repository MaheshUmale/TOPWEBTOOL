function log {
    param($Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$timestamp] $Message"
}

log "=== TOPWEBTOOL BUILD REPORT ==="

$slugs = @(
    "rental-cash-flow-calculator",
    "biweekly-mortgage-calculator",
    "refinance-break-even",
    "down-payment-savings",
    "rental-yield-calculator"
)

log "Successfully created 5 tool directories:"
foreach ($slug in $slugs) {
    log "  - $slug"
}

log ""
log "=== FILES CREATED PER SLUG ==="
foreach ($slug in $slugs) {
    log "$slug:"
    $files = Get-ChildItem $slug -Name
    foreach ($file in $files) {
        log "  - $file"
    }
}

log ""
log "=== JS VERIFICATION STATUS ==="
log "WARNING: All tools currently using placeholder mortgage calculator template"
log "Need to implement specific JavaScript calculations for each tool"

log ""
log "=== NEXT STEPS ==="
log "1. Implement 5 tool-specific index.html files with proper calculations"
log "2. Create 5 article files per tool (25 total)"
log "3. Verify HTML structure meets spec requirements"
log "4. Test JS calculations with default values"
log "5. Add YMYL disclaimer if applicable"

log ""
log "=== STATUS ==="
log "Partially completed - skeleton structure created but not functional"

log ""
log "=== CURRENT FILE SIZES ==="
foreach ($slug in $slugs) {
    $indexPath = "$slug\index.html"
    if (Test-Path $indexPath) {
        $size = (Get-Item $indexPath).Length
        log "$slug/index.html: $size bytes"
    }
}

log ""
log "Script completed"
