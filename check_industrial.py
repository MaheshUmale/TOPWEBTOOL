import os

industrial_tools = [
    'acoustic-room-analyzer',
    'cnc-feeds-speeds',
    'composite-laminate-calculator',
    'connector-pinout-mapper',
    'enclosure-thermal-solver',
    'gear-tooth-generator',
    'harness-diameter-modeler',
    'hydraulic-pressure-drop',
    'injection-molding-estimator',
    'pcb-impedance-calculator',
    'pump-selection-tdh',
    'rigging-tension-solver',
    'sheet-metal-unfolder',
    'thermocouple-calculator'
]

for tool in industrial_tools:
    path = 'D:/TOPWEBTOOL/' + tool + '/index.html'
    if not os.path.exists(path):
        print(tool + ': MISSING')
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = content.count('Informative Guides &amp; Helper Articles')
    has_main_col3 = 'lg:col-span-3' in content
    has_sidebar = 'lg:col-span-1' in content
    
    sidebar_pos = content.find('<div class="lg:col-span-1')
    informative_pos = content.find('Informative Guides')
    
    issue = ''
    if count > 1:
        issue = 'DUPLICATE (' + str(count) + ' sections)'
    elif count == 1 and sidebar_pos > 0 and informative_pos > sidebar_pos:
        issue = 'MISPLACED (after sidebar)'
    elif count == 0:
        issue = 'MISSING'
    
    if issue:
        print(tool + ': ' + issue)
    else:
        print(tool + ': OK')
