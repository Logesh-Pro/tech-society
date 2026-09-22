import json

filename = 'GlobalBracketField.tsx'
content = ''

for line in open(r'C:\Users\admin\.gemini\antigravity\brain\f591c334-3b4e-459f-a480-3cf924f6ecfb\.system_generated\logs\transcript_full.jsonl', encoding='utf-8'):
    if filename not in line:
        continue
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for call in data['tool_calls']:
                if call['name'] == 'write_to_file' and filename in call['args']['TargetFile']:
                    content = call['args']['CodeContent']
                elif call['name'] == 'replace_file_content' and filename in call['args']['TargetFile']:
                    target = call['args']['TargetContent']
                    replacement = call['args']['ReplacementContent']
                    if target in content:
                        content = content.replace(target, replacement)
    except Exception as e:
        pass

with open(r'c:\Users\admin\Desktop\tech-society\components\background\GlobalBracketField.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
