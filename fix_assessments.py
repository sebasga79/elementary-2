import re

# We will read public/assessments/assessment_instructions_unit_1.html as a base template.
with open('public/assessments/assessment_instructions_unit_1.html', 'r') as f:
    template_html = f.read()

# Extract just the style and head
head_match = re.search(r'(<head>.*?</head>)', template_html, re.DOTALL)
head_content = head_match.group(1) if head_match else ''

units_data = [
    {
        'id': 1,
        'title': 'Unit 1 Final Assessments',
        'subtitle': 'Everyday Wins vs. Major Life Events',
        'grammar': 'Comparatives & Superlatives',
        'tasks': [
            {'name': 'My Life Awards Ceremony', 'desc': 'Create your own "Life Awards" for personal achievements and present a short acceptance speech using comparatives and superlatives.'},
            {'name': 'Celebration Comparison Poster', 'desc': 'Create a comparison poster for two celebrations, highlighting their similarities and differences.'},
            {'name': 'Everyday Wins Blog Post', 'desc': 'Write a blog post describing your small achievements from the week and how they compare to each other.'}
        ]
    },
    {
        'id': 2,
        'title': 'Unit 2 Final Assessments',
        'subtitle': 'Finding Your Place',
        'grammar': 'How Much/Many & Countable/Uncountable Nouns',
        'tasks': [
            {'name': '"Find Your Perfect Home" Presentation', 'desc': 'Present and advertise a home using quantifier expressions, comparing it to other options.'},
            {'name': 'Neighborhood Improvement Plan', 'desc': 'Analyze a real neighborhood and propose improvements using quantity expressions.'},
            {'name': 'Roommate Compatibility Interview', 'desc': 'Write interview questions using "how much" and "how many" to find the perfect roommate.'}
        ]
    },
    {
        'id': 3,
        'title': 'Unit 3 Final Assessments',
        'subtitle': 'Experiencing & Improving Cultural Services',
        'grammar': 'Determiners & Quantifiers',
        'tasks': [
            {'name': 'A Service Review', 'desc': 'Write a review of a real service you have used, noting what was available and making a recommendation.'},
            {'name': 'Product Unboxing Video', 'desc': 'Create a short unboxing video (or presentation) describing a product\'s contents and value.'},
            {'name': 'Community Service Catalog', 'desc': 'Research, interview, and catalog services available in your neighborhood or community.'}
        ]
    }
]

for unit in units_data:
    tasks_html = ""
    for task in unit['tasks']:
        tasks_html += f"""
        <div class="box" style="opacity:1; transform:translateY(0);">
          <h4>{task['name']}</h4>
          <p>{task['desc']}</p>
        </div>
        """

    html = f"""<!doctype html>
<html lang="en">
{head_content.replace('Assessment Instructions — Decision-Making Expressions', f"Assessment Instructions — Unit {unit['id']}")}
<body>
  <div class="container">
    <div class="topbar">
      <div class="brand">
        <span class="dot" aria-hidden="true"></span>
        <span><strong>Elementary 2 • Unit {unit['id']} Final Assessment</strong> — {unit['subtitle']}</span>
      </div>
      <div class="actions">
        <button class="btn warn" onclick="window.print()" type="button" title="Print or save as PDF">
          🖨️ <span>Print / PDF</span>
        </button>
      </div>
    </div>

    <section class="hero" aria-label="Hero" style="opacity:1; transform:translateY(0);">
      <div class="kicker">🧭 Active Experimentation & Final Projects</div>
      <h1>{unit['title']}: {unit['subtitle']}</h1>
      <p class="sub">
        In these final assessment tasks, you will apply the grammar topics (<strong>{unit['grammar']}</strong>) 
        and vocabulary from this unit in authentic, real-world contexts.
      </p>
      <div class="divider"></div>
      <p class="sub" style="font-size: 14px;"><strong>Note:</strong> Your teacher will evaluate your natural use of language, participation, and clarity of communication.</p>
    </section>

    <section class="grid" aria-label="Assessment Tasks">
      <div class="card" style="grid-column: 1 / -1;">
        <h2>🎯 Final Tasks for Unit {unit['id']}</h2>
        <p class="muted" style="margin:0 0 16px">
          Complete these activities to demonstrate your mastery of the unit's objectives:
        </p>
        <div class="content" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; padding:0;">
          {tasks_html}
        </div>
      </div>
    </section>
  </div>
</body>
</html>
"""
    with open(f"public/assessments/assessment_instructions_unit_{unit['id']}.html", "w") as out:
        out.write(html)

print("Assessment files successfully updated for Elementary-2.")
