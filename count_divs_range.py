with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

grid_div_start = 5147
end_pos = 6716

# Count actual div opens and closes between grid_div_start and end_pos
div_opens = []
div_closes = []

pos = grid_div_start + 1
while pos < end_pos:
    open_pos = content.find('<div', pos)
    close_pos = content.find('</div>', pos)
    
    if open_pos == -1 and close_pos == -1:
        break
    if open_pos == -1:
        div_closes.append(close_pos)
        break
    if close_pos == -1:
        div_opens.append(open_pos)
        break
    
    if open_pos < close_pos:
        div_opens.append(open_pos)
        pos = open_pos + 4
    else:
        div_closes.append(close_pos)
        pos = close_pos + 6

print(f'Div opens between {grid_div_start} and {end_pos}: {len(div_opens)}')
print(f'Div closes between {grid_div_start} and {end_pos}: {len(div_closes)}')
print(f'Net: {len(div_opens) - len(div_closes)}')
print(f'Expected depth change: from 1 to {1 + len(div_opens) - len(div_closes)}')

if len(div_closes) > 0:
    print(f'Last close at: {div_closes[-1]}')
    print(f'Content around last close:')
    print(repr(content[div_closes[-1]-30:div_closes[-1]+30]))
