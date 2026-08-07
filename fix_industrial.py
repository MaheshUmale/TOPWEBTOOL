import os
import re

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

def fix_informative_guides(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already fixed (section after </main> or no sidebar)
    if '<div class="lg:col-span-1' not in content:
        return False, "No sidebar found"
    
    # Find the Informative Guides section inside main content
    # Pattern: from <!-- Informative Articles & Guides Section --> to <!-- Informative Articles End -->
    pattern = r'<!-- Informative Articles & Guides Section -->.*?<!-- Informative Articles End -->\n'
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        return False, "Informative Guides section not found"
    
    section = match.group(0)
    section_start = match.start()
    section_end = match.end()
    
    # Find the sidebar div start
    sidebar_match = re.search(r'<div class="lg:col-span-1', content)
    if not sidebar_match:
        return False, "Sidebar not found"
    
    sidebar_start = sidebar_match.start()
    
    # If section is AFTER sidebar, it's already correctly placed
    if section_start > sidebar_start:
        return False, "Already correctly placed after sidebar"
    
    # Find the grid closing </div> after the sidebar
    # We need to find the </div> that closes the lg:grid-cols-4 grid
    # This should be after the sidebar section ends
    grid_close_pattern = r'</div>\s*\n\s*</main>'
    grid_close_match = re.search(grid_close_pattern, content[sidebar_start:])
    
    if not grid_close_match:
        return False, "Grid closing not found"
    
    grid_close_pos = sidebar_start + grid_close_match.start()
    
    # Remove the section from its current position
    content = content[:section_start] + content[section_end:]
    
    # Adjust grid_close_pos after removal
    removed_length = section_end - section_start
    grid_close_pos -= removed_length
    
    # Insert the section before </main>
    # The section should be indented properly (6 spaces to match </main> indentation)
    new_section = '\n      <!-- Informative Guides & Helper Articles Section -->\n' + section.strip() + '\n'
    content = content[:grid_close_pos] + new_section + content[grid_close_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True, "Fixed"

for tool in industrial_tools:
    filepath = 'D:/TOPWEBTOOL/' + tool + '/index.html'
    if not os.path.exists(filepath):
        print(tool + ': MISSING')
        continue
    
    fixed, msg = fix_informative_guides(filepath)
    if fixed:
        print(tool + ': FIXED')
    else:
        print(tool + ': ' + msg)
