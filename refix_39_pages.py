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

def extract_informative_section(content):
    """Extract ONLY the Informative Guides section HTML from content."""
    # Find the start comment
    start_markers = [
        '<!-- Informative Articles & Guides Section -->',
        '<!-- Informative Guides & Helper Articles Section -->'
    ]
    
    start_pos = -1
    start_marker = None
    for marker in start_markers:
        pos = content.find(marker)
        if pos != -1:
            start_pos = pos
            start_marker = marker
            break
    
    if start_pos == -1:
        return None
    
    # Find the opening div after the comment
    div_start = content.find('<div', start_pos)
    if div_start == -1:
        return None
    
    # Count divs to find the matching closing tag
    depth = 1
    pos = div_start + 1
    while pos < len(content) - 5:
        if content[pos:pos+4] == '<div':
            close_bracket = content.find('>', pos)
            if close_bracket != -1 and close_bracket - pos < 100:
                depth += 1
                pos = close_bracket + 1
                continue
        if content[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                end_pos = pos + 6
                # Include trailing whitespace/newlines
                while end_pos < len(content) and content[end_pos] in '\n\r\t ':
                    end_pos += 1
                return content[start_pos:end_pos]
        pos += 1
    
    return None

def find_matching_div_close(content, start_pos):
    """Find the closing </div> that matches the div at start_pos."""
    depth = 1
    pos = start_pos + 1
    while pos < len(content) - 5:
        if content[pos:pos+4] == '<div':
            close_bracket = content.find('>', pos)
            if close_bracket != -1 and close_bracket - pos < 100:
                depth += 1
                pos = close_bracket + 1
                continue
        if content[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                return pos + 6
        pos += 1
    return -1

def fix_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the Informative Guides section
    section = extract_informative_section(content)
    if not section:
        return False, "No Informative Guides section found"
    
    # Remove ONLY the Informative Guides section
    content = content.replace(section, '')
    
    # Find the grid-cols-4 container and its closing div
    grid4_pos = content.find('lg:grid-cols-4')
    if grid4_pos == -1:
        return False, "No lg:grid-cols-4 found"
    
    # Find the opening div of the grid
    grid_div_start = content.rfind('<div', 0, grid4_pos)
    if grid_div_start == -1:
        return False, "No grid div found"
    
    # Find its matching closing tag
    grid_div_end = find_matching_div_close(content, grid_div_start)
    if grid_div_end == -1:
        return False, "Could not find grid div closing tag"
    
    # Insert the section after the grid div closes, before </main>
    insert_pos = grid_div_end
    
    clean_section = section.strip()
    content = content[:insert_pos] + '\n' + clean_section + '\n' + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True, "Fixed"

fixed_count = 0
error_count = 0

for tool in sorted(tools):
    filepath = 'D:/TOPWEBTOOL/' + tool + '/index.html'
    if not os.path.exists(filepath):
        print(tool + ': FILE NOT FOUND')
        error_count += 1
        continue
    
    fixed, msg = fix_page(filepath)
    if fixed:
        print(tool + ': FIXED')
        fixed_count += 1
    else:
        print(tool + ': ERROR - ' + msg)
        error_count += 1

print('\nSummary:')
print('  Fixed:', fixed_count)
print('  Errors:', error_count)
