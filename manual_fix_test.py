with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print('Original length:', len(content))
print('Original Informative Guides count:', content.count('Informative Guides'))

# Now run the fix
def find_tag_end(text, start, tag):
    end_tag = f'</{tag}>'
    end_pos = text.find(end_tag, start)
    if end_pos == -1:
        return len(text)
    return end_pos + len(end_tag)

def find_matching_div_close(content, start_pos):
    depth = 1
    pos = start_pos + 1
    in_script = False
    in_style = False
    
    while pos < len(content) - 5:
        if content[pos:pos+7].lower() == '<script':
            in_script = True
            pos = find_tag_end(content, pos, 'script')
            continue
        if content[pos:pos+6].lower() == '<style':
            in_style = True
            pos = find_tag_end(content, pos, 'style')
            continue
        if content[pos:pos+9].lower() == '</script>':
            in_script = False
            pos += 9
            continue
        if content[pos:pos+8].lower() == '</style>':
            in_style = False
            pos += 8
            continue
        
        if in_script or in_style:
            pos += 1
            continue
        
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

def extract_informative_section(content):
    start_markers = [
        '<!-- Informative Articles & Guides Section -->',
        '<!-- Informative Guides & Helper Articles Section -->'
    ]
    
    start_pos = -1
    for marker in start_markers:
        pos = content.find(marker)
        if pos != -1:
            start_pos = pos
            break
    
    if start_pos == -1:
        return None
    
    div_start = content.find('<div', start_pos)
    if div_start == -1:
        return None
    
    div_end = find_matching_div_close(content, div_start)
    if div_end == -1:
        return None
    
    while div_end < len(content) and content[div_end] in '\n\r\t ':
        div_end += 1
    
    return content[start_pos:div_end]

def find_grid_div_end(content):
    grid4_pos = content.find('lg:grid-cols-4')
    if grid4_pos == -1:
        return -1
    grid_div_start = content.rfind('<div', 0, grid4_pos)
    if grid_div_start == -1:
        return -1
    return find_matching_div_close(content, grid_div_start)

section = extract_informative_section(content)
print('Section length:', len(section) if section else 0)

content = content.replace(section, '')
print('Length after remove:', len(content))
print('Informative Guides after remove:', content.count('Informative Guides'))

grid_div_end = find_grid_div_end(content)
print('Grid div end:', grid_div_end)

if grid_div_end != -1 and section:
    insert_pos = grid_div_end
    clean_section = section.strip()
    content = content[:insert_pos] + '\n' + clean_section + '\n' + content[insert_pos:]
    print('Length after reinsert:', len(content))
    print('Informative Guides after reinsert:', content.count('Informative Guides'))
    
    # Write back
    with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('File written successfully')
