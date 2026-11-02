import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

doc = Document()

# Set page margins to 0.7 inches
sections = doc.sections
for section in sections:
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)

# Helper for cell shading
def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header(text, level=2, space_before=12, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(13 if level == 2 else 11.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return p

# College Header
p_inst = doc.add_paragraph()
p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_inst.paragraph_format.space_after = Pt(2)
run = p_inst.add_run("GES'S R. H. Sapat College of Engineering, Management Studies and Research, Nashik – 422005\n")
run.font.name = 'Calibri'
run.font.size = Pt(12)
run.font.bold = True
run.font.color.rgb = RGBColor(15, 23, 42)

run_dept = p_inst.add_run("MCA (Engg.) Department\n")
run_dept.font.name = 'Calibri'
run_dept.font.size = Pt(11)
run_dept.font.bold = True
run_dept.font.color.rgb = RGBColor(30, 58, 138)

run_sem = p_inst.add_run("SYMCA (A. Y. 2026-27) SEM - I | Web Technology Lab\n")
run_sem.font.name = 'Calibri'
run_sem.font.size = Pt(10)
run_sem.font.color.rgb = RGBColor(51, 65, 85)

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_before = Pt(4)
p_title.paragraph_format.space_after = Pt(10)
run_t = p_title.add_run("Assignment 9: Personal Portfolio Website – Write-up\n")
run_t.font.name = 'Calibri'
run_t.font.size = Pt(13)
run_t.font.bold = True

run_sub = p_title.add_run("Part B: Student Write-up")
run_sub.font.name = 'Calibri'
run_sub.font.size = Pt(10)
run_sub.font.italic = True
run_sub.font.color.rgb = RGBColor(71, 85, 105)

# Student Info Table
info_table = doc.add_table(rows=3, cols=4)
info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
info_table.autofit = False

data = [
    [("Name", True), ("Deepak Chauhan", False), ("Roll No", True), ("08", False)],
    [("Batch", True), ("SYMCA (Batch 2026-27)", False), ("Date", True), ("02/11/2026", False)],
    [("Technology used", True), ("HTML5, CSS3, JavaScript (Vanilla ES6+), Particle.js & Responsive CSS (Grid/Flexbox)", False), ("", False), ("", False)]
]

col_widths = [Inches(1.5), Inches(2.2), Inches(1.2), Inches(2.1)]
for row_idx, row in enumerate(info_table.rows):
    if row_idx == 2:
        # Merge last 3 cells in row 2
        a = row.cells[1]
        b = row.cells[2]
        c = row.cells[3]
        a.merge(b).merge(c)
    for col_idx, (text, is_bold) in enumerate(data[row_idx]):
        if row_idx == 2 and col_idx >= 2:
            continue
        cell = row.cells[col_idx]
        cell.width = col_widths[col_idx]
        set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(10)
        run.font.bold = is_bold
        if is_bold:
            set_cell_background(cell, "F1F5F9")
            run.font.color.rgb = RGBColor(15, 23, 42)

# 1. Aim
add_header("1. Aim", level=2)
p_aim = doc.add_paragraph()
p_aim.paragraph_format.space_after = Pt(8)
run_aim = p_aim.add_run(
    "To design and deploy a responsive personal portfolio website using HTML5, CSS3, and JavaScript (Vanilla ES6+) "
    "with interactive element animations, dynamic particle canvas effects, and multi-device responsiveness across "
    "mobile, tablet, and desktop viewports."
)
run_aim.font.name = 'Calibri'
run_aim.font.size = Pt(11)

# 2. Objectives
add_header("2. Objectives", level=2)
objs = [
    "To structure a modular, multi-page personal portfolio comprising Home, About, Projects, Certifications, and Contact pages using semantic HTML5 elements.",
    "To create an adaptive, mobile-first responsive layout utilizing CSS Flexbox and CSS Grid that functions seamlessly on mobile phones, tablets, and desktop computers.",
    "To design and implement interactive animations, including scroll-reveal effects (powered by the Intersection Observer API), a dynamic background particle canvas, and interactive hover transitions.",
    "To establish a clean design system utilizing CSS Custom Properties (CSS variables) for dark/light theme switching, glassmorphic UI components, and modern typography.",
    "To deploy the portfolio onto a free, reliable cloud hosting platform (GitHub Pages / Netlify) and verify seamless cross-browser accessibility on mobile devices."
]
for obj in objs:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.space_before = Pt(0)
    run = p.add_run(obj)
    run.font.name = 'Calibri'
    run.font.size = Pt(10.5)

# 3. Theory
add_header("3. Theory: About the Technology Used", level=2)

add_header("3.1 The technology I used", level=3, space_before=6)
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
run = p.add_run(
    "I developed this personal portfolio using core web standards: HTML5, CSS3, and JavaScript (ECMAScript 2022+ / Vanilla JS). "
    "HTML5, standardized by W3C and WHATWG, provides clean semantic structuring and native media/canvas capabilities. "
    "CSS3 is maintained by the W3C CSS Working Group and governs the visual styling, responsive layouts, glassmorphic effects, "
    "and fluid CSS transitions. JavaScript, maintained by ECMA International (TC39), manages client-side interactivity, "
    "DOM manipulation, asynchronous event handling, and canvas physics. Together, these technologies deliver blazing-fast load speeds, "
    "zero build bloat, universal browser support, and lightweight execution without requiring external heavy runtimes."
)
run.font.name = 'Calibri'
run.font.size = Pt(10.5)

add_header("3.2 Why I chose it", level=3, space_before=6)
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
run = p.add_run(
    "I chose native HTML5, CSS3, and modern JavaScript because they offer complete architectural control over layout precision, "
    "zero build overhead, and maximum performance. Having built a strong foundation in computer science and full-stack development, "
    "I wanted to showcase craft and mastery by developing bespoke components—such as a dynamic particle system, an interactive developer CLI console, "
    "and custom glassmorphism—directly with browser APIs. This approach guarantees instant load times, zero third-party dependency vulnerabilities, "
    "complete control over responsive breakpoints, and maximum compatibility across all mobile and desktop browsers."
)
run.font.name = 'Calibri'
run.font.size = Pt(10.5)

add_header("3.3 Key features I used", level=3, space_before=6)
feats = [
    ("Semantic HTML5 Elements: ", "Utilized <header>, <nav>, <main>, <section>, <article>, <canvas>, and <footer> to establish clean hierarchy and high SEO accessibility."),
    ("CSS Custom Properties (Variables): ", "Structured centralized design tokens on :root and [data-theme=\"light\"] for instantaneous, seamless dark and light theme toggling."),
    ("CSS Grid & Flexbox: ", "Built dynamic, multi-column card grids, responsive metrics displays, and adaptive navigation bars."),
    ("Intersection Observer API: ", "Implemented hardware-accelerated scroll-reveal animations that gracefully trigger as cards enter the viewport."),
    ("HTML5 Canvas & 2D Context: ", "Rendered an interactive background constellation particle canvas that dynamically responds to mouse movement."),
    ("LocalStorage State Persistence: ", "Cached user preferences (theme mode) directly in the browser to maintain state across page navigations.")
]
for title, desc in feats:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2.5)
    r1 = p.add_run(title)
    r1.font.name = 'Calibri'
    r1.font.bold = True
    r1.font.size = Pt(10)
    r2 = p.add_run(desc)
    r2.font.name = 'Calibri'
    r2.font.size = Pt(10)

add_header("3.4 Styling: Tailwind CSS or CSS", level=3, space_before=6)
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
run = p.add_run(
    "Tailwind CSS is a utility-first CSS framework providing atomic helper classes directly in markup. For this portfolio, "
    "I deliberately utilized a structured, custom CSS3 Design System with CSS Custom Properties and Glassmorphism instead of Tailwind CSS. "
    "A high-end personal portfolio demands custom aesthetic styling—including multi-layered ambient gradients, backdrop-filter blur surfaces, "
    "bespoke glowing card borders, and retro terminal styling—which are significantly cleaner to maintain in a dedicated stylesheet (style.css). "
    "This avoided class clutter in HTML documents, eliminated dependency on Node.js build pipelines and PostCSS processors, and enabled complete "
    "artistic control over responsive breakpoints."
)
run.font.name = 'Calibri'
run.font.size = Pt(10.5)

add_header("3.5 Animations", level=3, space_before=6)
anims = [
    ("Scroll-Reveal Animations: ", "Implemented via JavaScript's IntersectionObserver API combined with CSS translateY and opacity transitions on all content cards (Bio, Timeline, Projects, Skills)."),
    ("Interactive Particle Canvas: ", "A custom JavaScript particle engine rendering connecting nodes and floating orbits across an HTML5 <canvas> background."),
    ("Dynamic Typewriter Effect: ", "JavaScript character-by-character text rotation in the hero title ('Software', 'Full-Stack Apps', 'AI Systems') with a blinking cursor keyframe."),
    ("Micro-Interactions & Hover Effects: ", "CSS @keyframes pulseDot for active availability status, 3D card tilt/elevation on hover, and smooth theme-switching fades.")
]
for title, desc in anims:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2.5)
    r1 = p.add_run(title)
    r1.font.name = 'Calibri'
    r1.font.bold = True
    r1.font.size = Pt(10)
    r2 = p.add_run(desc)
    r2.font.name = 'Calibri'
    r2.font.size = Pt(10)

add_header("3.6 Responsive design", level=3, space_before=6)
resps = [
    ("CSS Grid Fractional & Auto-fit Units: ", "Grids dynamically reorganize (e.g., grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))), providing 3 columns on wide screens, 2 on tablets, and 1 on phones."),
    ("Media Queries: ", "Breakpoints are configured at @media (max-width: 1024px) (tablet landscape) and @media (max-width: 768px) (mobile portrait) to collapse horizontal layouts into vertical stacks."),
    ("Adaptive Navigation: ", "On screens below 768px, horizontal navbar links hide and an interactive hamburger menu reveals an accessible slide-out mobile drawer."),
    ("Fluid Units & Viewport Meta: ", "Relative units (rem, %, vw) and standard viewport configuration guarantee crisp readability on all display densities.")
]
for title, desc in resps:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2.5)
    r1 = p.add_run(title)
    r1.font.name = 'Calibri'
    r1.font.bold = True
    r1.font.size = Pt(10)
    r2 = p.add_run(desc)
    r2.font.name = 'Calibri'
    r2.font.size = Pt(10)

# 4. Syntax
add_header("4. Syntax", level=2, space_before=10)
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(4)
r = p.add_run("Code snippets from my portfolio codebase with explanations in Consolas monospace font:")
r.font.name = 'Calibri'
r.font.size = Pt(10)
r.font.italic = True

syntax_table = doc.add_table(rows=5, cols=3)
syntax_table.alignment = WD_TABLE_ALIGNMENT.CENTER
syntax_table.autofit = False

syn_widths = [Inches(1.8), Inches(3.2), Inches(2.0)]
syn_headers = ["Part", "Code snippet from my portfolio", "What it does"]

for col_idx, h_text in enumerate(syn_headers):
    cell = syntax_table.rows[0].cells[col_idx]
    cell.width = syn_widths[col_idx]
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(h_text)
    r.font.name = 'Calibri'
    r.font.bold = True
    r.font.size = Pt(10)

syn_data = [
    ("Page structure or component",
     '<section class="hero-section">\n  <div class="container hero-grid">\n    <div class="hero-content reveal">...</div>\n    <div class="hero-visual reveal">\n      <img src="assets/deepak-chauhan.jpg" \n           alt="Deepak Chauhan" class="avatar-img" />\n    </div>\n  </div>\n</section>',
     "Constructs the semantic hero section pairing the developer introduction and profile photo in a two-column responsive grid container."),
    
    ("Styling (Tailwind or CSS)",
     ':root {\n  --bg-primary: #090d16;\n  --accent-primary: #6366f1;\n  --bg-card: rgba(20, 30, 51, 0.65);\n}\n[data-theme="light"] {\n  --bg-primary: #f8fafc;\n  --text-primary: #0f172a;\n}',
     "Defines centralized CSS custom property tokens on :root to power instant, zero-reload dark and light theme switching across all pages."),
    
    ("Animation",
     "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('show');\n    }\n  });\n}, { threshold: 0.15 });\ndocument.querySelectorAll('.reveal').forEach(el => observer.observe(el));",
     "Monitors DOM elements on scroll and dynamically applies the .show class to trigger smooth CSS slide-up and fade-in animations."),
     
    ("Responsive layout",
     "@media (max-width: 1024px) {\n  .hero-grid, .about-hero-grid {\n    grid-template-columns: 1fr;\n    gap: 2rem;\n  }\n}\n@media (max-width: 768px) {\n  .nav-links { display: none; }\n  .mobile-toggle { display: flex; }\n}",
     "Collapses two-column desktop grids into a single vertical stack on tablet screens and activates the hamburger drawer menu on mobile viewports.")
]

for row_idx, (part, code, desc) in enumerate(syn_data, start=1):
    row = syntax_table.rows[row_idx]
    
    # Part col
    c0 = row.cells[0]
    c0.width = syn_widths[0]
    set_cell_margins(c0, top=60, bottom=60, left=80, right=80)
    p0 = c0.paragraphs[0]
    p0.paragraph_format.space_after = Pt(0)
    r0 = p0.add_run(part)
    r0.font.name = 'Calibri'
    r0.font.bold = True
    r0.font.size = Pt(9.5)
    
    # Code col
    c1 = row.cells[1]
    c1.width = syn_widths[1]
    set_cell_background(c1, "F8FAFC")
    set_cell_margins(c1, top=60, bottom=60, left=80, right=80)
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(0)
    r1 = p1.add_run(code)
    r1.font.name = 'Consolas'
    r1.font.size = Pt(8.2)
    
    # Desc col
    c2 = row.cells[2]
    c2.width = syn_widths[2]
    set_cell_margins(c2, top=60, bottom=60, left=80, right=80)
    p2 = c2.paragraphs[0]
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run(desc)
    r2.font.name = 'Calibri'
    r2.font.size = Pt(9.2)

# 5. Screenshots
add_header("5. Screenshots of My Portfolio", level=2, space_before=14)
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
r = p.add_run("Actual high-resolution screenshots captured across desktop, tablet, and mobile views from the live deployed website:")
r.font.name = 'Calibri'
r.font.size = Pt(10)
r.font.italic = True

ss_table = doc.add_table(rows=3, cols=2)
ss_table.alignment = WD_TABLE_ALIGNMENT.CENTER
ss_table.autofit = False

ss_info = [
    ("Home page (desktop)", "assets/screenshots/home-desktop.png"),
    ("About", "assets/screenshots/about-desktop.png"),
    ("Projects", "assets/screenshots/projects-desktop.png"),
    ("Contact", "assets/screenshots/contact-desktop.png"),
    ("Mobile view", "assets/screenshots/mobile-view.png"),
    ("Tablet view", "assets/screenshots/tablet-view.png")
]

cell_width = Inches(3.45)
for idx, (title, img_path) in enumerate(ss_info):
    row_idx = idx // 2
    col_idx = idx % 2
    cell = ss_table.rows[row_idx].cells[col_idx]
    cell.width = cell_width
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(0)
    r = p.add_run(title)
    r.font.name = 'Calibri'
    r.font.bold = True
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(15, 23, 42)
    
    if os.path.exists(img_path):
        p_img = cell.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(2)
        p_img.paragraph_format.space_before = Pt(2)
        run_img = p_img.add_run()
        if "mobile" in img_path:
            run_img.add_picture(img_path, width=Inches(1.5))
        elif "tablet" in img_path:
            run_img.add_picture(img_path, width=Inches(2.4))
        else:
            run_img.add_picture(img_path, width=Inches(3.2))

# 6. Live Link
add_header("6. Live Link (Deployed Portfolio)", level=2, space_before=14)
link_table = doc.add_table(rows=3, cols=2)
link_table.alignment = WD_TABLE_ALIGNMENT.CENTER
link_table.autofit = False

l_widths = [Inches(2.5), Inches(4.5)]
link_data = [
    [("Item", True), ("Details", True)],
    [("Hosting platform used", True), ("GitHub Pages / Netlify", False)],
    [("Live link", True), ("https://dc-hub0.github.io/portfolio-model/", False)]
]

for row_idx, row in enumerate(link_table.rows):
    for col_idx, (text, is_bold) in enumerate(link_data[row_idx]):
        cell = row.cells[col_idx]
        cell.width = l_widths[col_idx]
        set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)
        r = p.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(10)
        r.font.bold = is_bold
        if row_idx == 0:
            set_cell_background(cell, "F1F5F9")
        elif col_idx == 0:
            set_cell_background(cell, "F8FAFC")
        if text.startswith("http"):
            r.font.color.rgb = RGBColor(37, 99, 235)
            r.font.underline = True

p_note = doc.add_paragraph()
p_note.paragraph_format.space_before = Pt(4)
p_note.paragraph_format.space_after = Pt(8)
r_note = p_note.add_run("Note: The live link is globally hosted, SSL-secured (HTTPS), and verified to open seamlessly on mobile phones and private windows.")
r_note.font.name = 'Calibri'
r_note.font.size = Pt(9.5)
r_note.font.italic = True
r_note.font.color.rgb = RGBColor(71, 85, 105)

# 7. Conclusion
add_header("7. Conclusion", level=2, space_before=10)
p_conc = doc.add_paragraph()
p_conc.paragraph_format.space_after = Pt(16)
r_conc = p_conc.add_run(
    "In this assignment, I successfully designed, developed, and deployed a high-performance, responsive personal portfolio website "
    "showcasing my software engineering projects, verified cloud certifications, and technical proficiencies. "
    "Through this practical exercise, I reinforced core competencies in semantic HTML5 markup, responsive grid and flexbox design systems, "
    "dynamic dark/light theme switching using CSS variables, and GPU-accelerated scroll-reveal animations via the Intersection Observer API. "
    "The primary challenge was ensuring seamless rendering of the particle canvas and responsive typography without layout shifts across mobile viewports, "
    "which I resolved through responsive clamp functions, auto-fit grid columns, and hardware-accelerated transforms. "
    "The final portfolio is globally deployed, accessible across all devices, and fulfills all assignment criteria."
)
r_conc.font.name = 'Calibri'
r_conc.font.size = Pt(10.5)

# Signatures
sig_table = doc.add_table(rows=1, cols=2)
sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
sig_table.autofit = False

c_left = sig_table.rows[0].cells[0]
c_left.width = Inches(3.5)
p_l = c_left.paragraphs[0]
p_l.paragraph_format.space_after = Pt(0)
r = p_l.add_run("Student:\n\n\n\nDeepak Chauhan\n")
r.font.name = 'Calibri'
r.font.bold = True
r.font.size = Pt(10.5)
r2 = p_l.add_run("SYMCA (Roll No: 08)")
r2.font.name = 'Calibri'
r2.font.size = Pt(9.5)
r2.font.color.rgb = RGBColor(71, 85, 105)

c_right = sig_table.rows[0].cells[1]
c_right.width = Inches(3.5)
p_r = c_right.paragraphs[0]
p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p_r.paragraph_format.space_after = Pt(0)
r = p_r.add_run("Evaluated By:\n\n\n\nMs. S. S. Tripathi\n")
r.font.name = 'Calibri'
r.font.bold = True
r.font.size = Pt(10.5)
r2 = p_r.add_run("Subject Incharge (Web Technology Lab)")
r2.font.name = 'Calibri'
r2.font.size = Pt(9.5)
r2.font.color.rgb = RGBColor(71, 85, 105)

# Save
doc.save("Assignment9_Writeup_Deepak_Chauhan.docx")
doc.save("Assignment9_Writeup_Template.docx")

# Copy into assets/docs/ for easy website download
os.makedirs("assets/docs", exist_ok=True)
doc.save("assets/docs/Assignment9_Writeup_Deepak_Chauhan.docx")

print("Generated DOCX files successfully!")
