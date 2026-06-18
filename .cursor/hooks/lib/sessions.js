'use strict';

const fs = require('fs');
const path = require('path');

const SESSION_SEPARATOR = '\n---\n';

function getSessionsDir() {
  return path.join(process.cwd(), '.cursor', 'sessions');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function appendFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, content, 'utf8');
}

function getDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getTimeString() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function getProjectName() {
  return path.basename(process.cwd());
}

function listSessionFiles(sessionsDir) {
  if (!fs.existsSync(sessionsDir)) return [];

  return fs
    .readdirSync(sessionsDir)
    .filter((name) => name.endsWith('-session.tmp'))
    .map((name) => {
      const fullPath = path.join(sessionsDir, name);
      const stats = fs.statSync(fullPath);
      return { path: fullPath, name, mtime: stats.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

function selectMatchingSession(sessions, cwd = process.cwd()) {
  for (const session of sessions) {
    const content = readFile(session.path);
    if (!content) continue;

    const worktreeMatch = content.match(/\*\*Worktree:\*\*\s*(.+)$/m);
    const sessionWorktree = worktreeMatch ? worktreeMatch[1].trim() : '';

    if (sessionWorktree && sessionWorktree === cwd) {
      return { session, content };
    }

    if (!sessionWorktree) {
      const projectMatch = content.match(/\*\*Project:\*\*\s*(.+)$/m);
      const sessionProject = projectMatch ? projectMatch[1].trim() : '';
      if (sessionProject && sessionProject === getProjectName()) {
        return { session, content };
      }
    }
  }

  return null;
}

function buildSessionHeader(today, currentTime, metadata, existingContent = '') {
  const headingMatch = existingContent.match(/^#\s+.+$/m);
  const heading = headingMatch ? headingMatch[0] : `# Session: ${today}`;

  return [
    heading,
    `**Date:** ${today}`,
    `**Last Updated:** ${currentTime}`,
    `**Project:** ${metadata.project}`,
    `**Worktree:** ${metadata.worktree}`,
    '',
  ].join('\n');
}

function touchSessionFile() {
  const sessionsDir = getSessionsDir();
  const today = getDateString();
  const currentTime = getTimeString();
  const metadata = { project: getProjectName(), worktree: process.cwd() };
  const sessions = listSessionFiles(sessionsDir);
  const existing = selectMatchingSession(sessions, metadata.worktree);
  const sessionFile = existing
    ? existing.session.path
    : path.join(sessionsDir, `${today}-session.tmp`);

  const body = existing
    ? existing.content.slice(existing.content.indexOf(SESSION_SEPARATOR) + SESSION_SEPARATOR.length)
    : '## Current State\n\n[Session context — update during work]\n\n### Notes for Next Session\n-\n';

  const header = buildSessionHeader(today, currentTime, metadata, existing?.content || '');
  writeFile(sessionFile, `${header}${SESSION_SEPARATOR}${body}`);
  return sessionFile;
}

module.exports = {
  SESSION_SEPARATOR,
  getSessionsDir,
  ensureDir,
  readFile,
  writeFile,
  appendFile,
  getDateString,
  getTimeString,
  getProjectName,
  listSessionFiles,
  selectMatchingSession,
  buildSessionHeader,
  touchSessionFile,
};
