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

def find_tag_boundaries(content, tag):
    pattern = re.compile(f'<{tag}[^>]*>', re.IGNORECASE)
    end_pattern = re.compile(f'</{tag}>', re.IGNORECASE)
    boundaries = []
    pos = 0
    while True:
        start_match = pattern.search(content, pos)
        if not start_match:
            break
        start = start_match.start()
        end_match = end_pattern.search(content, start_match.end())
        if end_match:
            end = end_match.end()
        else:
            end = len(content)
        boundaries.append((start, end))
        pos = end
    return boundaries

def is_in_tag(pos, bounds):
    for start, end in bounds:
        if start <= pos < end:
            return True
    return False

def get_true_div_end(content, start_pos):
    """Find the true closing </div> for the div at start_pos, using interleaved counting."""
    div_open = re.compile(r'<div\b[^>]*>', re.IGNORECASE)
    div_close = re.compile(r'</div>', re.IGNORECASE)
    
    script_bounds = find_tag_boundaries(content, 'script')
    style_bounds = find_tag_boundaries(content, 'style')
    all_bounds = script_bounds + style_bounds
    
    opens = []
    closes = []
    
    for m in div_open.finditer(content):
        if m.start() > start_pos and not is_in_tag(m.start(), all_bounds):
            opens.append(m.start())
    
    for m in div_close.finditer(content):
        if m.start() > start_pos and not is_in_tag(m.start(), all_bounds):
            closes.append(m.start())
    
    all_events = []
    for pos in opens:
        all_events.append((pos, 'open'))
    for pos in closes:
        all_events.append((pos, 'close'))
    all_events.sort()
    
    depth = 1
    for pos, typ in all_events:
        if typ == 'open':
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return pos + 6
    return -1

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
    
    span3_start = content.find('<div class="lg:col-span-3')
    if span3_start == -1:
        print(tool + ': NO lg:col-span-3')
        continue
    
    span3_end = get_true_div_end(content, span3_start)
    if span3_end == -1:
        print(tool + ': Could not find span3 end')
        continue
    
    inf_start = content.find('Informative Guides')
    
    if inf_start > span3_start and inf_start < span3_end:
        needs_fix.append(tool)
        print(tool + ': NEEDS FIX (Informative Guides inside lg:col-span-3)')
    elif inf_start > span3_end:
        already_ok.append(tool)
        print(tool + ': OK')
    else:
        print(tool + ': UNEXPECTED')

print('\n--- Summary ---')
print('Already OK:', len(already_ok))
print('Needs fix:', len(needs_fix))
if needs_fix:
    print('Needs fix list:')
    for t in needs_fix:
        print('  ' + t)
