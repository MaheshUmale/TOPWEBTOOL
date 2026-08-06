import os, re

PUBLIC = 'PUBLIC'

# Tools with missing guide pages
tools_missing_guides = [
    'biweekly-mortgage-calculator', 'car-lease-estimator', 'cash-burn-runway',
    'crypto-position-size', 'depreciation-schedule', 'down-payment-savings',
    'dso-tracker', 'eoq-calculator', 'freight-dimensional-weight',
    'heloc-estimator', 'home-affordability-calculator', 'inflation-calculator',
    'ltv-cac-calculator', 'macro-diet-planner', 'markup-margin-tool',
    'merchant-account-fee-matrix', 'mortgage-calculator', 'moving-cost-calculator',
    'property-tax-projector', 'refinance-break-even', 'rent-vs-buy-calculator',
    'rental-cash-flow-calculator', 'rental-yield-calculator', 'retainer-profitability',
    'student-loan-idr', 'w2-vs-1099-comparator'
]

# Tools with missing related tool links
tools_missing_related = {
    'crypto-position-size': ['option-wheel-strategy', 'option-ppl-matrix', 'stock-split-cost-basis', 'impermanent-loss-estimator', 'intrinsic-value-calculator'],
    'macro-diet-planner': ['intermittent-fasting-timeline', 'hydration-calculator', 'body-fat-calculator', 'heart-rate-zones', 'sleep-cycle-alarm', 'glycemic-load-modeler', 'bac-calculator', 'ergonomic-workspace-guide'],
    'markup-margin-tool': ['break-even-solver'],
    'student-loan-idr': ['debt-consolidation-evaluator', 'emergency-fund-calculator', 'net-worth-tracker', 'fire-calculator', 'hysa-comparator', 'subscription-audit'],
}

for tool in tools_missing_guides:
    idx_path = os.path.join(PUBLIC, tool, 'index.html')
    if not os.path.exists(idx_path):
        continue
    
    with open(idx_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    
    # Remove "Informative Articles & Guides Section" if all guide links are missing
    guide_pattern = re.compile(
        r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->',
        re.DOTALL
    )
    
    # Check if there are any valid guide links in this section
    guide_section = re.search(r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->', content, re.DOTALL)
    if guide_section:
        section_text = guide_section.group(0)
        # Find all guide links in this section
        guide_links = re.findall(r'href=["\'](\./([^"\']+))["\']', section_text)
        all_missing = True
        for href, filename in guide_links:
            if not os.path.exists(os.path.join(PUBLIC, tool, filename)):
                all_missing = False
                break
        
        if all_missing or len(guide_links) == 0:
            content = guide_pattern.sub('', content)
            print(f'Removed guides section from {tool}')
    
    # Remove broken related tool links
    if tool in tools_missing_related:
        missing_tools = set(tools_missing_related[tool])
        for missing in missing_tools:
            # Remove the specific anchor tag for this missing tool
            pattern = re.compile(
                r'<a href=["\']\.\./' + re.escape(missing) + r'/["\'].*?</a>',
                re.DOTALL
            )
            new_content, count = pattern.subn('', content)
            if count > 0:
                content = new_content
                print(f'Removed {count} broken link(s) to ../{missing}/ from {tool}')
    
    if content != original:
        with open(idx_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Saved {tool}')
    else:
        print(f'No changes for {tool}')

print('Done fixing broken links.')
