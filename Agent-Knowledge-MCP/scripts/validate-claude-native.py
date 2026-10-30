#!/usr/bin/env python3
"""Explicitly invoked, bounded Claude MCP integration check; never opens credentials."""
import json
import os
from pathlib import Path
import signal
import subprocess

package = Path(__file__).resolve().parent.parent
entry = json.loads((Path.home() / '.claude.json').read_text())['mcpServers']['agent-knowledge']
names = ['knowledge_status', 'get_orchestrator_policy', 'get_runtime_architecture', 'list_agent_adapters']
prompt = '''Execute exatamente estas quatro tools MCP, uma chamada cada:
knowledge_status({}),
get_orchestrator_policy({"section":"Quando executar direto e quando delegar"}),
get_runtime_architecture({"component":"overview","section":"Camadas"}),
list_agent_adapters({}).
Não use outras ferramentas, não leia arquivos, não delegue e não altere nada.
Ao final informe quais chamadas deram erro e cite as fontes. Não simule chamadas.'''
command = ['claude', '-p', prompt, '--model', 'sonnet', '--output-format', 'stream-json',
           '--verbose', '--no-session-persistence', '--strict-mcp-config', '--mcp-config',
           json.dumps({'mcpServers': {'agent-knowledge': entry}}), '--tools', '',
           '--allowedTools', ','.join('mcp__agent-knowledge__' + n for n in names),
           '--permission-mode', 'dontAsk', '--disable-slash-commands',
           '--setting-sources', '', '--max-budget-usd', '1']
evidence = package / 'validation-output/claude-native-integration.jsonl'
evidence.parent.mkdir(exist_ok=True)
with evidence.open('w') as output:
    process = subprocess.Popen(command, cwd=package, stdout=output, stderr=subprocess.PIPE,
                               text=True, start_new_session=True)
    try:
        _, stderr = process.communicate(timeout=150)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            _, stderr = process.communicate(timeout=10)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            _, stderr = process.communicate()
        print('TIMEOUT: 150 seconds')
print('process_exit:', process.returncode, 'evidence:', evidence)
if stderr:
    print('stderr:', stderr[:1500])
calls, results, final = [], {}, None
for line in evidence.read_text().splitlines():
    try:
        event = json.loads(line)
    except ValueError:
        continue
    for block in event.get('message', {}).get('content', []):
        if block.get('type') == 'tool_use':
            calls.append((block['id'], block['name']))
            print('TOOL_USE', block['name'], json.dumps(block.get('input'), ensure_ascii=False))
        if block.get('type') == 'tool_result':
            results[block['tool_use_id']] = not block.get('is_error', False)
            print('TOOL_RESULT', block['tool_use_id'], 'ok=', results[block['tool_use_id']])
    if event.get('type') == 'result':
        final = event
        print('RESULT', json.dumps(event, ensure_ascii=False))
expected = {'mcp__agent-knowledge__' + name for name in names}
passed = (process.returncode == 0 and final is not None and not final.get('is_error')
          and len(calls) == 4 and {name for _, name in calls} == expected
          and all(results.get(identifier) for identifier, _ in calls))
print('four_tools_verified:', passed)
raise SystemExit(0 if passed else 1)
