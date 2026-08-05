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

foreach ($dir in $toolDirs) {
  $indexPath = "D:\TOPWEBTOOL\PUBLIC\$dir\index.html"
  if (-not (Test-Path $indexPath)) { continue }

  $content = Get-Content $indexPath -Raw
  $toolName = $toolNames[$dir]
  $toolDesc = $toolDescriptions[$dir]
  $formId = "form-" + $dir

  # Skip if already processed (has form-id attribute)
  if ($content -match "form-id=`"$formId`"") {
    Write-Host "Skipping $dir (already enriched)"
    continue
  }

  # Check if page already has a form tag
  if ($content -match '<form[\s]') {
    # Page has a form - add id and tool attributes
    $content = $content -replace '<form tool-name="', '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="'
    Write-Host "Enriched form on $dir"
  } else {
    # Page has no form - wrap calculator UI div in a form
    # Find the calculator UI div pattern
    $calcDivPattern = '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">'
    $calcDivPattern2 = '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">'

    if ($content -match [regex]::Escape($calcDivPattern)) {
      $replacement = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">'
      $content = $content -replace [regex]::Escape($calcDivPattern), $replacement

      # Replace the closing </div> that matches this calculator section with </form>
      # Find the next </div> after the opening that closes the calculator section
      # The calculator section ends before "Informative Articles" or "TARGET INJECTION POINT"
      $content = $content -replace '(?<=<\/form>[\s\S]*?)(?=<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">)', ''
      Write-Host "Wrapped calculator UI in form for $dir"
    } elseif ($content -match [regex]::Escape($calcDivPattern2)) {
      $replacement = '<form id="' + $formId + '" form-id="' + $formId + '" tool-name="' + $toolName + '" tool-description="' + $toolDesc + '" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">'
      $content = $content -replace [regex]::Escape($calcDivPattern2), $replacement
      Write-Host "Wrapped calculator UI (overflow-hidden) in form for $dir"
    } else {
      Write-Host "WARNING: Could not find calculator UI div for $dir"
      continue
    }
  }

  # Add required attribute to primary numeric inputs that don't have it
  # Target inputs with type="number" that are primary inputs (not sliders)
  $content = $content -replace '(<input type="number" id="input-[^"]*")(?![\s\S]*?required)', '$1 required'

  # Add urm-description to inputs that don't have it
  $content = $content -replace '(<input type="text" id="input-[^"]*")(?![\s\S]*?urm-description)', '$1 urm-description="User input for ' + $toolName + '"'
  $content = $content -replace '(<input type="number" id="input-[^"]*")(?![\s\S]*?urm-description)', '$1 urm-description="Numeric input for ' + $toolName + '"'
  $content = $content -replace '(<input type="color" id="input-[^"]*")(?![\s\S]*?urm-description)', '$1 urm-description="Color picker for ' + $toolName + '"'
  $content = $content -replace '(<textarea id="input-[^"]*")(?![\s\S]*?urm-description)', '$1 urm-description="Text input for ' + $toolName + '"'
  $content = $content -replace '(<select id="input-[^"]*")(?![\s\S]*?urm-description)', '$1 urm-description="Selection for ' + $toolName + '"'

  # Add id attributes to output elements that don't have one
  $content = $content -replace '(<div id="out-[^"]*")', '$1'
  $content = $content -replace '(<pre class="[^"]*?" id=")([^"]*)"([^>]*>)', '$1$2"$3'

  # Ensure output elements have id attributes
  $content = $content -replace '<div class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto break-all shadow-inner" id="out-translated">', '<div class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto break-all shadow-inner" id="out-translated" form-output="true">'
  $content = $content -replace '<div class="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-base break-all text-center tracking-wider shadow-inner" id="out-password">', '<div class="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-base break-all text-center tracking-wider shadow-inner" id="out-password" form-output="true">'
  $content = $content -replace '<pre class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto break-all shadow-inner" id="out-translated">', '<pre class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto break-all shadow-inner" id="out-translated" form-output="true">'

  # Add form-output attribute to result elements
  $content = $content -replace 'id="out-([^"]+)"(?![\s\S]*?form-output)', 'id="out-$1" form-output="true"'

  # Save the enriched file
  Set-Content -Path $indexPath -Value $content -NoNewline
  Write-Host "Saved enriched $dir/index.html"
}

Write-Host "`nEnrichment complete!"