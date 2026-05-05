import os, glob, re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract header from index (Top Marquee to end of HEADERS_PERFECT script)
start_header = text.find('<!-- Top Marquee -->')
end_header = text.find('</script>', text.find('HEADERS_PERFECT')) + 9
header_template = text[start_header:end_header]

# Extract footer from index
start_footer = text.find('<!-- Footer')
if start_footer == -1:
    start_footer = text.find('<footer')
end_footer = text.find('</footer>') + 9
footer_template = text[start_footer:end_footer]

# Function to adapt paths in template
def adapt_template(template, is_subpage=True, filename=''):
    if not is_subpage: return template
    t = template
    t = t.replace('"index.html"', '"../index.html"')
    t = t.replace('"pages/', '"')
    t = t.replace('"perfume images/', '"../perfume images/')
    t = t.replace('"css/', '"../css/')
    t = t.replace('"js/', '"../js/')
    
    # Fix active link based on filename
    t = re.sub(r'class="nav-link([a-zA-Z0-9 -]+)? active"', r'class="nav-link\1"', t)
    
    page_name = filename.replace('.html', '')
    if page_name in ['shop', 'about', 'contact', 'policies', 'faq']:
        # The space between class="nav-link and the page_name is dynamic, let's just do a string replace
        t = t.replace(f'nav-link {page_name}"', f'nav-link {page_name} active"')
        
    return t

for filepath in glob.glob('pages/*.html'):
    basename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find header in subpage
    s_head = content.find('<!-- Top Marquee -->')
    if s_head == -1: s_head = content.find('<header class="mobile-header"')
    if s_head == -1: s_head = content.find('<header')
    
    e_head = content.find('<!-- Shop Section -->')
    if e_head == -1: e_head = content.find('<!-- Place Order Section -->')
    if e_head == -1: e_head = content.find('<!-- Hero ')
    if e_head == -1: e_head = content.find('<!-- Contact ')
    if e_head == -1: e_head = content.find('<!-- Main Content -->')
    if e_head == -1: e_head = content.find('<!-- ')
    # More robust logic for header ends: find the first <section> or <main>
    section_start = content.find('<section')
    main_start = content.find('<main')
    first_content = min([i for i in [section_start, main_start] if i != -1] + [len(content)])
    
    if s_head != -1 and first_content != len(content):
        # We replace from s_head up to right before `first_content`
        # Let's find the newline right before `<section`
        sub = content[s_head:first_content]
        # remove trailing spaces/newlines
        sub = sub.rstrip()
        e_head = s_head + len(sub)
        
        adapted_head = adapt_template(header_template, filename=basename)
        content = content[:s_head] + adapted_head + '\n\n    ' + content[first_content:]
        
    # Find footer in subpage
    s_foot = content.find('<!-- Footer')
    if s_foot == -1: s_foot = content.find('<footer')
    
    e_foot = content.find('</footer>') + 9
    if s_foot != -1 and e_foot != -1 and e_foot > s_foot:
        adapted_foot = adapt_template(footer_template, filename=basename)
        content = content[:s_foot] + adapted_foot + content[e_foot:]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated headers and footers across {len(glob.glob('pages/*.html'))} pages.")
