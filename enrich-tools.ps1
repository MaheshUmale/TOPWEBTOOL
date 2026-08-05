$toolDirs = @(
  "ai-text-humanizer-helper","base64-encoder-decoder","car-lease-estimator",
  "chatgpt-prompt-optimizer","cpm-calculator","credit-card-payoff-planner",
  "crypto-tax-estimator","dividend-reinvestment-calculator","fortune-wheel",
  "headline-analyzer","hourly-to-salary-converter","inflation-calculator",
  "json-formatter-validator","lorem-ipsum-generator","midjourney-command-builder",
  "mortgage-calculator","password-generator","qr-code-generator",
  "roi-calculator","social-media-image-resizer","utm-generator",
  "word-character-counter","word-unscrambler"
)

$results = @{}
foreach ($dir in $toolDirs) {
  $indexPath = "D:\TOPWEBTOOL\PUBLIC\$dir\index.html"
  if (Test-Path $indexPath) {
    $content = Get-Content $indexPath -Raw
    if ($content -match '<form[\s]') {
      $results[$dir] = "HAS_FORM"
    } else {
      $results[$dir] = "NO_FORM"
    }
  } else {
    $results[$dir] = "NO_FILE"
  }
}

$results.GetEnumerator() | Sort-Object Name | ForEach-Object { "{0}: {1}" -f $_.Key, $_.Value }