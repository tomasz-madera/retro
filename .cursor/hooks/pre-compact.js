#!/usr/bin/env node
'use strict';

const path = require('path');
const { readStdin, hookEnabled } = require('./lib/stdin');
const {
  getSessionsDir,
  ensureDir,
  appendFile,
  getDateString,
  getTimeString,
  listSessionFiles,
  selectMatchingSession,
  readFile,
  writeFile,
} = require('./lib/sessions');

readStdin()
  .then((raw) => {
    if (!hookEnabled('pre:compact', ['minimal', 'standard', 'strict'])) {
      process.stdout.write(raw || '{}');
      return;
    }

    const sessionsDir = getSessionsDir();
    ensureDir(sessionsDir);

    const timestamp = `${getDateString()} ${getTimeString()}`;
    appendFile(path.join(sessionsDir, 'compaction-log.txt'), `[${timestamp}] Context compaction triggered\n`);

    const match = selectMatchingSession(listSessionFiles(sessionsDir));
    if (match) {
      const marker = `\n---\n**[Compaction at ${getTimeString()}]** — context was summarized\n`;
      writeFile(match.session.path, `${readFile(match.session.path) || ''}${marker}`);
      process.stderr.write(`[cursor] Marked compaction in ${match.session.path}\n`);
    }

    process.stdout.write(raw || '{}');
  })
  .catch(() => process.exit(0));
