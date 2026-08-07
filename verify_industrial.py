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
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = content.count('Informative Guides &amp; Helper Articles')
    has_main_col3 = 'lg:col-span-3' in content
    has_sidebar = 'lg:col-span-1' in content
    
    sidebar_pos = content.find('<div class="lg:col-span-1')
    informative_pos = content.find('Informative Guides')
    main_end_pos = content.find('</main>')
    
    # Check if section is after sidebar but before </main>
    if informative_pos > sidebar_pos and informative_pos < main_end_pos:
        status = 'FIXED (after sidebar, before </main>)'
    elif informative_pos < sidebar_pos:
        status = 'STILL INSIDE main content'
    elif informative_pos > main_end_pos:
        status = 'AFTER </main>'
    else:
        status = 'UNKNOWN'
    
    print(tool + ': count=' + str(count) + ', ' + status)
