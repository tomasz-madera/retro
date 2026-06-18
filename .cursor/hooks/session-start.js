#!/usr/bin/env node
'use strict';

const { readStdin, hookEnabled, parseHookInput } = require('./lib/stdin');
const {
  getSessionsDir,
  ensureDir,
  listSessionFiles,
  selectMatchingSession,
} = require('./lib/sessions');

const DEFAULT_MAX_CHARS = 6000;

function isContextDisabled() {
  const raw = String(process.env.ECC_SESSION_START_CONTEXT || '').trim().toLowerCase();
  return ['0', 'false', 'off', 'none', 'disabled'].includes(raw);
}

function getMaxChars() {
  const raw = process.env.ECC_SESSION_START_MAX_CHARS;
  if (!raw) return DEFAULT_MAX_CHARS;
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : DEFAULT_MAX_CHARS;
}

function limitContext(content, maxChars) {
  if (content.length <= maxChars) return content;
  const marker = '\n\n[Session context truncated. Set ECC_SESSION_START_MAX_CHARS to raise the cap.]';
  return `${content.slice(0, Math.max(0, maxChars - marker.length)).trimEnd()}${marker}`;
}

readStdin()
  .then((raw) => {
    if (!hookEnabled('session:start', ['minimal', 'standard', 'strict'])) {
      process.stdout.write(raw || '{}');
      return;
    }

    if (isContextDisabled() || getMaxChars() === 0) {
      process.stdout.write(raw || '{}');
      return;
    }

    const sessionsDir = getSessionsDir();
    ensureDir(sessionsDir);

    const match = selectMatchingSession(listSessionFiles(sessionsDir));
    let additionalContext = '';

    if (match?.content && !match.content.includes('[Session context — update during work]')) {
      const bodyStart = match.content.indexOf('\n---\n');
      const body = bodyStart >= 0 ? match.content.slice(bodyStart + 5).trim() : match.content.trim();
      if (body) {
        additionalContext = limitContext(
          [
            'HISTORICAL REFERENCE ONLY — summary from a prior session.',
            'Verify against the current repo before acting on stale tasks.',
            '',
            body,
          ].join('\n'),
          getMaxChars()
        );
      }
    }

    const payload = JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    });

    process.stdout.write(payload);
  })
  .catch(() => process.exit(0));
