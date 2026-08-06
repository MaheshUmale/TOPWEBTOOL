import os, re

tools = ['biweekly-mortgage-calculator', 'cash-burn-runway', 'depreciation-schedule', 'down-payment-savings', 'dso-tracker', 'eoq-calculator', 'freight-dimensional-weight', 'heloc-estimator', 'home-affordability-calculator', 'ltv-cac-calculator', 'merchant-account-fee-matrix', 'moving-cost-calculator', 'property-tax-projector', 'refinance-break-even', 'rental-cash-flow-calculator', 'rental-yield-calculator', 'retainer-profitability', 'w2-vs-1099-comparator']
for tool in tools:
    path = os.path.join('PUBLIC', tool, 'index.html')
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    guide_links = re.findall(r'href=["\'](\./([^"\']+))["\']', content)
    guide_files = [g for g in guide_links if 'guide' in g[1] or 'best-practices' in g[1] or 'common-errors' in g[1] or 'optimization-tips' in g[1] or 'future-trends' in g[1]]
    if guide_files:
        print(f'{tool}: {len(guide_files)} guide links')
        for g in guide_files[:2]:
            print(f'  - {g[0]}')
    else:
        print(f'{tool}: no guide links')
