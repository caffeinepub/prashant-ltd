import re

with open("src/frontend/src/components/VideoEditor.tsx", "r") as f:
    content = f.read()

lines = content.split("\n")

# Find line indices (0-based)
start_line = None
end_line = None
for i, line in enumerate(lines):
    if line.strip() == "// ─── AI Chatbox ───────────────────────────────────────────────────────────────":
        start_line = i
    if line.strip() == "// ─── Main VideoEditor ─────────────────────────────────────────────────────────":
        end_line = i
        break

print(f"start={start_line}, end={end_line}")
