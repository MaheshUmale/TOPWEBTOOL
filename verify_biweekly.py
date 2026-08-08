import re

with open('D:/TOPWEBTOOL/biweekly-mortgage-calculator/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

span3_start = content.find('<div class="lg:col-span-3')
inf_start = content.find('Informative Guides')
print('span3_start:', span3_start)
print('inf_start:', inf_start)
print('Has lg:col-span-1:', 'lg:col-span-1' in content)

# Find span3 end
div_pattern = re.compile(r'<div\b[^>]*>', re.IGNORECASE)
close_pattern = re.compile(r'</div>', re.IGNORECASE)

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
            print('span3_end:', pos + 6)
            if inf_start < pos + 6:
                print('Informative Guides is INSIDE lg:col-span-3')
            else:
                print('Informative Guides is OUTSIDE lg:col-span-3')
            break
        pos = close_match.end()
        continue
    pos += 1
