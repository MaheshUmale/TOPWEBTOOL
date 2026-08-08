with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

span3_start = 5237

# Trace through find_matching_div_close
depth = 1
pos = span3_start + 1
in_script = False
in_style = False
step = 0

while pos < len(content) - 5 and step < 100:
    step += 1
    
    # Check for script/style
    if content[pos:pos+7].lower() == '<script':
        print(f'Step {step}: Found <script at {pos}, skipping to end')
        end_tag = '</script>'
        end_pos = content.find(end_tag, pos)
        pos = end_pos + len(end_tag) if end_pos != -1 else len(content)
        continue
    if content[pos:pos+6].lower() == '</script>':
        print(f'Step {step}: Found </script at {pos}')
        pos += 9
        continue
    if content[pos:pos+6].lower() == '<style':
        print(f'Step {step}: Found <style at {pos}, skipping to end')
        end_tag = '</style>'
        end_pos = content.find(end_tag, pos)
        pos = end_pos + len(end_tag) if end_pos != -1 else len(content)
        continue
    if content[pos:pos+7].lower() == '</style>':
        print(f'Step {step}: Found </style at {pos}')
        pos += 8
        continue
    
    if content[pos:pos+4] == '<div':
        close_bracket = content.find('>', pos)
        print(f'Step {step}: Found <div at {pos}, depth={depth}->{depth+1}, close_bracket={close_bracket}')
        if close_bracket != -1 and close_bracket - pos < 100:
            depth += 1
            pos = close_bracket + 1
            continue
    if content[pos:pos+6] == '</div>':
        print(f'Step {step}: Found </div> at {pos}, depth={depth}->{depth-1}')
        depth -= 1
        if depth == 0:
            print(f'FOUND MATCHING CLOSE at {pos + 6}')
            break
    pos += 1

print(f'Final depth: {depth}')
print(f'Final pos: {pos}')
