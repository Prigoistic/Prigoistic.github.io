#!/usr/bin/env python3
"""Generate public Markdown from the complete HTML articles; no third-party dependencies.

Run after editing article content: python3 scripts/build_writing.py
The HTML is the source of truth. writing.json holds search descriptions and catalogue metadata.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
import html
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Node:
    def __init__(self, tag='', attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []
    def text(self):
        return ''.join(c.text() if isinstance(c, Node) else c for c in self.children)
    def find(self, predicate):
        if predicate(self):
            yield self
        for c in self.children:
            if isinstance(c, Node):
                yield from c.find(predicate)
    def xml(self):
        attrs = ''.join(f' {k}="{html.escape(v or "", quote=True)}"' for k, v in self.attrs.items())
        return f'<{self.tag}{attrs}>' + ''.join(c.xml() if isinstance(c, Node) else html.escape(c) for c in self.children) + f'</{self.tag}>'

class Tree(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break
    def handle_data(self, data):
        self.stack[-1].children.append(data)

class Markdown:
    def __init__(self, item):
        self.item, self.diagram_index = item, 0
    def render(self, n):
        if isinstance(n, str):
            return re.sub(r'\s+', ' ', n)
        tag, attrs = n.tag, n.attrs
        classes = attrs.get('class', '').split()
        if 'data-playground-ui' in attrs:
            return ''  # The static example and caption describe the playground in Agent mode.
        if tag in {'script', 'style', 'button', 'nav', 'defs'} or 'article-code-header' in classes:
            return ''
        if tag == 'svg':
            # Shared invisible marker definitions are not a readable figure.
            if attrs.get('width') == '0':
                return ''
            self.diagram_index += 1
            directory = ROOT / 'assets/diagrams' / self.item['cover']
            if 'interview' in self.item['path']:
                directory = directory / 'interview'
            directory.mkdir(parents=True, exist_ok=True)
            destination = directory / f'{self.diagram_index}.svg'
            n.attrs['xmlns'] = 'http://www.w3.org/2000/svg'
            # Diagrams using the shared MAPA markers need their definitions too.
            defs = getattr(self, 'shared_defs', '')
            source = n.xml().replace('>', '>'+defs, 1) if defs else n.xml()
            # HTMLParser normalises case; standalone XML SVG requires SVG casing.
            for correct in ['viewBox','preserveAspectRatio','markerWidth','markerHeight','refX','refY','markerUnits','gradientUnits','gradientTransform','patternUnits','patternContentUnits','textLength','lengthAdjust','clipPathUnits','pathLength','linearGradient','radialGradient','clipPath','textPath','foreignObject']:
                source = re.sub(r'(?<=[< /])'+correct.lower()+r'(?=[ =>/])', correct, source)
            svg_style = '<style>:root{--ink:#252521;--muted:#65655d;--indigo:#3c3489;--teal:#0a5a49;--coral:#9c3b1b;--amber:#9a6b12}text{font-family:Arial,sans-serif}.svg-lbl{font-size:13px;fill:#252521}.svg-sub{font-size:11px;fill:#65655d}.svg-h{font-size:14px;font-weight:600}</style>'
            source = source.replace('>', '>'+svg_style, 1)
            destination.write_text('\n'.join(line.rstrip() for line in source.splitlines()) + '\n')
            labels = ' '.join(x.text().strip() for x in n.find(lambda x: x.tag in {'text', 'title', 'desc'}))
            label = attrs.get('aria-label') or 'Diagram'
            return f'\n\n![{label}]({urljoin("https://prigoistic.me/", str(destination.relative_to(ROOT)))})\n\n' + (f'Diagram labels: {labels}\n\n' if labels else '')
        if tag == 'pre':
            code = next(n.find(lambda x: x.tag == 'code'), n)
            language = 'mermaid' if 'mermaid' in classes else ('java' if 'oops' in self.item['path'] else '')
            raw = code.text().strip('\n')
            fence = '`' * max(3, max([len(s) + 1 for s in re.findall(r'`+', raw)] or [3]))
            return f'\n\n{fence}{language}\n{raw}\n{fence}\n\n'
        if tag == 'img':
            return f'![{attrs.get("alt", "Figure")}]({urljoin(self.item["canonical"], attrs["src"])})'
        if tag in {'video', 'iframe'}:
            source = attrs.get('src')
            if not source:
                media = next(n.find(lambda child: child.tag == 'source' and child.attrs.get('src')), None)
                source = media.attrs['src'] if media else None
            label = attrs.get('title') or attrs.get('aria-label') or 'Video'
            return f'\n\n[{label}]({urljoin(self.item["canonical"], source)})\n\n' if source else self.children(n)
        if tag == 'dl':
            entries, term = [], ''
            for child in n.children:
                if not isinstance(child, Node):
                    continue
                if child.tag == 'dt':
                    term = self.children(child).strip().rstrip(':')
                elif child.tag == 'dd':
                    value = self.children(child).strip()
                    prefix = f'**{term}:** ' if term else ''
                    entries.append('- ' + prefix + value)
            return '\n\n' + '\n'.join(entries) + '\n\n'
        if tag == 'div' and 'memory-exchange' in classes:
            lines = [self.render(child).strip() for child in n.children]
            return '\n\n' + '\n\n'.join(line for line in lines if line) + '\n\n'
        if tag == 'table':
            rows = list(n.find(lambda x: x.tag == 'tr'))
            cells = [[self.render(c).strip().replace('|', '\\|').replace('\n', '<br>') for c in row.children if isinstance(c, Node) and c.tag in {'td','th'}] for row in rows]
            if not cells:
                return ''
            width = max(map(len, cells))
            cells = [row + ['']*(width-len(row)) for row in cells]
            lines = ['| ' + ' | '.join(row) + ' |' for row in cells]
            lines.insert(1, '| ' + ' | '.join(['---']*width) + ' |')
            return '\n\n' + '\n'.join(lines) + '\n\n'
        if tag in {'ul', 'ol'}:
            lines = []
            for i, c in enumerate(x for x in n.children if isinstance(x, Node) and x.tag == 'li'):
                text = self.children(c).strip()
                marker = f'{i+1}. ' if tag == 'ol' else '- '
                lines.append(marker + text.replace('\n', '\n  '))
            return '\n\n' + '\n'.join(lines) + '\n\n'
        text = self.children(n)
        if tag == 'span' and 'num' in classes:
            return text.strip() + ' — '
        if tag == 'div' and 'stat' in classes:
            return '\n\n' + ' '.join(self.render(c).strip() for c in n.children).strip() + '\n\n'
        if tag in {'h1','h2','h3','h4','h5','h6'}:
            return '\n\n' + '#' * int(tag[1]) + ' ' + text.strip() + '\n\n'
        if tag == 'a':
            href = attrs.get('href')
            return f'[{text.strip()}]({urljoin(self.item["canonical"],href)})' if href else text
        if tag in {'strong', 'b'}:
            return '**' + text.strip() + '**'
        if tag in {'em', 'i'}:
            return '*' + text.strip() + '*'
        if tag == 'code':
            return '`' + n.text() + '`'
        if tag == 'br':
            return '\n'
        if tag == 'hr':
            return '\n\n---\n\n'
        if tag == 'blockquote':
            return '\n\n' + '\n'.join('> '+line for line in text.strip().splitlines()) + '\n\n'
        if 'article-equation' in classes:
            return '\n\n$$\n' + n.text().strip() + '\n$$\n\n'
        if tag in {'p', 'div', 'section', 'figure', 'figcaption', 'header', 'footer', 'article'}:
            return '\n\n' + text.strip() + '\n\n'
        return text
    def children(self, n):
        return ''.join(self.render(c) for c in n.children)

def main():
    items = json.loads((ROOT / 'scripts/writing.json').read_text())
    for item in items:
        article_path = ROOT/item['path']
        source = article_path.read_text()
        tree = Tree(source)
        content = next(tree.root.find(lambda n: 'article-content' in n.attrs.get('class','').split()))
        toc = ''.join(f'<a href="#{html.escape(n.attrs["id"],quote=True)}">{html.escape(n.text().strip())}</a>' for n in content.find(lambda n: n.tag == 'h2'))
        source = re.sub(r'<div data-toc-links>.*?</div>', lambda _: '<div data-toc-links>'+toc+'</div>', source, count=1, flags=re.S)
        article_path.write_text(source)
        # Visible HTML topics are also returned in Agent mode.
        topics = next(tree.root.find(lambda n: 'key-topics' in n.attrs.get('class','').split()))
        item['topics'] = [s.strip() for s in topics.text().split(' · ')]
        deck = next(tree.root.find(lambda n: 'article-deck' in n.attrs.get('class','').split())).text().strip()
        writer = Markdown(item)
        writer.shared_defs = ''.join(n.xml() for n in content.find(lambda n: n.tag == 'svg' and n.attrs.get('width') == '0'))
        text = writer.render(content)
        text = re.sub(r'[ \t]+\n', '\n', text)
        text = re.sub(r'\n[ \t]+\n', '\n\n', text)
        text = re.sub(r'\n{3,}', '\n\n', text).strip()
        header = f'# {item["title"]}\n\n{deck}\n\nAuthor: Priyam Ghosh\nPublished: {item["date"]}\nCanonical: {item["canonical"]}\nKeywords: {", ".join(item["topics"])}\n\n'
        destination = (ROOT/item['path']).with_suffix('.md')
        destination.write_text(header + text + '\n')
        revision = hashlib.sha256(destination.read_bytes()).hexdigest()[:12]
        source = re.sub(r'data-markdown="([^"?]+)(?:\?[^\"]*)?"', lambda m: f'data-markdown="{m.group(1)}?v={revision}"', source)
        article_path.write_text(source)
    catalogue = '# Blogs — Priyam Ghosh\n\nEssays on memory, neuroscience, mathematics, and building software.\n\n'
    for item in items:
        md = str(Path(item['path']).with_suffix('.md'))
        catalogue += f'- [{item["title"]}]({item["canonical"]}) — [Markdown](https://prigoistic.me/{md})\n'
    (ROOT/'blog.md').write_text(catalogue)
    urls = ['https://prigoistic.me/', *['https://prigoistic.me/'+p for p in ['projects.html','experience.html','research.html','blog.html','contact.html','resume/']], *[i['canonical'] for i in items]]
    root = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for url in urls:
        ET.SubElement(ET.SubElement(root, 'url'), 'loc').text = url
    ET.indent(root)
    (ROOT/'sitemap.xml').write_bytes(ET.tostring(root, encoding='utf-8', xml_declaration=True))
    print(f'Generated {len(items)} complete Markdown articles, catalogue, diagrams, and sitemap.')

if __name__ == '__main__':
    main()
