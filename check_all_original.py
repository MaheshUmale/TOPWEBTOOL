import os

tools = [
    'agent-cron-scheduler', 'agent-eval-engine', 'agent-memory-matrix',
    'agent-prompt-builder', 'agent-state-router', 'ai-system-topology',
    'ai-text-humanizer-helper', 'autogen-yaml-designer', 'base64-encoder-decoder',
    'binary-decimal-converter', 'biweekly-mortgage-calculator', 'car-lease-estimator',
    'cash-burn-runway', 'chatgpt-prompt-optimizer', 'connector-pinout-mapper',
    'credit-card-payoff-planner', 'depreciation-schedule', 'dividend-reinvestment-calculator',
    'down-payment-savings', 'enclosure-thermal-solver', 'eoq-calculator',
    'fortune-wheel', 'freight-dimensional-weight', 'harness-diameter-modeler',
    'headline-analyzer', 'heloc-estimator', 'hex-rgba-converter',
    'home-affordability-calculator', 'hourly-to-salary-converter', 'inflation-calculator',
    'injection-molding-estimator', 'json-formatter-validator', 'lorem-ipsum-generator',
    'ltv-cac-calculator', 'merchant-account-fee-matrix', 'midjourney-command-builder',
    'moving-cost-calculator', 'openapi-tool-converter', 'password-generator',
    'pcb-impedance-calculator', 'playwright-script-generator', 'pomodoro-timer',
    'prompt-chain-debugger', 'prompt-injection-guardrail', 'property-tax-projector',
    'pydantic-schema-generator', 'qr-code-generator', 'rag-chunking-simulator',
    'random-picker', 'refinance-break-even', 'rent-vs-buy-calculator',
    'rental-cash-flow-calculator', 'rental-yield-calculator', 'retainer-profitability',
    'roi-calculator', 'social-media-image-resizer', 'sound-frequency-generator',
    'student-loan-idr', 'thermocouple-calculator', 'utm-generator',
    'w2-vs-1099-comparator', 'word-character-counter', 'word-unscrambler'
]

needs_fix = []
already_ok = []

for tool in tools:
    path = 'D:/TOPWEBTOOL/' + tool + '/index.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    span1_pos = content.find('<div class="lg:col-span-1')
    inf_pos = content.find('<!-- Informative Articles & Guides Section -->')
    if inf_pos == -1:
        inf_pos = content.find('<!-- Informative Guides & Helper Articles Section -->')
    
    if span1_pos == -1:
        print(tool + ': NO SIDEBAR')
        continue
    
    if inf_pos == -1:
        print(tool + ': NO INFORMATIVE GUIDES')
        continue
    
    if inf_pos < span1_pos:
        needs_fix.append(tool)
        print(tool + ': NEEDS FIX')
    else:
        already_ok.append(tool)
        print(tool + ': OK')

print('\nSummary:')
print('Needs fix:', len(needs_fix))
print('Already OK:', len(already_ok))
