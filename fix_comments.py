import re

with open('/Users/sebastian/elementary-2/src/app/page.tsx', 'r') as f:
    text = f.read()

text = text.replace("<!-- Image Header -->", "{/* Image Header */}")

with open('/Users/sebastian/elementary-2/src/app/page.tsx', 'w') as f:
    f.write(text)

print("Fixed JSX comments")
