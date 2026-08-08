with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

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

section = extract_informative_section(content)
print('Section length:', len(section) if section else 0)
print('Section in content:', section in content if section else False)

# Try the replacement
if section:
    new_content = content.replace(section, '')
    print('Content length before:', len(content))
    print('Content length after replace:', len(new_content))
    print('Section removed:', len(new_content) < len(content))
    
    # Check if Informative Guides is still there
    print('Informative Guides in new_content:', 'Informative Guides' in new_content)
