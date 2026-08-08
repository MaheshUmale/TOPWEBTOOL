with open('D:/TOPWEBTOOL/agent-cron-scheduler/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

span3_start = content.find('<div class="lg:col-span-3')
print('span3_start char:', span3_start, 'line:', content[:span3_start].count('\n') + 1)

# Count divs properly, skipping script/style
import re
div_open = re.compile(r'<div\b[^>]*>', re.IGNORECASE)
div_close = re.compile(r'</div>', re.IGNORECASE)

# First, find script/style boundaries
def find_tag_boundaries(content, tag):
    """Find start/end positions of all script/style tags."""
    pattern = re.compile(f'<{tag}[^>]*>', re.IGNORECASE)
    end_pattern = re.compile(f'</{tag}>', re.IGNORECASE)
    boundaries = []
    pos = 0
    while True:
        start_match = pattern.search(content, pos)
        if not start_match:
            break
        start = start_match.start()
        end_match = end_pattern.search(content, start_match.end())
        if end_match:
            end = end_match.end()
        else:
            end = len(content)
        boundaries.append((start, end))
        pos = end
    return boundaries

script_bounds = find_tag_boundaries(content, 'script')
style_bounds = find_tag_boundaries(content, 'style')
all_bounds = script_bounds + style_bounds

def is_in_tag(pos, bounds):
    for start, end in bounds:
        if start <= pos < end:
            return True
    return False

# Count opens and closes after span3_start
opens = []
closes = []

for m in div_open.finditer(content):
    if m.start() > span3_start and not is_in_tag(m.start(), all_bounds):
        opens.append(m.start())

for m in div_close.finditer(content):
    if m.start() > span3_start and not is_in_tag(m.start(), all_bounds):
        closes.append(m.start())

print('Actual div opens after span3_start:', len(opens))
print('Actual div closes after span3_start:', len(closes))

# Find the matching close
depth = 1
for pos in closes:
    depth -= 1
    if depth == 0:
        print('True span3_end char:', pos + 6)
        print('True span3_end line:', content[:pos+6].count('\n') + 1)
        break
    # Count any opens between previous close and this one
    # Actually, we need to interleave opens and closes
    pass

# Better: interleave opens and closes
all_events = []
for pos in opens:
    all_events.append((pos, 'open'))
for pos in closes:
    all_events.append((pos, 'close'))
all_events.sort()

depth = 1
for pos, typ in all_events:
    if typ == 'open':
        depth += 1
    else:
        depth -= 1
        if depth == 0:
            print('True span3_end char:', pos + 6)
            print('True span3_end line:', content[:pos+6].count('\n') + 1)
            print('Around end:')
            print(repr(content[pos-30:pos+30]))
            break

inf_pos = content.find('Informative Guides')
print('inf_pos char:', inf_pos, 'line:', content[:inf_pos].count('\n') + 1)
