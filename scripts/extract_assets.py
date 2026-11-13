import os
import re
import urllib.request
import hashlib

html_dir = 'stitch_source'
assets_dir = 'downloaded_assets'
os.makedirs(assets_dir, exist_ok=True)

urls = set()
for fn in os.listdir(html_dir):
    if fn.endswith('.html'):
        with open(os.path.join(html_dir, fn), 'r', encoding='utf-8') as f:
            content = f.read()
            found = re.findall(r'src=["\'](https?://[^"\']+)["\']', content)
            for u in found:
                if 'tailwindcss' not in u and 'googleapis.com/css' not in u:
                    urls.add(u)

print(f"Found {len(urls)} distinct image/asset URLs:")
url_to_file = {}
for i, u in enumerate(sorted(urls)):
    ext = ".png"
    if ".jpg" in u or "jpeg" in u:
        ext = ".jpg"
    elif ".svg" in u:
        ext = ".svg"
    # hash for clean name
    h = hashlib.md5(u.encode('utf-8')).hexdigest()[:10]
    filename = f"asset_{i:02d}_{h}{ext}"
    filepath = os.path.join(assets_dir, filename)
    print(f"[{i}] {filename} <- {u}")
    url_to_file[u] = filepath
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(filepath, 'wb') as out_f:
                out_f.write(resp.read())
        print(f"  Downloaded {filename} ({os.path.getsize(filepath)} bytes)")
    except Exception as e:
        print(f"  Failed to download {u}: {e}")

import json
with open(os.path.join(assets_dir, 'asset_map.json'), 'w', encoding='utf-8') as f:
    json.dump(url_to_file, f, indent=2)

