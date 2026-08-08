with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

span3_start = content.find('<div class="lg:col-span-3')
print('span3_start char:', span3_start)
print('span3_start line:', content[:span3_start].count('\n') + 1)

# Better div counting - only count actual tag opens
import re
# Find all div tags after span3_start
div_pattern = re.compile(r'<div\b[^>]*>', re.IGNORECASE)
close_pattern = re.compile(r'</div>', re.IGNORECASE)

opens = div_pattern.findall(content, span3_start)
closes = close_pattern.findall(content, span3_start)

print('div opens after span3_start:', len(opens))
print('div closes after span3_start:', len(closes))

# Find the matching close by counting
depth = 1
pos = span3_start + 1
while pos < len(content) - 5:
    open_match = div_pattern.search(content, pos, pos + 1)
    if open_match and open_match.start() == pos:
        depth += 1
        pos = open_match.end()
        continue
    
    close_match = close_pattern.match(content, pos)
    if close_match:
        depth -= 1
        if depth == 0:
            print('True span3_end char:', pos + 6)
            print('True span3_end line:', content[:pos+6].count('\n') + 1)
            print('Around end:')
            print(repr(content[pos-30:pos+30]))
            break
        pos = close_match.end()
        continue
    
    pos += 1

inf_pos = content.find('Informative Guides')
print('inf_pos char:', inf_pos)
print('inf_pos line:', content[:inf_pos].count('\n') + 1)
