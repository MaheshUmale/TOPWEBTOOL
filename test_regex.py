import re

text = '''<div
  class="foo"
>'''
print('Text:', repr(text))
m = re.match(r'<div\b[^>]*>', text)
print('Match:', m)
if m:
    print('Matched:', repr(m.group()))
