#!/usr/bin/env node
'use strict';

const { readStdin, parseHookInput } = require('./lib/stdin');

readStdin()
  .then((raw) => {
    try {
      const input = parseHookInput(raw);
      const filePath = input.path || input.file || '';
      if (/\.(env|key|pem)$|\.env\.|credentials|secret/i.test(filePath)) {
        process.stderr.write(`[cursor] BLOCKED: Tab cannot read sensitive file: ${filePath}\n`);
        process.exit(2);
      }
    } catch {
      // noop
    }
    process.stdout.write(raw);
  })
  .catch(() => process.exit(0));
