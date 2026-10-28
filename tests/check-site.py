#!/usr/bin/env python3
"""Dependency-free checks for static resources, anchors, metadata and packaging."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import json
import re
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

for filename in ['index.html', '404.html']:
    text = (root / filename).read_text()
    page = Page(text)
    ids = [a['id'] for _, a in page.tags if 'id' in a]
    assert len(ids) == len(set(ids)), f'{filename}: duplicate IDs'
    assert sum(t == 'h1' for t, _ in page.tags) == 1
    for tag, attrs in page.tags:
        if tag == 'img':
            assert all(k in attrs for k in ['alt', 'width', 'height'])
        paths = [attrs[k] for k in ['src', 'href'] if k in attrs]
        if 'srcset' in attrs:
            paths += [item.strip().split()[0] for item in attrs['srcset'].split(',')]
        if attrs.get('property') == 'og:image' or attrs.get('name') == 'twitter:image':
            paths.append(attrs['content'])
        for path in paths:
            if path.startswith('#'):
                assert path[1:] in ids, f'{filename}: broken anchor {path}'
                continue
            url = urlparse(path)
            if url.scheme and url.netloc != 'basusinternational.com':
                continue
            if url.path and url.path != '/':
                assert (root / url.path.lstrip('/')).is_file(), f'{filename}: missing {path}'
    for label in [a for t, a in page.tags if t == 'label']:
        assert label['for'] in ids, f'{filename}: broken form label'

html = (root / 'index.html').read_text()
schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)[1])
assert schema['@type'] == 'Organization'
assert schema['url'] == 'https://basusinternational.com/'
assert 'areaServed' not in schema
assert (root / urlparse(schema['logo']).path.lstrip('/')).is_file()
assert 'novalidate' not in html
assert 'assets/hero-bg' not in html and 'assets/global-supply-map' not in html
assert '-pillar' not in html and 'assets/social-share.jpg' not in html
assert html.count('class="technical-details"') == 3
for asset in re.findall(r'url\([\'\"]?([^\'\")]+)', (root / 'style.css').read_text()):
    assert (root / asset).is_file(), f'Missing CSS resource: {asset}'
sitemap = ET.parse(root / 'sitemap.xml')
assert [node.text for node in sitemap.iter() if node.tag.endswith('loc')] == ['https://basusinternational.com/']
assert 'Sitemap: https://basusinternational.com/sitemap.xml' in (root / 'robots.txt').read_text()
print('PASS: local paths, srcsets, CSS fonts, image attributes, unique IDs, section links, labels, schema and crawl files.')
