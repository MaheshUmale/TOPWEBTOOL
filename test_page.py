import os
import re

# Test on one page first
with open('D:/TOPWEBTOOL/mortgage-calculator/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

col1_pos = content.find('<div class="lg:col-span-1')
first_inf = content.find('Informative Guides')
second_inf = content.find('Informative Guides', first_inf + 1) if first_inf >= 0 else -1
main_pos = content.find('</main>')

print('mortgage-calculator:')
print('  col1_pos:', col1_pos)
print('  first_inf:', first_inf)
print('  second_inf:', second_inf)
print('  main_pos:', main_pos)
print('  total length:', len(content))
print('  count:', content.count('Informative Guides'))
