'use strict';

const { readStdin, hookEnabled, parseHookInput } = require('./lib/stdin');
const { run } = require('./lib/block-no-verify');

readStdin()
  .then((raw) => {
    if (!hookEnabled('pre:bash:block-no-verify', ['minimal', 'standard', 'strict'])) {
      process.stdout.write(raw);
      return;
    }

    const parsed = parseHookInput(raw);
    const command = String(parsed.command || parsed.args?.command || '');
    const result = run(JSON.stringify({ tool_input: { command } }));

    if (result && result.exitCode === 2) {
      if (result.stderr) {
        process.stderr.write(String(result.stderr) + '\n');
      }
      process.exit(2);
    }

    process.stdout.write(raw);
  })
  .catch(() => process.exit(0));
