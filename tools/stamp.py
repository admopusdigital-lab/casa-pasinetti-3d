#!/usr/bin/env python3
"""Refresh the byte counts the loading splash uses for real download progress:
data-bytes on the site's script tags and the BYTES constant of the interiors bundle."""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = os.path.join(ROOT, 'site', 'index.html')
s = open(site, encoding='utf-8').read()
def tag(m):
    src = m.group(1); path = os.path.join(ROOT, 'site', src.split('?')[0])
    return f'<script src="{src}" data-bytes="{os.path.getsize(path)}"></script>'
s = re.sub(r'<script src="([^"]+)"(?: data-bytes="\d+")?></script>', tag, s)
open(site, 'w', encoding='utf-8').write(s)
idx = os.path.join(ROOT, 'index.html')
t = open(idx, encoding='utf-8').read()
t = re.sub(r'BYTES = \d+', f"BYTES = {os.path.getsize(os.path.join(ROOT, 'dist', 'apartamento.js'))}", t)
open(idx, 'w', encoding='utf-8').write(t)
print('stamped')
