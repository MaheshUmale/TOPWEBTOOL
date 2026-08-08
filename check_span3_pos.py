with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

span3_start = content.find('<div class="lg:col-span-3')
print('span3_start:', span3_start)

# Count divs properly
depth = 1
pos = span3_start + 1
while pos < len(content) - 5:
    if content[pos:pos+4] == '<div':
        close_bracket = content.find('>', pos)
        if close_bracket != -1 and close_bracket - pos < 100:
            depth += 1
            pos = close_bracket + 1
            continue
    if content[pos:pos+6] == '</div>':
        depth -= 1
        if depth == 0:
            print('span3_end:', pos + 6)
            print('Around end:')
            print(repr(content[pos-50:pos+50]))
            break
    pos += 1

# Find Informative Guides
inf_pos = content.find('Informative Guides')
print('inf_pos:', inf_pos)

if span3_start < inf_pos:
    # Check if inf is before or after span3_end
    # We need to find span3_end again
    depth = 1
    pos = span3_start + 1
    span3_end = -1
    while pos < len(content) - 5:
        if content[pos:pos+4] == '<div':
            close_bracket = content.find('>', pos)
            if close_bracket != -1 and close_bracket - pos < 100:
                depth += 1
                pos = close_bracket + 1
                continue
        if content[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                span3_end = pos + 6
                break
        pos += 1
    
    print('span3_end:', span3_end)
    if span3_end != -1:
        if inf_pos < span3_end:
            print('Informative Guides is INSIDE lg:col-span-3')
        else:
            print('Informative Guides is OUTSIDE lg:col-span-3')
