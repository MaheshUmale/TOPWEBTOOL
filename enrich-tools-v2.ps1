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

$toolNames = @{
  "ai-text-humanizer-helper" = "AI Text Humanizer Helper"
  "base64-encoder-decoder" = "Base64 Encoder & Decoder"
  "car-lease-estimator" = "Car Lease Estimator"
  "chatgpt-prompt-optimizer" = "ChatGPT Prompt Optimizer"
  "cpm-calculator" = "CPM Calculator"
  "credit-card-payoff-planner" = "Credit Card Payoff Planner"
  "crypto-tax-estimator" = "Crypto Tax Estimator"
  "dividend-reinvestment-calculator" = "Dividend Reinvestment Calculator"
  "fortune-wheel" = "Fortune Wheel"
  "headline-analyzer" = "Headline Analyzer"
  "hourly-to-salary-converter" = "Hourly to Salary Converter"
  "inflation-calculator" = "Inflation Calculator"
  "json-formatter-validator" = "JSON Formatter & Validator"
  "lorem-ipsum-generator" = "Lorem Ipsum Generator"
  "midjourney-command-builder" = "Midjourney Command Builder"
  "mortgage-calculator" = "Mortgage Calculator"
  "password-generator" = "Password Generator"
  "qr-code-generator" = "QR Code Generator"
  "roi-calculator" = "ROI Calculator"
  "social-media-image-resizer" = "Social Media Image Resizer"
  "utm-generator" = "UTM Generator"
  "word-character-counter" = "Word & Character Counter"
  "word-unscrambler" = "Word Unscrambler"
}

$toolDescriptions = @{
  "ai-text-humanizer-helper" = "Detect robotic structures and optimize copy flow to humanize AI-generated text output."
  "base64-encoder-decoder" = "Convert strings and image assets to base64 format and vice-versa fully locally."
  "car-lease-estimator" = "Calculate monthly auto lease payments based on MSRP, residual value, money factor, and down payment."
  "chatgpt-prompt-optimizer" = "Inject personas, variables, and formatting constraints into basic raw prompt strings."
  "cpm-calculator" = "Compute campaign cost, target CPM, or required impressions instantly."
  "credit-card-payoff-planner" = "Compare Snowball and Avalanche debt payoff tracks to clear outstanding credit card balances."
  "crypto-tax-estimator" = "Estimate short-term and long-term capital gains tax brackets for crypto sales instantly."
  "dividend-reinvestment-calculator" = "Project compounding stock growth assuming recurring dividend reinvestment schedules."
  "fortune-wheel" = "Interactive customized canvas fortune-wheel spinner to make fast decisions."
  "headline-analyzer" = "Score headlines based on emotional word weight, readability, and character length."
  "hourly-to-salary-converter" = "Convert hourly wages to annual gross and net income based on standard US/EU tax baselines."
  "inflation-calculator" = "Track and compare historical buying power changes using US CPI & Eurostat inflation metrics."
  "json-formatter-validator" = "Beautify, compress, validate, and parse raw JSON strings securely offline."
  "lorem-ipsum-generator" = "Generate customizable design placeholder paragraphs, words, or lists instantly."
  "midjourney-command-builder" = "Select parameters, version toggles, and aspect ratios to construct precise Midjourney commands."
  "mortgage-calculator" = "Compute monthly house payments, taxes, and PMI with dynamic amortization schedule breakdowns."
  "password-generator" = "Create highly secure, randomized passwords locally with robust length and character toggles."
  "qr-code-generator" = "Generate downloadable customized high-quality client-side QR codes instantly."
  "roi-calculator" = "Calculate campaign Return on Investment and Return on Ad Spend dynamically."
  "social-media-image-resizer" = "Crop and scale assets client-side for Instagram, LinkedIn, YouTube, and X."
  "utm-generator" = "Generate error-free UTM tracking URLs with dynamic copy-to-clipboard functionality."
  "word-character-counter" = "Analyze content length, reading time, speaking duration, and sentence statistics."
  "word-unscrambler" = "Instantly turn scrambled letters into valid words with wildcard search options."
}

$errors = @()

foreach ($dir in $toolDirs) {
  $indexPath = "D:\TOPWEBTOOL\PUBLIC\$dir\index.html"
  if (-not (Test-Path $indexPath)) {
    $errors += "    ${dir}: NO FILE"
    continue
  }

  $content = Get-Content $indexPath -Raw
  $toolName = $toolNames[$dir]
  $toolDesc = $toolDescriptions[$dir]
  $formId = "form-" + $dir

  if ($content -match "form-id=`"$formId`"") {
    Write-Host "Skipping $dir (already enriched)"
    continue
  }

  # Handle pages that already have a form tag (qr-code-generator)
  if ($content -match '<form[\s]') {
    $content = $content -replace '<form tool-name="', '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="'
    Write-Host "Enriched existing form on $dir"
  } else {
    # Find calculator UI divs and wrap them in form tags
    # Pattern 1: <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
    $pattern1 = '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">'
    if ($content -match [regex]::Escape($pattern1)) {
      $replacement1 = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">'
      $content = $content -replace [regex]::Escape($pattern1), $replacement1
      Write-Host "Wrapped calculator UI (pattern1) in form for $dir"
    }
    # Pattern 2: <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
    elseif ($content -match '<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">') {
      $pattern2 = '<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">'
      $replacement2 = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">'
      $content = $content -replace [regex]::Escape($pattern2), $replacement2
      Write-Host "Wrapped calculator UI (pattern2) in form for $dir"
    }
    # Pattern 3: <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    elseif ($content -match '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">') {
      $pattern3 = '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">'
      $replacement3 = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">'
      $content = $content -replace [regex]::Escape($pattern3), $replacement3
      Write-Host "Wrapped calculator UI (overflow-hidden) in form for $dir"
    }
    # Pattern 4: <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
    elseif ($content -match '<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">') {
      $pattern4 = '<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">'
      $replacement4 = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">'
      $content = $content -replace [regex]::Escape($pattern4), $replacement4
      Write-Host "Wrapped calculator UI (pattern4) in form for $dir"
    }
    else {
      $errors += "      ${dir}: No calculator UI div found"
      Write-Host "WARNING: Could not find calculator UI div for $dir"
      continue
    }
  }

  # Add required attribute to primary numeric inputs (type="number" without already having required)
  $content = $content -replace '(<input type="number" id="input-[^"]*")(?!\s+required)', '$1 required'

  # Add urm-description to text inputs without it
  $content = $content -replace '(<input type="text" id="input-[^"]*")(?!\s+urm-description)', '$1 urm-description="User input for ' + $toolName + '"'

  # Add urm-description to number inputs without it
  $content = $content -replace '(<input type="number" id="input-[^"]*")(?!\s+urm-description)', '$1 urm-description="Numeric input for ' + $toolName + '"'

  # Add urm-description to color inputs without it
  $content = $content -replace '(<input type="color" id="input-[^"]*")(?!\s+urm-description)', '$1 urm-description="Color picker for ' + $toolName + '"'

  # Add urm-description to textarea without it
  $content = $content -replace '(<textarea id="input-[^"]*")(?!\s+urm-description)', '$1 urm-description="Text input for ' + $toolName + '"'

  # Add urm-description to select without it
  $content = $content -replace '(<select id="input-[^"]*")(?!\s+urm-description)', '$1 urm-description="Selection for ' + $toolName + '"'

  # Add form-output="true" to output elements that have id starting with "out-" but don't already have form-output
  $content = $content -replace 'id="(out-[^"]+)"(?![\s\S]{0,200}form-output)', 'id="$1" form-output="true"'

  # Save the enriched file
  Set-Content -Path $indexPath -Value $content -NoNewline -Encoding UTF8
  Write-Host "Saved enriched $dir/index.html"
}

if ($errors.Count -gt 0) {
  Write-Host "`nErrors encountered:"
  $errors | ForEach-Object { Write-Host "  $_" }
}

Write-Host "`nEnrichment complete!"