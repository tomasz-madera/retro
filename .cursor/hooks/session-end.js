#!/usr/bin/env node
'use strict';

const { readStdin, hookEnabled } = require('./lib/stdin');
const { touchSessionFile } = require('./lib/sessions');

readStdin()
  .then((raw) => {
    if (hookEnabled('session:end', ['minimal', 'standard', 'strict'])) {
      try {
        const sessionFile = touchSessionFile();
        process.stderr.write(`[cursor] Session state saved: ${sessionFile}\n`);
      } catch (error) {
        process.stderr.write(`[cursor] Session save skipped: ${error.message}\n`);
      }
    }

    process.stdout.write(raw || '{}');
  })
  .catch(() => process.exit(0));
