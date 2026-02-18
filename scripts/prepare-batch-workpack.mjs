import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'

const args = process.argv.slice(2)
const options = {
  input: 'artifacts/ko-batch-01-p0-update.csv',
  outputDir: 'artifacts/workpacks/batch-01',
  repo: '../next.js',
  target: 'v16.1.6',
  limit: 5,
}

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--input') options.input = args[++i]
  else if (arg === '--output-dir') options.outputDir = args[++i]
  else if (arg === '--repo') options.repo = args[++i]
  else if (arg === '--target') options.target = args[++i]
  else if (arg === '--limit') options.limit = Number(args[++i])
}

function readFileAtTag(tag, filePath) {
  const res = spawnSync('git', ['-C', options.repo, 'show', `${tag}:${filePath}`], {
    encoding: 'utf8',
  })
  if (res.status !== 0) return ''
  return res.stdout
}

function headingsOf(content) {
  return content
    .split('\n')
    .filter((line) => /^#{2,6}\s+/.test(line))
    .map((line) => line.replace(/^#+\s+/, '').trim())
}

function unique(arr) {
  return [...new Set(arr)]
}

const raw = fs.readFileSync(options.input, 'utf8').trim().split('\n')
const header = raw[0].split(',')
const rows = raw.slice(1).map((line) => {
  const cols = line.split(',')
  const obj = {}
  header.forEach((h, idx) => {
    obj[h] = cols[idx] || ''
  })
  return obj
})

const selected = rows.slice(0, options.limit)
const selectedCsvPath = path.join(options.outputDir, 'selected.csv')
fs.mkdirSync(options.outputDir, { recursive: true })
fs.writeFileSync(selectedCsvPath, [raw[0], ...selected.map((r) => raw[rows.indexOf(r) + 1])].join('\n') + '\n')

const lines = [
  '# Translation Workpack',
  '',
  `- Source batch: \`${options.input}\``,
  `- Target tag: \`${options.target}\``,
  `- Selected count: ${selected.length}`,
  '',
  '## Files',
]

for (let i = 0; i < selected.length; i += 1) {
  const row = selected[i]
  const koPath = row.ko_path
  const enPath = row.new_path
  const slug = row.normalized_path.replace(/\//g, '__')
  const enContent = readFileAtTag(options.target, enPath)
  const koContent = fs.existsSync(koPath) ? fs.readFileSync(koPath, 'utf8') : ''

  const enOut = path.join(options.outputDir, `${i + 1}-${slug}.en.mdx`)
  const koOut = path.join(options.outputDir, `${i + 1}-${slug}.ko.current.mdx`)
  fs.writeFileSync(enOut, enContent)
  fs.writeFileSync(koOut, koContent)

  const enHeadings = unique(headingsOf(enContent))
  const koHeadings = unique(headingsOf(koContent))
  const missingInKo = enHeadings.filter((h) => !koHeadings.includes(h))
  const missingOut = path.join(options.outputDir, `${i + 1}-${slug}.missing-headings.txt`)
  fs.writeFileSync(missingOut, missingInKo.join('\n') + (missingInKo.length ? '\n' : ''))

  lines.push(
    `- [ ] \`${koPath}\` <- \`${enPath}\``,
    `  - en: \`${path.relative('.', enOut)}\``,
    `  - ko(current): \`${path.relative('.', koOut)}\``,
    `  - missing headings count: ${missingInKo.length} (\`${path.relative('.', missingOut)}\`)`
  )
}

lines.push('', '## Rule References', '- `docs/translation-rules.md`', '- `docs/translation-glossary.csv`', '')
fs.writeFileSync(path.join(options.outputDir, 'README.md'), lines.join('\n'))

console.log(`Prepared workpack in ${options.outputDir}`)
