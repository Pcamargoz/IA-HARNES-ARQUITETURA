#!/usr/bin/env python3
"""Append only reported runtime metadata; this utility never executes an agent."""
import datetime
import hashlib
import json
import math
import os
from pathlib import Path
import re
import sys

OUTPUT = Path.home() / 'Downloads/Agent-Knowledge-MCP/runtime-output/harness-telemetry/runtime.jsonl'
HARNESS = Path(__file__).resolve().parents[1]


def sanitize(result):
    if result.get('schema') != 'akm.runtime.v1':
        raise ValueError('Invalid runtime schema')
    status = result.get('status')
    if status not in {'done', 'failed', 'timeout', 'cancelled', 'not_executed'}:
        raise ValueError('Invalid runtime status')
    adapter = result.get('adapter', '')
    if not re.fullmatch(r'[a-z0-9-]{1,80}', adapter):
        raise ValueError('Invalid adapter id')
    metrics = result.get('metrics', {})
    selected = {}
    for field in ['latency_ms', 'exit_code', 'tokens_in', 'tokens_out', 'tokens_cached',
                  'cost_usd', 'stdout_bytes', 'stderr_bytes', 'context_chars_sent']:
        value = metrics.get(field)
        if value is not None:
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
                raise ValueError('Invalid numeric metric')
            if field != 'exit_code' and value < 0:
                raise ValueError('Negative metric')
            selected[field] = value
    for field in ['tokens_source', 'cost_source']:
        value = metrics.get(field, 'unavailable')
        if value not in {'reported', 'estimated', 'unavailable'}:
            raise ValueError('Invalid metric provenance')
        selected[field] = value
    for field in ['started_at', 'ended_at']:
        value = metrics.get(field)
        if value is not None:
            datetime.datetime.fromisoformat(value.replace('Z', '+00:00'))
            selected[field] = value
    return {'schema': 'akm.runtime.v1', 'task_id': hashlib.sha256(str(result.get('task_id', '')).encode()).hexdigest()[:20],
            'adapter': adapter, 'status': status, 'metrics': selected}


def record(result, output=OUTPUT):
    row = sanitize(result)
    output = Path(output)
    if output.is_symlink():
        raise ValueError('Symlink telemetry file')
    resolved = output.resolve()
    cofre = (Path.home() / 'Downloads/Cofre do Pedro').resolve()
    for vault in [HARNESS, cofre]:
        if resolved == vault or vault in resolved.parents:
            raise ValueError('Runtime telemetry must stay outside both vaults')
    # Resolve and validate the parent too: O_NOFOLLOW alone guards only the leaf.
    destination = resolved.parent
    destination.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd = os.open(str(destination / output.name), os.O_WRONLY | os.O_CREAT | os.O_APPEND | getattr(os, 'O_NOFOLLOW', 0), 0o600)
    try:
        os.write(fd, (json.dumps(row, separators=(',', ':')) + '\n').encode())
    finally:
        os.close(fd)
    return row


def main():
    try:
        raw = sys.stdin.buffer.read(1_000_001)
        if len(raw) > 1_000_000:
            raise ValueError('Input too large')
        row = record(json.loads(raw))
        print(json.dumps({'recorded': True, 'status': row['status'], 'output': str(OUTPUT)}))
        return 0
    except Exception:
        print('Runtime metadata rejected; no input content echoed.', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
