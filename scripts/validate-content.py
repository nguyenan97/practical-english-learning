#!/usr/bin/env python3
"""Check curriculum references and the actual rendered site's local links."""
from __future__ import annotations
import argparse
import datetime as dt
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import yaml

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []
# Focused regression guard for Vietnamese leftovers, not a general language detector.
# English words such as café remain valid.
VIETNAMESE_COPY = re.compile(
    r'[ĐđĂăƠơƯưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]'
    r'|\b(?:Hôm nay|Bài học|tiếng Anh|Chưa|Tiếp tục|Tự kiểm tra)\b', re.I
)

def require(condition, message):
    if not condition: errors.append(message)

def load_page(path):
    text = path.read_text()
    require(text.startswith('---\n'), f'{path.relative_to(ROOT)}: missing front matter')
    if not text.startswith('---\n'): return {}, text
    try:
        _, metadata, body = text.split('---', 2)
        return yaml.safe_load(metadata) or {}, body
    except (ValueError, yaml.YAMLError) as exc:
        errors.append(f'{path.relative_to(ROOT)}: invalid front matter: {exc}')
        return {}, ''

def unique(items, field, label):
    values = [item.get(field) for item in items]
    valid = all(isinstance(value, (str, int)) and value != '' for value in values)
    require(valid, f'{label}: missing or invalid {field}')
    if valid: require(len(values) == len(set(values)), f'{label}: duplicate {field}')

def curriculum():
    public_dirs = ['_layouts','_includes','_data','assets','lessons','phrases','scenarios',
                   'docs','templates','sources','methods','agent-skill']
    public_files = [ROOT / 'index.md', ROOT / 'README.md']
    for directory in public_dirs:
        public_files.extend(path for path in (ROOT / directory).rglob('*')
                            if path.suffix in {'.md','.html','.yml','.js'})
    for path in public_files:
        if not path.exists(): continue
        require(not VIETNAMESE_COPY.search(path.read_text()),
                f'{path.relative_to(ROOT)}: published copy must be English')
        if path.suffix in {'.md','.html'} and path.read_text().startswith('---\n'):
            metadata, _ = load_page(path)
            require(metadata.get('lang', 'en') == 'en',
                    f'{path.relative_to(ROOT)}: published page lang must be en')
    chunks = yaml.safe_load((ROOT / '_data/chunks.yml').read_text())
    groups = yaml.safe_load((ROOT / '_data/phrase_groups.yml').read_text())
    guides = yaml.safe_load((ROOT / '_data/lesson_steps.yml').read_text())
    require(isinstance(guides, list) and len(guides) == 4, 'lesson_steps: exactly four guides required')
    if isinstance(guides, list):
        require([item.get('label') for item in guides if isinstance(item, dict)] == ['Recall','Learn','Practice','Check'],
                'lesson_steps: use Recall, Learn, Practice, Check in order')
        for item in guides:
            require(isinstance(item, dict) and isinstance(item.get('minutes'), int) and item['minutes'] > 0
                    and all(isinstance(item.get(f), str) and item[f].strip() for f in ['task','done']),
                    'lesson_steps: each guide needs positive minutes, task and done')
    unique(chunks, 'id', 'chunks'); unique(groups, 'id', 'groups')
    phrase_texts = [' '.join(str(item.get('text', '')).casefold().split()) for item in chunks]
    require(len(phrase_texts) == len(set(phrase_texts)), 'chunks: duplicate phrase text; reuse its existing ID')
    chunk_map = {item['id']: item for item in chunks}
    group_ids = {item['id'] for item in groups}
    lessons = []
    lesson_bodies = {}
    for path in sorted((ROOT / 'lessons').glob('*.md')):
        meta, body = load_page(path)
        lessons.append(meta); lesson_bodies[meta.get('lesson_id')] = body
        label = str(path.relative_to(ROOT))
        fields = ['layout', 'title', 'lesson_id', 'date', 'order', 'level', 'track', 'track_label', 'lesson_key', 'anchor', 'duration_minutes', 'new_chunk_ids', 'review_chunk_ids', 'prerequisite_lesson_ids', 'topic_tags', 'description', 'target', 'scenario_id']
        for field in fields: require(field in meta and meta[field] is not None, f'{label}: missing {field}')
        for field in ['title','description','target']:
            require(isinstance(meta.get(field), str) and bool(meta[field].strip()), f'{label}: {field} must be non-empty text')
        require(meta.get('layout') == 'lesson', f'{label}: use lesson layout')
        try: dt.date.fromisoformat(str(meta.get('date')))
        except ValueError: errors.append(f'{label}: date must be YYYY-MM-DD')
        require(isinstance(meta.get('order'), int) and meta['order'] > 0, f'{label}: invalid order')
        require(isinstance(meta.get('duration_minutes'), int) and 15 <= meta['duration_minutes'] <= 25, f'{label}: duration must be 15–25 minutes')
        require(meta.get('track') in {'daily-life','work-communication','technical-english','social','travel','mixed'}, f'{label}: invalid track')
        require(isinstance(meta.get('level'), str) and re.fullmatch(r'[ABC][12](?:[–-][ABC][12])?', meta['level']), f'{label}: invalid CEFR level')
        for field in ['new_chunk_ids','review_chunk_ids','prerequisite_lesson_ids','topic_tags']:
            value = meta.get(field, [])
            require(isinstance(value, list) and all(isinstance(x, str) for x in value), f'{label}: {field} must be a string list')
            if not isinstance(value, list) or not all(isinstance(x, str) for x in value): meta[field] = []
            else: require(len(value) == len(set(value)), f'{label}: duplicate {field}')
        new = meta.get('new_chunk_ids', []); review = meta.get('review_chunk_ids', [])
        require(3 <= len(new) <= 5, f'{label}: expected 3–5 new chunks')
        require(not set(new) & set(review), f'{label}: new and review overlap')
        require(all(x in chunk_map for x in new + review), f'{label}: unknown chunk reference')
        for id in new:
            if id in chunk_map:
                require(chunk_map[id].get('lesson_id') == meta.get('lesson_id'),
                        f'{label}: new chunk {id} must link back to its introducing lesson')
        require(body.count('<!-- step -->') == 3, f'{label}: exactly three step markers required')
        require(body.count('<!-- answers -->') == 1, f'{label}: exactly one answer marker required')
        sections = body.split('<!-- answers -->')
        require(len(sections) == 2 and bool(sections[-1].strip()), f'{label}: answer key required')
        if len(sections) == 2:
            require(sections[0].count('<!-- step -->') == 3, f'{label}: step markers must precede answers')
            steps = sections[0].split('<!-- step -->')
            for n, keyword in enumerate(['Review', 'Learn', 'Practice', 'Exit task']):
                require(n < len(steps) and re.search(r'^## '+keyword, steps[n], re.M | re.I), f'{label}: step {n+1} must contain {keyword}')
            require(re.search(r'^## Answer key', sections[1], re.M), f'{label}: answer key heading required')
    for field in ['lesson_id', 'lesson_key', 'order']: unique(lessons, field, 'lessons')
    lesson_map = {item.get('lesson_id'): item for item in lessons}
    for chunk in chunks:
        for field in ['text','meaning','situation','example','cue','variant','note','register']:
            require(isinstance(chunk.get(field), str) and bool(chunk[field]), f'chunk {chunk["id"]}: missing {field}')
        require(chunk.get('group') in group_ids, f'chunk {chunk["id"]}: unknown group')
        if chunk.get('lesson_id'):
            require(chunk['lesson_id'] in lesson_map, f'chunk {chunk["id"]}: unknown lesson')
            require(chunk['id'] in lesson_map.get(chunk['lesson_id'], {}).get('new_chunk_ids', []), f'chunk {chunk["id"]}: linked lesson must introduce it')
    introduced = [chunk for lesson in lessons for chunk in lesson.get('new_chunk_ids', [])]
    require(len(introduced) == len(set(introduced)), 'A chunk is introduced as new in multiple lessons; use review_chunk_ids instead')
    scenarios = []
    for path in (ROOT / 'scenarios').glob('*.md'):
        meta, body = load_page(path); scenarios.append(meta)
        label = str(path.relative_to(ROOT))
        require(meta.get('lesson_id_ref') in lesson_map, f'{label}: unknown lesson reference')
        turns = meta.get('turns', [])
        require(isinstance(turns, list) and 3 <= len(turns) <= 5, f'{label}: expected 3–5 partner turns')
        if not isinstance(turns, list): turns = []
        for turn in turns:
            require(isinstance(turn, dict) and isinstance(turn.get('prompt'), str) and isinstance(turn.get('hint'), str), f'{label}: each turn needs prompt and hint')
        require('Model dialogue' in body and 'Switch roles' in body and '**Change:**' in body, f'{label}: model, changed situation and role reversal required')
        require('{#change-situation}' in body, f'{label}: change-situation heading ID required for the practice handoff')
        model = body.split('Model dialogue',1)[-1].split('</details>',1)[0]
        require(6 <= len(re.findall(r'^\*\*(?:You|Colleague|Friend):\*\*',model,re.M)) <= 10, f'{label}: model must contain 6–10 turns')
    unique(scenarios, 'scenario_id', 'scenarios')
    scenario_map = {item.get('scenario_id'): item for item in scenarios}
    for lesson in lessons:
        sid = lesson.get('scenario_id')
        require(sid in scenario_map, f'{lesson.get("lesson_id")}: unknown scenario')
        require(scenario_map.get(sid, {}).get('lesson_id_ref') == lesson.get('lesson_id'), f'{lesson.get("lesson_id")}: scenario must link back')
        for id in lesson.get('prerequisite_lesson_ids', []): require(id in lesson_map, f'{lesson.get("lesson_id")}: unknown prerequisite {id}')
    visiting, visited = set(), set()
    def visit(id):
        if id in visiting:
            errors.append(f'Prerequisite cycle at {id}'); return
        if id in visited or id not in lesson_map: return
        visiting.add(id)
        for child in lesson_map[id].get('prerequisite_lesson_ids', []): visit(child)
        visiting.remove(id); visited.add(id)
    for id in lesson_map: visit(id)
    for directory in ['docs','templates','methods','sources','agent-skill']:
        for path in (ROOT / directory).glob('*.md'): load_page(path)
    config = yaml.safe_load((ROOT / '_config.yml').read_text())
    for entry in ['private','work','scripts','english-learning-log.md']:
        require(entry in config.get('exclude', []), f'Jekyll must exclude {entry}')
        if entry != 'scripts': require(entry+'/' in (ROOT / '.gitignore').read_text() or entry in (ROOT / '.gitignore').read_text(), f'Git must ignore {entry}')
    print(f'Checked {len(lessons)} lessons, {len(chunks)} chunks, {len(scenarios)} scenarios.')

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.ids = set()
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs: self.ids.add(attrs['id'])
        if tag in {'a','link'} and attrs.get('href'): self.links.append(attrs['href'])
        if tag in {'script','img'} and attrs.get('src'): self.links.append(attrs['src'])

def built_site(site):
    site = site.resolve()
    require(site.exists(), 'Built site missing; run Jekyll build first')
    base = yaml.safe_load((ROOT / '_config.yml').read_text()).get('baseurl','').rstrip('/')
    parsed = {}
    for path in site.rglob('*.html'):
        parser = PageParser(); parser.feed(path.read_text()); parsed[path] = parser
        require(not VIETNAMESE_COPY.search(path.read_text()),
                f'{path.relative_to(site)}: rendered copy must be English')
    for path, parser in parsed.items():
        for link in parser.links:
            url = urlsplit(link)
            if url.scheme or url.netloc: continue
            target = unquote(url.path)
            if target.startswith('/'):
                if base and target.startswith(base+'/'): target = target[len(base):]
                elif base and target != base: errors.append(f'{path.relative_to(site)}: link escapes baseurl: {link}'); continue
                elif target == base: target = '/'
                dest = site / target.lstrip('/')
            elif target: dest = path.parent / target
            else: dest = path
            if dest.is_dir(): dest = dest / 'index.html'
            dest = dest.resolve()
            require(dest.exists(), f'{path.relative_to(site)}: missing link target {link}')
            if url.fragment and dest in parsed:
                require(unquote(url.fragment) in parsed[dest].ids, f'{path.relative_to(site)}: unknown fragment {link}')
    for entry in ['private','work','scripts','english-learning-log.md','AGENTS.md','README.md','Gemfile','node_modules','vendor']:
        require(not (site / entry).exists(), f'Private/development content leaked into build: {entry}')
    print(f'Checked internal links in {len(parsed)} rendered pages; private/development paths excluded.')

if __name__ == '__main__':
    arg = argparse.ArgumentParser(); arg.add_argument('--site', type=Path); args = arg.parse_args()
    curriculum()
    if args.site: built_site(args.site)
    if errors:
        for message in errors: print('ERROR:',message,file=sys.stderr)
        sys.exit(1)
    print('Content validation passed. Semantic novelty and naturalness still need editorial review.')
