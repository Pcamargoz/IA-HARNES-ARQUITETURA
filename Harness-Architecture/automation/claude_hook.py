#!/usr/bin/env python3
"""Project-local Claude guards and metadata-only telemetry. No credential reads."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import sys

HARNESS = Path(__file__).resolve().parents[1]
OUTPUT = Path.home() / 'Downloads/Agent-Knowledge-MCP/runtime-output/harness-telemetry'
DELEGATION = {'Agent', 'Task'}
READ_TOOLS = {'Read', 'Grep', 'Glob', 'ListMcpResourcesTool', 'ReadMcpResourceTool'}
WRITE_TOOLS = {'Write', 'Edit', 'MultiEdit', 'NotebookEdit'}


def forbidden(value):
    text = str(value).replace('\\', '/').lower()
    return bool(re.search(r'(^|[/\s\"\x27=])\.env(?:[^a-z0-9]|$)', text)
                or 'traders fakalum' in text
                or '/.hermes' in text or '/hermes-docker' in text
                or 'harness-arquitetura-flow' in text)


def passive_maestri(command, coordinator):
    """Recognize literal IPC commands, never substitutions or compound shell code."""
    if any(char in command for char in ('$', '`', '\n', '\r')):
        return False
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=';&|<>')
        lexer.whitespace_split = True
        tokens = list(lexer)
    except ValueError:
        return False
    if not tokens or Path(tokens[0]).name != 'maestri':
        return False
    if len(tokens) == 2 and tokens[1] == 'list':
        return True
    if len(tokens) == 3 and tokens[1] == 'check':
        return True
    if len(tokens) == 4 and tokens[1:3] == ['note', 'read']:
        return True
    return len(tokens) == 4 and tokens[1:3] == ['ask', coordinator]


def decision(event, environment=None):
    env = os.environ if environment is None else environment
    name = event.get('tool_name', '')
    inputs = event.get('tool_input', {})
    # Inspect paths and command arguments only; never scan text being written.
    location_values = [(k, v) for k, v in inputs.items()
                       if k in {'file_path', 'path', 'notebook_path', 'command', 'cwd', 'glob', 'include'}
                       or (name == 'Glob' and k == 'pattern')]
    for key, value in location_values:
        if forbidden(value):
            return 'deny', 'Excluded secret, project or runtime path.'
        if key in {'glob', 'include', 'pattern'} and '.env' in str(value).lower():
            return 'deny', 'Secret environment file selector is excluded.'
        if key in {'file_path', 'path', 'notebook_path', 'cwd'} and isinstance(value, str):
            target = Path(value).expanduser()
            if not target.is_absolute():
                target = Path(event.get('cwd') or HARNESS) / target
            if forbidden(target.resolve()):
                return 'deny', 'Resolved path is excluded.'
    if name in DELEGATION:
        if env.get('HARNESS_ORCH_DISABLE') == '1':
            return 'deny', 'HARNESS_ORCH_DISABLE=1 blocks new delegations.'
        return 'ask', 'Native provisioning needs an approved task, implemented adapter and budget.'
    if name in WRITE_TOOLS:
        raw = inputs.get('file_path') or inputs.get('notebook_path')
        if not raw:
            return 'ask', 'Write scope could not be determined.'
        target = Path(raw).expanduser()
        if not target.is_absolute():
            target = Path(event.get('cwd') or HARNESS) / target
        target = target.resolve()
        if target == HARNESS or HARNESS in target.parents:
            inbox = HARNESS / 'Inbox'
            approved = [inbox]
            # Set only by the user at session launch after explicit scope approval.
            for item in env.get('HARNESS_APPROVED_WRITE_ROOTS', '').split(os.pathsep):
                if item:
                    approved.append(Path(item).expanduser().resolve())
            if not any(target == root or root in target.parents for root in approved):
                return 'ask', 'Canonical Harness write requires an approved scope.'
        return None, None
    if name in {'Bash', 'PowerShell', 'Terminal'}:
        command = inputs.get('command', '')
        if passive_maestri(command, env.get('HARNESS_COORDINATOR', 'Codex')):
            # Keep discovery, inspection and approved report-back usable during shutdown.
            return None, None
        if env.get('HARNESS_ORCH_DISABLE') == '1' and re.search(
                r'\b(claude|codex|cursor-agent|opencode|qwen|gemini|ollama|maestri)\b', command):
            return 'deny', 'Kill switch blocks agent launch through shell commands.'
        # A shell can hide arbitrary effects; only a very small exact read set bypasses this guard.
        if re.fullmatch(r'\s*(pwd|git status(?: --short)?|git diff(?: --stat)?|git log -\d+ --oneline)\s*', command):
            return None, None
        return 'ask', 'Command execution needs scope review; shell effects are not inferred from a prefix.'
    if name.startswith('mcp__'):
        if name.startswith('mcp__agent-knowledge__'):
            return None, None
        if name.startswith('mcp__hermes-vault__') and name.rsplit('__', 1)[-1] in {
                'vault_index', 'vault_search', 'vault_read', 'vault_outline', 'vault_query',
                'vault_recent', 'vault_health', 'vault_metrics', 'vault_retrieve'}:
            return None, None
        return 'ask', 'Other MCP operations may write or send data externally; review the operation.'
    if name in READ_TOOLS:
        return None, None
    if any(term in name.lower() for term in ('send', 'publish', 'deploy', 'delete', 'payment', 'webfetch', 'websearch')):
        return 'ask', 'External or irreversible operation requires explicit approval.'
    return None, None


def telemetry(event, output_dir=OUTPUT):
    kind = event.get('hook_event_name')
    if kind not in {'PostToolUse', 'PostToolUseFailure', 'SubagentStop'}:
        raise ValueError('Unsupported telemetry event')
    tool = event.get('tool_name', '')
    # Tool names are vocabulary, never arbitrary payload content.
    tool = tool if re.fullmatch(r'[A-Za-z0-9_:-]{1,180}', tool) else 'unknown'
    run = hashlib.sha256(str(event.get('session_id', 'unknown')).encode()).hexdigest()[:20]
    row = {
        'schema': 'akm.orchestration.v1',
        'ts': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'run_id': run, 'task_id': run, 'step': 0,
        'event': 'verification' if kind == 'SubagentStop' else 'tool_call',
        'tool': tool,
        'status': 'error' if kind == 'PostToolUseFailure' else 'ok',
        'data': {'source': 'claude-hook', 'hook_event': kind,
                 'independent_verdict': 'unavailable'} if kind == 'SubagentStop'
                else {'source': 'claude-hook', 'hook_event': kind},
    }
    destination = Path(output_dir).resolve()
    if HARNESS == destination or HARNESS in destination.parents:
        raise ValueError('Telemetry must stay outside the Harness')
    cofre = (Path.home() / 'Downloads/Cofre do Pedro').resolve()
    if cofre == destination or cofre in destination.parents:
        raise ValueError('Telemetry must stay outside the Cofre')
    destination.mkdir(parents=True, exist_ok=True, mode=0o700)
    target = destination / 'events.jsonl'
    # Reject symlink targets and append one metadata-only record in one write.
    flags = os.O_WRONLY | os.O_CREAT | os.O_APPEND | getattr(os, 'O_NOFOLLOW', 0)
    fd = os.open(str(target), flags, 0o600)
    try:
        os.write(fd, (json.dumps(row, separators=(',', ':')) + '\n').encode())
    finally:
        os.close(fd)
    return row


def main():
    try:
        raw = sys.stdin.buffer.read(1_000_001)
        if len(raw) > 1_000_000:
            raise ValueError('Hook input exceeds the limit')
        event = json.loads(raw)
        if not isinstance(event, dict) or not isinstance(event.get('tool_input', {}), dict):
            raise ValueError('Invalid hook input')
        if event.get('hook_event_name') == 'PreToolUse':
            action, reason = decision(event)
            if action:
                print(json.dumps({'hookSpecificOutput': {'hookEventName': 'PreToolUse',
                      'permissionDecision': action, 'permissionDecisionReason': reason}}))
        else:
            telemetry(event)
    except Exception:
        # Do not echo input, exceptions or tool output: any can contain a secret.
        print('Harness hook could not validate this event.', file=sys.stderr)
        return 2
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
