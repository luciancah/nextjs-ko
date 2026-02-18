import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'

const args = process.argv.slice(2)
const options = {
  repo: '../next.js',
  base: 'v15.0.0-canary.82',
  target: 'v16.1.6',
  output: 'artifacts/docs-diff-v15c82_to_v16.1.6.tsv',
}

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--repo') options.repo = args[++i]
  else if (arg === '--base') options.base = args[++i]
  else if (arg === '--target') options.target = args[++i]
  else if (arg === '--output') options.output = args[++i]
}

function runGit(gitArgs) {
  const res = spawnSync('git', ['-C', options.repo, ...gitArgs], {
    encoding: 'utf8',
  })
  if (res.status !== 0) {
    throw new Error((res.stderr || res.stdout || 'git command failed').trim())
  }
  return res.stdout.trim()
}

function parseNameStatusLine(line) {
  const parts = line.split('\t')
  const rawStatus = parts[0]
  const status = rawStatus.startsWith('R') ? 'R' : rawStatus.startsWith('C') ? 'C' : rawStatus
  if (status === 'R' || status === 'C') {
    return { status, oldPath: parts[1] || '', newPath: parts[2] || '' }
  }
  return { status, oldPath: '', newPath: parts[1] || '' }
}

function getStats(entry) {
  const pathArgs = []
  if (entry.status === 'R' || entry.status === 'C') {
    if (entry.oldPath) pathArgs.push(entry.oldPath)
    if (entry.newPath) pathArgs.push(entry.newPath)
  } else if (entry.status === 'D') {
    if (entry.newPath) pathArgs.push(entry.newPath)
  } else {
    if (entry.newPath) pathArgs.push(entry.newPath)
  }

  if (pathArgs.length === 0) return { additions: 0, deletions: 0 }

  const out = runGit(['diff', '--numstat', '--find-renames', options.base, options.target, '--', ...pathArgs])
  const first = out.split('\n').find(Boolean)
  if (!first) return { additions: 0, deletions: 0 }
  const [addRaw, delRaw] = first.split('\t')
  const additions = /^\d+$/.test(addRaw) ? Number(addRaw) : 0
  const deletions = /^\d+$/.test(delRaw) ? Number(delRaw) : 0
  return { additions, deletions }
}

function normalizeForSection(docPath) {
  if (!docPath) return ''
  const cleaned = docPath.replace(/^docs\//, '')
  const segs = cleaned.split('/').map((s) => s.replace(/^\d+-/, '').replace(/\.mdx?$/, ''))
  return segs.slice(0, 2).join('/')
}

fs.mkdirSync(path.dirname(options.output), { recursive: true })

const raw = runGit(['diff', '--name-status', '--find-renames', options.base, options.target, '--', 'docs'])
const lines = raw.split('\n').filter(Boolean)
const rows = []

for (const line of lines) {
  const entry = parseNameStatusLine(line)
  const stats = getStats(entry)
  const representativePath = entry.newPath || entry.oldPath
  rows.push({
    status: entry.status,
    oldPath: entry.oldPath,
    newPath: entry.newPath,
    additions: stats.additions,
    deletions: stats.deletions,
    section: normalizeForSection(representativePath),
  })
}

const header = ['status', 'old_path', 'new_path', 'additions', 'deletions', 'section']
const body = rows.map((r) =>
  [r.status, r.oldPath, r.newPath, String(r.additions), String(r.deletions), r.section].join('\t')
)
fs.writeFileSync(options.output, [header.join('\t'), ...body].join('\n') + '\n')

console.log(`Wrote ${rows.length} rows to ${options.output}`)
