import os
import re

tools = []
for d in os.listdir('D:/TOPWEBTOOL'):
    if d in ['dist', 'node_modules', '.agent-zero', '.kilo', 'public']:
        continue
    if os.path.isdir('D:/TOPWEBTOOL/' + d):
        index = 'D:/TOPWEBTOOL/' + d + '/index.html'
        if os.path.exists(index):
            tools.append(d)

issues = []
for tool in sorted(tools):
    path = 'D:/TOPWEBTOOL/' + tool + '/index.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count = content.count('Informative Guides')
    if count == 0:
        continue
    
    has_col1 = 'lg:col-span-1' in content
    if not has_col1:
        continue
    
    col1_pos = content.find('<div class="lg:col-span-1')
    first_inf = content.find('Informative Guides')
    
    if first_inf < col1_pos:
        issues.append(tool)

print('Total remaining pages to fix:', len(issues))
for tool in issues:
    print('  ' + tool)
