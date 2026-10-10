#!/usr/bin/env python3
"""Validate writing metadata, local assets, anchors, and generated Markdown parity."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import collections
import json
import re
import xml.etree.ElementTree as ET
from build_writing import ROOT, Tree, Markdown

items = json.loads((ROOT/'scripts/writing.json').read_text())
failures = []

def check(condition, message):
    if not condition:
        failures.append(message)

def local_path(url, source):
    parts = urlsplit(url)
    if parts.scheme and (parts.scheme not in {'https', 'http'} or parts.netloc != 'prigoistic.me'):
        return None
    if not parts.path:
        return source
    path = ROOT/unquote(parts.path.lstrip('/')) if parts.path.startswith('/') or parts.netloc else source.parent/unquote(parts.path)
    if path.is_dir():
        path = path/'index.html'
    return path

for item in items:
    source = ROOT/item['path']
    tree = Tree(source.read_text())
    all_nodes = list(tree.root.find(lambda n: True))
    ids = [n.attrs['id'] for n in all_nodes if 'id' in n.attrs]
    duplicate = [k for k,v in collections.Counter(ids).items() if v > 1]
    check(not duplicate, f'{source.name}: duplicate IDs {duplicate}')
    check(sum(n.tag == 'h1' for n in all_nodes) == 1, f'{source.name}: expected one h1')
    canonical = next(n.attrs['href'] for n in all_nodes if n.attrs.get('rel') == 'canonical')
    check(canonical == item['canonical'], f'{source.name}: canonical mismatch')
    data = next(n.text() for n in all_nodes if n.attrs.get('type') == 'application/ld+json')
    schema = json.loads(data)
    check(schema['headline'] == item['title'], f'{source.name}: structured-data title mismatch')
    for n in all_nodes:
        for attribute in ['src', 'href']:
            url = n.attrs.get(attribute)
            if not url:
                continue
            target = local_path(url, source)
            if target is None:
                continue
            check(target.exists(), f'{source.name}: missing {url}')
            fragment = urlsplit(url).fragment
            if fragment and target.suffix == '.html' and target.exists():
                if fragment in {'main', 'breakdowns'} and 'mapa' in str(target):
                    continue
                destination = Tree(target.read_text())
                check(any(n.attrs.get('id') == unquote(fragment) for n in destination.root.find(lambda n: True)), f'{source.name}: missing anchor {url}')
    content = next(n for n in all_nodes if 'article-content' in n.attrs.get('class','').split())
    topics = next(n for n in all_nodes if 'key-topics' in n.attrs.get('class','').split()).text().split(' · ')
    deck = next(n for n in all_nodes if 'article-deck' in n.attrs.get('class','').split()).text().strip()
    writer = Markdown(item)
    writer.shared_defs = ''.join(n.xml() for n in content.find(lambda n: n.tag == 'svg' and n.attrs.get('width') == '0'))
    text = re.sub(r'\n{3,}', '\n\n', re.sub(r'\n[ \t]+\n', '\n\n', writer.render(content))).strip()
    text = re.sub(r'[ \t]+\n', '\n', text)
    header = f'# {item["title"]}\n\n{deck}\n\nAuthor: Priyam Ghosh\nPublished: {item["date"]}\nCanonical: {item["canonical"]}\nKeywords: {", ".join(s.strip() for s in topics)}\n\n'
    markdown = source.with_suffix('.md')
    check(markdown.read_text() == header+text+'\n', f'{source.name}: stale Markdown; run build_writing.py')
    for link in re.findall(r'\]\(([^\s)]+)\)', markdown.read_text()):
        target = local_path(link, markdown)
        if target is not None:
            check(target.exists(), f'{markdown.name}: missing Markdown asset/link {link}')
for diagram in (ROOT/'assets/diagrams').rglob('*.svg'):
    try:
        svg = ET.parse(diagram).getroot()
        check('viewBox' in svg.attrib, f'{diagram}: missing SVG viewBox')
    except ET.ParseError as error:
        failures.append(f'{diagram}: invalid SVG {error}')
ET.parse(ROOT/'sitemap.xml')
if failures:
    print('\n'.join(failures))
    raise SystemExit(1)
print(f'PASS: {len(items)} articles; metadata, links, anchors, SVGs, and complete Markdown parity.')
