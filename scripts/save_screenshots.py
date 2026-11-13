import json
import base64
import os

screens = {
    'screen1_organizer': r'C:/Users/ROHAN/.gemini/antigravity/brain/f5a86174-be60-4683-a87e-e99da25a7116/.system_generated/steps/42/output.txt',
    'screen2_war_room': r'C:/Users/ROHAN/.gemini/antigravity/brain/f5a86174-be60-4683-a87e-e99da25a7116/.system_generated/steps/44/output.txt',
    'screen3_judge': r'C:/Users/ROHAN/.gemini/antigravity/brain/f5a86174-be60-4683-a87e-e99da25a7116/.system_generated/steps/46/output.txt',
    'screen4_sponsor': r'C:/Users/ROHAN/.gemini/antigravity/brain/f5a86174-be60-4683-a87e-e99da25a7116/.system_generated/steps/48/output.txt',
}

os.makedirs('stitch_screenshots', exist_ok=True)
for name, step_path in screens.items():
    with open(step_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        b64 = data.get('image', '')
        if b64:
            img_bytes = base64.b64decode(b64)
            out_file = os.path.join('stitch_screenshots', f'{name}.png')
            with open(out_file, 'wb') as out_f:
                out_f.write(img_bytes)
            print(f'Wrote {out_file}: {len(img_bytes)} bytes')
        else:
            print(f'No image found in {step_path}')

