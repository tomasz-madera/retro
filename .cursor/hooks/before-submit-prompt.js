#!/usr/bin/env node
'use strict';

const { readStdin, parseHookInput } = require('./lib/stdin');

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /ghp_[a-zA-Z0-9]{36,}/,
  /AKIA[A-Z0-9]{16}/,
  /xox[bpsa]-[a-zA-Z0-9-]+/,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
];

readStdin()
  .then((raw) => {
    try {
      const input = parseHookInput(raw);
      const prompt = input.prompt || input.content || input.message || '';
      if (SECRET_PATTERNS.some((pattern) => pattern.test(prompt))) {
        process.stderr.write('[cursor] WARNING: Potential secret detected in prompt.\n');
      }
    } catch {
      // noop
    }
    process.stdout.write(raw);
  })
  .catch(() => process.exit(0));
