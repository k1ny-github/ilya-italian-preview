from pathlib import Path
import shutil, json, os, re
root=Path(__file__).resolve().parents[1]
out=root/'_site'
out.mkdir(exist_ok=True)
for name in ['index.html','ru.html','en.html','it.html','privacy.html','robots.txt','sitemap.xml','favicon.svg','.nojekyll','THIRD-PARTY-NOTICES.txt']:
    shutil.copy2(root/name,out/name)
for name in ['assets','images']:
    shutil.copytree(root/name,out/name,dirs_exist_ok=True)
for name in ['index.html','ru.html','en.html','it.html']:
    html=(out/name).read_text(encoding='utf8')
    modules=re.findall(r'<script[^>]+src="([^"]+)"',html)
    assert modules, f'{name}: no entry script'
    for url in modules:
        relative=url.removeprefix('/ilya-italian-preview/').lstrip('/')
        assert (out/relative).is_file(), f'{name}: missing {relative}'
    assert 'content="index, follow"' in html
    assert html.count('background-image:url(&quot;data:image/webp;base64,')==4
assert 'Disallow: /\n' not in (out/'robots.txt').read_text(encoding='utf8')
(out/'deployment.json').write_text(json.dumps({'commit':os.environ.get('GITHUB_SHA','local'),'heroRelease':'863eaa5'}),encoding='utf8')
files=[p for p in out.rglob('*') if p.is_file()]
print(f'Production artifact: {len(files)} files, {sum(p.stat().st_size for p in files)/1024/1024:.2f} MiB')
assert not any((out/x).exists() for x in ['source','history','review','evidence','report'])
