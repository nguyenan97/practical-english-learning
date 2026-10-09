#!/usr/bin/env python3
"""Verify that authoring mistakes are rejected, not just the valid seed content."""
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]

class ContentValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ['_data', 'lessons', 'scenarios', 'docs', 'templates', 'sources', 'methods', 'agent-skill']:
            shutil.copytree(ROOT / name, self.root / name)
        for name in ['_config.yml', '.gitignore']:
            shutil.copy(ROOT / name, self.root / name)
        (self.root / 'scripts').mkdir()
        shutil.copy(ROOT / 'scripts/validate-content.py', self.root / 'scripts/validate-content.py')
        self.lessons = sorted((self.root / 'lessons').glob('*.md'))

    def edit(self, path, change):
        text = path.read_text()
        _, raw, body = text.split('---', 2)
        metadata = yaml.safe_load(raw)
        change(metadata)
        path.write_text('---\n' + yaml.safe_dump(metadata, allow_unicode=True, sort_keys=False) + '---' + body)

    def run_check(self):
        return subprocess.run([sys.executable, str(self.root / 'scripts/validate-content.py')], capture_output=True, text=True)

    def test_valid_curriculum(self):
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_unknown_chunk(self):
        self.edit(self.lessons[0], lambda meta: meta['new_chunk_ids'].__setitem__(0, 'missing-chunk'))
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('unknown chunk reference', result.stderr)

    def test_prerequisite_cycle(self):
        ids = [yaml.safe_load(path.read_text().split('---', 2)[1])['lesson_id'] for path in self.lessons[:2]]
        self.edit(self.lessons[0], lambda meta: meta.update(prerequisite_lesson_ids=[ids[1]]))
        self.edit(self.lessons[1], lambda meta: meta.update(prerequisite_lesson_ids=[ids[0]]))
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Prerequisite cycle', result.stderr)

    def test_missing_answer_marker(self):
        path = self.lessons[0]
        path.write_text(path.read_text().replace('<!-- answers -->', ''))
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('answer marker required', result.stderr)

    def test_invalid_id_list(self):
        self.edit(self.lessons[0], lambda meta: meta.update(new_chunk_ids=[{'not': 'an ID'}]))
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('must be a string list', result.stderr)
        self.assertNotIn('Traceback', result.stderr)

    def test_private_path_must_be_excluded(self):
        path = self.root / '_config.yml'
        config = yaml.safe_load(path.read_text())
        config['exclude'].remove('private')
        path.write_text(yaml.safe_dump(config))
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Jekyll must exclude private', result.stderr)

if __name__ == '__main__':
    unittest.main()
