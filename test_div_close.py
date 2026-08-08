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
        if content[pos:pos+6].lower() == '</script':
            in_script = False
            pos += 9
            continue
        if content[pos:pos+6].lower() == '<style':
            in_style = True
            pos = find_tag_end(content, pos, 'style')
            continue
        if content[pos:pos+7].lower() == '</style':
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

span3_start = content.find('<div class="lg:col-span-3')
print('span3_start:', span3_start, 'line:', content[:span3_start].count('\n') + 1)

result = find_matching_div_close(content, span3_start)
print('span3_end:', result, 'line:', content[:result].count('\n') + 1 if result != -1 else 'N/A')

if result != -1:
    print('Around end:')
    print(repr(content[result-50:result+50]))
