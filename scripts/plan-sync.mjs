#!/usr/bin/env node
/**
 * Decides which upstream branches need a mirror rebuilt, and writes the plan to
 * $GITHUB_OUTPUT (matrix) and $GITHUB_STEP_SUMMARY. Used by sync-upstream.yml.
 *
 * Env: UPSTREAM_REPO, TARGET_REPO, FIXER_SHA (required); GITHUB_TOKEN,
 * BRANCH_INCLUDE, BRANCH_EXCLUDE, MIN_PROTOCOL, MAX_NEW, FORCE (optional).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const env = (name, fallback) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (fallback === undefined) throw new Error(`missing env ${name}`);
    return fallback;
  }
  return value;
};

const UPSTREAM_REPO = env('UPSTREAM_REPO');
const TARGET_REPO = env('TARGET_REPO');
const TOKEN = env('GITHUB_TOKEN', '');
const FIXER_SHA = env('FIXER_SHA');
const include = new RegExp(env('BRANCH_INCLUDE', '.*'));
const exclude = new RegExp(env('BRANCH_EXCLUDE', '^(main|master)$'));
const maxNew = Number(env('MAX_NEW', '10'));
const minProtocol = Number(env('MIN_PROTOCOL', '2168'));
const force = env('FORCE', 'false') === 'true';

function upstreamHeads() {
  const out = execFileSync('git', ['ls-remote', '--heads', UPSTREAM_REPO], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, ref] = line.split('\t');
      return { sha, branch: ref.replace(/^refs\/heads\//, '') };
    });
}

const git = (args) =>
  execFileSync('git', args, {
    cwd: 'vendor/bedrock-protocol-docs',
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });

/**
 * Addressed by sha, not ref name, so branch names containing slashes can't be
 * misread as refspecs. Every schema carries the same x-protocol-version, so the
 * first one identifies the branch.
 */
function inspect(sha) {
  let first;
  try {
    first = git(['ls-tree', '--name-only', sha, 'json/']).split('\n').filter(Boolean)[0];
  } catch {
    return { json: false, protocol: null };
  }
  if (!first) return { json: false, protocol: null };

  try {
    const match = git(['show', `${sha}:${first}`]).match(/"x-protocol-version"\s*:\s*(\d+)/);
    return { json: true, protocol: match ? Number(match[1]) : null };
  } catch {
    return { json: true, protocol: null };
  }
}

async function api(pathname) {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'bpd-fixer-sync',
  };
  if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${TARGET_REPO}${pathname}`, { headers });
  // 404 for a missing endpoint, 422 for a ref this repo doesn't have.
  if (response.status === 404 || response.status === 422) return null;
  if (!response.ok) {
    throw new Error(`GET ${pathname} -> ${response.status} ${await response.text()}`);
  }
  return response.json();
}

/**
 * Our branches as name -> tip sha. Listed in one pass rather than probed per
 * branch, because these names contain slashes and /commits/{ref} can't
 * disambiguate them.
 */
async function ourBranches() {
  const map = new Map();
  for (let page = 1; ; page++) {
    const batch = await api(`/branches?per_page=100&page=${page}`);
    if (!batch?.length) break;
    for (const entry of batch) map.set(entry.name, entry.commit.sha);
    if (batch.length < 100) break;
  }
  return map;
}

const trailer = (message, key) =>
  message?.match(new RegExp(`^${key}:\\s*(\\S+)`, 'm'))?.[1] ?? null;

const heads = upstreamHeads();
const candidates = heads
  .filter(({ branch }) => include.test(branch) && !exclude.test(branch))
  .sort((a, b) => a.branch.localeCompare(b.branch));

const mirrors = await ourBranches();
const build = [];
const skipped = [];

for (const { branch, sha } of candidates) {
  const { json, protocol } = inspect(sha);
  if (!json) {
    skipped.push({ branch, why: 'no json/ directory upstream' });
    continue;
  }
  if (protocol === null) {
    skipped.push({ branch, why: 'could not read x-protocol-version' });
    continue;
  }
  if (protocol < minProtocol) {
    skipped.push({ branch, why: `protocol ${protocol} < ${minProtocol}` });
    continue;
  }

  const mirrorTip = mirrors.get(branch);
  if (mirrorTip === undefined) {
    build.push({ branch, upstream: sha, exists: false, protocol });
    continue;
  }

  const existing = await api(`/commits/${mirrorTip}`);
  const message = existing?.commit?.message ?? '';
  const ourUpstream = trailer(message, 'Upstream-Commit');
  if (ourUpstream === null) {
    skipped.push({ branch, why: 'branch tip was not written by this workflow — not overwriting' });
    continue;
  }

  // Out of date if upstream moved or if our own overrides did.
  const ourFixer = trailer(message, 'Fixer-Commit');
  if (!force && ourUpstream === sha && ourFixer === FIXER_SHA) {
    skipped.push({ branch, why: 'already up to date' });
    continue;
  }

  build.push({ branch, upstream: sha, exists: true, protocol });
}

// Cap new mirrors per run so a first run can't push a pile of branches at once.
// Existing mirrors are always refreshed.
let deferred = [];
if (maxNew > 0) {
  const fresh = build.filter((entry) => !entry.exists);
  if (fresh.length > maxNew) {
    deferred = fresh.slice(maxNew);
    const drop = new Set(deferred.map((entry) => entry.branch));
    for (let i = build.length - 1; i >= 0; i--) {
      if (drop.has(build[i].branch) && !build[i].exists) build.splice(i, 1);
    }
  }
}

const lines = [
  '## Upstream sync plan',
  '',
  `Upstream: \`${UPSTREAM_REPO}\` — ${heads.length} branches, ${candidates.length} matched the name filter, ` +
    `minimum protocol ${minProtocol}.`,
  '',
];

if (build.length) {
  lines.push('### Building', '', '| branch | protocol | upstream sha | mirror |', '| --- | --- | --- | --- |');
  for (const entry of build) {
    lines.push(
      `| \`${entry.branch}\` | ${entry.protocol} | \`${entry.upstream.slice(0, 12)}\` | ` +
        `${entry.exists ? 'update' : 'create'} |`,
    );
  }
  lines.push('');
} else {
  lines.push('Nothing to build.', '');
}

if (deferred.length) {
  lines.push(
    `### Deferred (MAX_NEW=${maxNew})`,
    '',
    `${deferred.length} new mirror(s) held back for a later run: ` +
      deferred.map((entry) => `\`${entry.branch}\``).join(', '),
    '',
  );
}

if (skipped.length) {
  lines.push('### Skipped', '', '| branch | reason |', '| --- | --- |');
  for (const entry of skipped) lines.push(`| \`${entry.branch}\` | ${entry.why} |`);
  lines.push('');
}

const summary = lines.join('\n');
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
}
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `matrix=${JSON.stringify({ include: build })}\n` + `count=${build.length}\n`,
  );
}
