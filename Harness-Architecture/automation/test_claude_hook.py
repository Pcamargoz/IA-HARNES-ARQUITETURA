"""Contract checks for guards, kill switch and telemetry redaction; no agents run."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('claude_hook', Path(__file__).with_name('claude_hook.py'))
hook = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hook)
runtime_spec = importlib.util.spec_from_file_location('record_runtime', Path(__file__).with_name('record_runtime.py'))
runtime = importlib.util.module_from_spec(runtime_spec)
runtime_spec.loader.exec_module(runtime)


class HookContract(unittest.TestCase):
    def event(self, name, **inputs):
        return {'tool_name': name, 'tool_input': inputs, 'cwd': str(hook.HARNESS)}

    def test_secret_and_excluded_paths_denied(self):
        for path in ['.env', '/tmp/.env.local', '/tmp/TRADERS FAKALUM/test.md',
                     '/Users/macbook/.hermes/config.yaml', '/tmp/Harness-Arquitetura-Flow/HOME.md']:
            self.assertEqual(hook.decision(self.event('Read', file_path=path), {})[0], 'deny')

    def test_kill_switch_does_not_disable_security(self):
        env = {'HARNESS_ORCH_DISABLE': '1'}
        self.assertEqual(hook.decision(self.event('Agent', prompt='test'), env)[0], 'deny')
        self.assertEqual(hook.decision(self.event('Bash', command='claude -p test'), env)[0], 'deny')
        self.assertEqual(hook.decision(self.event('Bash', command='git push'), env)[0], 'ask')
        self.assertIsNone(hook.decision(self.event('Read', file_path='HOME.md'), env)[0])

    def test_secret_globs_and_relative_symlinks_denied(self):
        for name, inputs in [('Grep', {'path': '.', 'glob': '.env*', 'pattern': '.'}),
                             ('Grep', {'path': '.', 'glob': '**/*.env*', 'pattern': '.'}),
                             ('Glob', {'pattern': '**/.env*'})]:
            self.assertEqual(hook.decision(self.event(name, **inputs), {})[0], 'deny')
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'alias.md').symlink_to(root / '.env')
            event = self.event('Read', file_path='alias.md')
            event['cwd'] = directory
            self.assertEqual(hook.decision(event, {})[0], 'deny')

    def test_kill_switch_preserves_literal_ipc_but_not_new_tasks(self):
        env = {'HARNESS_ORCH_DISABLE': '1'}
        for command in ['maestri list', 'maestri check Lince',
                        'maestri ask Codex "Claude results received; no new task"']:
            self.assertIsNone(hook.decision(self.event('Bash', command=command), env)[0])
        for command in ['maestri recruit Another', 'maestri ask Lince "new work"',
                        'maestri list; claude -p task', 'maestri ask Codex "$(claude -p task)"',
                        'maestri ask Codex\nclaude', 'maestri ask Codex\rclaude']:
            self.assertEqual(hook.decision(self.event('Bash', command=command), env)[0], 'deny')

    def test_external_and_opaque_shell_effects_require_review(self):
        for command in ['git push', 'rm -rf /tmp/demo', 'python3 -c "print(1)"', 'pwd; curl example.com']:
            self.assertEqual(hook.decision(self.event('Bash', command=command), {})[0], 'ask')
        self.assertIsNone(hook.decision(self.event('Bash', command='git status --short'), {})[0])
        self.assertEqual(hook.decision(self.event('mcp__other__send', value='test'), {})[0], 'ask')

    def test_canonical_write_scope(self):
        self.assertEqual(hook.decision(self.event('Write', file_path='HOME.md'), {})[0], 'ask')
        self.assertIsNone(hook.decision(self.event('Write', file_path='Inbox/draft.md'), {})[0])
        self.assertIsNone(hook.decision(self.event('Write', file_path='HOME.md'),
                                      {'HARNESS_APPROVED_WRITE_ROOTS': str(hook.HARNESS)})[0])

    def test_telemetry_never_stores_input_output_or_session(self):
        event = self.event('Read', file_path='/private/SECRET.txt')
        event.update(hook_event_name='PostToolUse', session_id='PRIVATE_SESSION',
                     tool_response='SECRET_OUTPUT', transcript_path='/private/SECRET.json')
        with tempfile.TemporaryDirectory() as directory:
            row = hook.telemetry(event, directory)
            text = (Path(directory) / 'events.jsonl').read_text()
            for secret in ['SECRET', 'PRIVATE_SESSION', 'transcript_path', 'tool_input', 'tool_response']:
                self.assertNotIn(secret, text)
            self.assertEqual(json.loads(text), row)
            self.assertNotIn('tokens_in', row)
            self.assertNotIn('cost_usd', row)

    def test_no_telemetry_inside_vaults(self):
        for destination in [hook.HARNESS / 'Metrics', Path.home() / 'Downloads/Cofre do Pedro/AI-Agent-Ecosystem']:
            with self.assertRaises(ValueError):
                hook.telemetry({'hook_event_name': 'PostToolUse'}, destination)

    def test_subagent_stop_is_not_a_verdict(self):
        with tempfile.TemporaryDirectory() as directory:
            row = hook.telemetry({'hook_event_name': 'SubagentStop'}, directory)
            self.assertEqual(row['data']['independent_verdict'], 'unavailable')

    def test_runtime_receipt_omits_private_content_and_keeps_provenance(self):
        row = runtime.sanitize({'schema': 'akm.runtime.v1', 'task_id': 'PRIVATE_TASK',
                               'adapter': 'claude-code', 'status': 'failed', 'output': 'SECRET',
                               'error': {'message': 'SECRET'},
                               'metrics': {'tokens_source': 'reported', 'tokens_in': 23,
                                           'cost_source': 'unavailable', 'latency_ms': 50}})
        self.assertNotIn('SECRET', json.dumps(row))
        self.assertNotIn('PRIVATE_TASK', json.dumps(row))
        self.assertEqual(row['metrics']['tokens_in'], 23)
        self.assertNotIn('cost_usd', row['metrics'])
        self.assertEqual(row['status'], 'failed')

    def test_runtime_receipt_rejects_invalid_measurement(self):
        for value in [-1, float('inf'), 'SECRET', True]:
            with self.assertRaises(ValueError):
                runtime.sanitize({'schema': 'akm.runtime.v1', 'adapter': 'shell-echo',
                                  'status': 'done', 'metrics': {'tokens_in': value}})

    def test_runtime_receipt_rejects_symlink_parent_into_vault(self):
        result = {'schema': 'akm.runtime.v1', 'adapter': 'shell-echo',
                  'status': 'not_executed', 'metrics': {}}
        with tempfile.TemporaryDirectory() as directory:
            alias = Path(directory) / 'alias'
            alias.symlink_to(hook.HARNESS / 'Metrics', target_is_directory=True)
            with self.assertRaises(ValueError):
                runtime.record(result, alias / 'must-not-be-created.jsonl')


if __name__ == '__main__':
    unittest.main()
