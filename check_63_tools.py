import os
import re

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
    if not os.path.exists(path):
        print(tool + ': FILE NOT FOUND')
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = content.count('Informative Guides')
    if count == 0:
        print(tool + ': NO Informative Guides section')
        continue
    
    has_col1 = 'lg:col-span-1' in content
    if not has_col1:
        print(tool + ': NO lg:col-span-1 sidebar')
        continue
    
    col1_pos = content.find('<div class="lg:col-span-1')
    first_inf = content.find('Informative Guides')
    
    if first_inf < col1_pos:
        needs_fix.append(tool)
        print(tool + ': NEEDS FIX (Informative Guides at ' + str(first_inf) + ', sidebar at ' + str(col1_pos) + ')')
    else:
        already_ok.append(tool)
        print(tool + ': OK (Informative Guides after sidebar)')

print('\n--- Summary ---')
print('Needs fix:', len(needs_fix))
print('Already OK:', len(already_ok))
