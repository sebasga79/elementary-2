import re

with open('/Users/sebastian/elementary-2/src/app/page.tsx', 'r') as f:
    content = f.read()

stages = [
    'warmUps',
    'concreteExperience',
    'reflection',
    'abstract',
    'practice',
    'closing',
    'livingLearning'
]

for stage in stages:
    # Simpler regex approach: find the exact mapped block
    pattern = r"(\{activities\." + stage + r"\.map\(\(activity, idx\) => \{[\s\S]+?className=\{`cursor-pointer\s+p-4)(.+?\s*>\s*)<div className=\"flex items-center justify-between"
    match = re.search(pattern, content)
    if match:
        print(f"Matched {stage}!")
    else:
        print(f"FAILED to match {stage}")
