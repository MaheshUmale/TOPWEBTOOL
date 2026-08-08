with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def find_tag_end(text, start, tag):
    end_tag = f'</{tag}>'
    end_pos = text.find(end_tag, start)
    if end_pos == -1:
        return len(text)
    return end_pos + len(end_tag)

grid4_pos = content.find('lg:grid-cols-4')
grid_div_start = content.rfind('<div', 0, grid4_pos)
print('grid4_pos:', grid4_pos, 'line:', content[:grid4_pos].count('\n') + 1)
print('grid_div_start:', grid_div_start, 'line:', content[:grid_div_start].count('\n') + 1)
print('grid_div_start context:', repr(content[grid_div_start:grid_div_start+100]))

# Trace find_matching_div_close for grid_div_start
depth = 1
pos = grid_div_start + 1
in_script = False
in_style = False
step = 0
events = []

while pos < len(content) - 5 and step < 200:
    step += 1
    
    if content[pos:pos+7].lower() == '<script':
        in_script = True
        end_pos = find_tag_end(content, pos, 'script')
        events.append((pos, 'script_start', end_pos - pos))
        pos = end_pos
        continue
    if content[pos:pos+6].lower() == '<style':
        in_style = True
        end_pos = find_tag_end(content, pos, 'style')
        events.append((pos, 'style_start', end_pos - pos))
        pos = end_pos
        continue
    if content[pos:pos+9].lower() == '</script>':
        in_script = False
        events.append((pos, 'script_end'))
        pos += 9
        continue
    if content[pos:pos+8].lower() == '</style>':
        in_style = False
        events.append((pos, 'style_end'))
        pos += 8
        continue
    
    if in_script or in_style:
        pos += 1
        continue
    
    if content[pos:pos+4] == '<div':
        close_bracket = content.find('>', pos)
        if close_bracket != -1 and close_bracket - pos < 100:
            line = content[:pos].count('\n') + 1
            events.append((pos, 'div_open', line))
            depth += 1
            pos = close_bracket + 1
            continue
    if content[pos:pos+6] == '</div>':
        line = content[:pos].count('\n') + 1
        events.append((pos, 'div_close', line, depth))
        depth -= 1
        if depth == 0:
            print(f'FOUND MATCHING CLOSE at {pos + 6}, line {line}')
            break
    pos += 1

print(f'Final depth: {depth}')
print(f'Events count: {len(events)}')
print('First 20 events:')
for e in events[:20]:
    print(' ', e)
print('Last 10 events:')
for e in events[-10:]:
    print(' ', e)
