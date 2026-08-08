with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def find_tag_end(text, start, tag):
    end_tag = f'</{tag}>'
    end_pos = text.find(end_tag, start)
    if end_pos == -1:
        return len(content)
    return end_pos + len(end_tag)

grid4_pos = content.find('lg:grid-cols-4')
grid_div_start = content.rfind('<div', 0, grid4_pos)
print('grid_div_start:', grid_div_start)

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

result = find_matching_div_close(content, grid_div_start)
print('Result:', result, 'line:', content[:result].count('\n') + 1 if result != -1 else 'N/A')
if result != -1:
    print('Around result:')
    print(repr(content[result-50:result+50]))
