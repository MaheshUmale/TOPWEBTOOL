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
        lines = f.readlines()
    
    # Find line numbers for key elements
    col3_line = None
    col1_line = None
    informative_line = None
    main_end_line = None
    
    for i, line in enumerate(lines):
        if 'lg:col-span-3' in line and col3_line is None:
            col3_line = i + 1
        if '<div class="lg:col-span-1' in line and col1_line is None:
            col1_line = i + 1
        if 'Informative Guides' in line and informative_line is None:
            informative_line = i + 1
        if '</main>' in line and main_end_line is None:
            main_end_line = i + 1
    
    # Check if Informative Guides is between col3 start and col1 start
    # That means it's INSIDE the main content
    if informative_line and col1_line:
        if informative_line < col1_line:
            status = 'INSIDE main content (needs fix)'
        elif informative_line > col1_line and informative_line < main_end_line:
            status = 'Between main and sidebar (needs fix)'
        else:
            status = 'After main (correct)'
    else:
        status = 'Structure unclear'
    
    print(tool + ': informative_line=' + str(informative_line) + ', col1_line=' + str(col1_line) + ', main_end=' + str(main_end_line) + ' -> ' + status)
