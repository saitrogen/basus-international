#!/usr/bin/env python3
"""Package only public site files; never publish the repository or QA evidence."""
from pathlib import Path
from shutil import copy2, rmtree
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parents[1]
files = [root / name for name in (
    'index.html', '404.html', 'style.css', 'main.js', 'robots.txt',
    'sitemap.xml', '_headers', 'assets/favicon.png', 'assets/social-share.jpg',
)]
files += sorted((root / 'assets').glob('*.webp'))
files += sorted((root / 'assets/fonts').glob('*.woff2'))
files += sorted((root / 'assets/fonts').glob('*-OFL.txt'))
assert all(path.is_file() for path in files), 'A required public file is missing.'
assert len(files) == len(set(files)), 'Duplicate package entry.'
assert not any(path.suffix in ('.py', '.cjs') or '.git' in path.parts for path in files)
stage = root / 'dist/site'
archive = root / 'dist/basus-launch.zip'
if stage.exists():
    rmtree(stage)
stage.mkdir(parents=True)
with ZipFile(archive, 'w', ZIP_DEFLATED) as package:
    for source in files:
        relative = source.relative_to(root)
        destination = stage / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        copy2(source, destination)
        package.write(destination, str(relative))
with ZipFile(archive) as package:
    assert package.testzip() is None, 'Archive failed its integrity check.'
    assert set(package.namelist()) == {str(path.relative_to(root)) for path in files}
print(f'{len(files)} public files: {archive} ({archive.stat().st_size:,} bytes)')
print(f'SHA-256: {hashlib.sha256(archive.read_bytes()).hexdigest()}')
