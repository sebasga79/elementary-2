import re

file_path = '/Users/sebastian/elementary-2/src/app/page.tsx'
with open(file_path, 'r') as f:
    text = f.read()

stages = ['warmUps', 'concreteExperience', 'reflection', 'abstract', 'practice']

for stage in stages:
    # Find the start of the map loop for this stage
    map_start = text.find(f"activities.{stage}.map")
    if map_start == -1:
        print(f"Skipping {stage} (map not found)")
        continue
    
    # Search for the next <motion.div within a reasonable distance (e.g. 500 chars)
    motion_div_match = re.search(r'<motion\.div', text[map_start:map_start+1000])
    if not motion_div_match:
        print(f"Skipping {stage} (motion.div not found)")
        continue
    
    motion_div_start = map_start + motion_div_match.start()
    
    # Find the closing '>' of the motion.div opening tag
    # We look for the first '>' after '<motion.div' that is NOT inside backticks or quotes
    # For simplicity, we can look for the first '>' after the next 'className={`' or 'className="'
    
    tag_end_match = re.search(r'>', text[motion_div_start:])
    if not tag_end_match:
        print(f"Skipping {stage} (tag end not found)")
        continue
        
    insert_pos = motion_div_start + tag_end_match.end()
    
    # Construction of the insertion string
    insertion = f"""
                            {{/* Image Header */}}
                            <div className="-mt-4 -mx-4 mb-4 relative h-36 border-b group overflow-hidden bg-slate-100 rounded-t-xl">
                              <Image 
                                src={{`https://images.unsplash.com/photo-${{stageImages.{stage}}}?auto=format&fit=crop&q=80&w=600&h=300`}} 
                                alt={{activity.title}} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            </div>"""
    
    # Perform insertion (we do it backwards to not mess up indices, or just once per stage)
    # Actually, let's rebuild the text string carefully
    # To avoid multiple insertions if the script is run twice, check if 'Image Header' is already there
    if "{/* Image Header */}" in text[insert_pos:insert_pos+200]:
        print(f"Skipping {stage} (already injected)")
        continue
        
    text = text[:insert_pos] + insertion + text[insert_pos:]
    print(f"Injected {stage} successfully at {insert_pos}")

# Save the modified file
with open(file_path, 'w') as f:
    f.write(text)

print("Process finished.")
