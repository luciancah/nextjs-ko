import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const options = {
  input: 'artifacts/docs-diff-v15c82_to_v16.1.6.tsv',
  output: 'artifacts/ko-update-backlog-v16.1.6.csv',
  koRoot: 'pages/docs',
}

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--input') options.input = args[++i]
  else if (arg === '--output') options.output = args[++i]
  else if (arg === '--ko-root') options.koRoot = args[++i]
}

function normalizeSourceDocPath(docPath) {
  if (!docPath) return ''
  const noPrefix = docPath.replace(/^docs\//, '')
  const noExt = noPrefix.replace(/\.mdx?$/, '')
  const segments = noExt.split('/').map((seg) => seg.replace(/^\d+-/, ''))
  if (segments[segments.length - 1] === 'index') segments.pop()
  return segments.join('/')
}

function findKoPath(normalized) {
  if (!normalized) return ''
  const candidates = [
    path.join(options.koRoot, `${normalized}.mdx`),
    path.join(options.koRoot, normalized, 'index.mdx'),
  ]
  return candidates.find((p) => fs.existsSync(p)) || ''
}

function priorityOf(normalized) {
  const p0Keywords = ['api-reference', 'next-config-js', 'routing', 'caching', 'rendering', 'functions']
  const p1Keywords = ['getting-started', 'architecture', 'upgrading', 'deploying', 'data-fetching']
  if (p0Keywords.some((k) => normalized.includes(k))) return 'P0'
  if (p1Keywords.some((k) => normalized.includes(k))) return 'P1'
  return 'P2'
}

function classify(status, koPath, normalizedOld, normalizedNew) {
  const hasKo = Boolean(koPath)
  if (status === 'A') return hasKo ? 'UPDATE_REQUIRED' : 'NEW_TRANSLATION'
  if (status === 'M') return hasKo ? 'UPDATE_REQUIRED' : 'REVIEW_MANUAL'
  if (status === 'D') return hasKo ? 'REMOVE_OR_REDIRECT' : 'REVIEW_MANUAL'
  if (status === 'R' || status === 'C') {
    if (hasKo) return 'UPDATE_REQUIRED'
    if (!normalizedOld || !normalizedNew) return 'REVIEW_MANUAL'
    return 'REMOVE_OR_REDIRECT'
  }
  return 'REVIEW_MANUAL'
}

function csvEscape(value) {
  const s = String(value ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

const raw = fs.readFileSync(options.input, 'utf8').trim()
const lines = raw.split('\n')
const rows = lines.slice(1).map((line) => {
  const [status, oldPath, newPath, additions, deletions, section] = line.split('\t')
  const normalizedOld = normalizeSourceDocPath(oldPath)
  const normalizedNew = normalizeSourceDocPath(newPath)
  const representative = normalizedNew || normalizedOld
  const koPath = findKoPath(representative)
  const action = classify(status, koPath, normalizedOld, normalizedNew)
  const priority = priorityOf(representative)
  return {
    status,
    oldPath,
    newPath,
    normalizedPath: representative,
    koPath,
    action,
    priority,
    additions,
    deletions,
    section,
  }
})

fs.mkdirSync(path.dirname(options.output), { recursive: true })
const header = [
  'status',
  'old_path',
  'new_path',
  'normalized_path',
  'ko_path',
  'action',
  'priority',
  'additions',
  'deletions',
  'section',
]
const csvRows = rows.map((r) =>
  [
    r.status,
    r.oldPath,
    r.newPath,
    r.normalizedPath,
    r.koPath,
    r.action,
    r.priority,
    r.additions,
    r.deletions,
    r.section,
  ]
    .map(csvEscape)
    .join(',')
)

fs.writeFileSync(options.output, [header.join(','), ...csvRows].join('\n') + '\n')
console.log(`Wrote ${rows.length} rows to ${options.output}`)
