import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const options = {
  input: 'artifacts/ko-update-backlog-v16.1.6.csv',
  outputCsv: 'artifacts/ko-batch-01-p0-update.csv',
  outputMd: 'artifacts/ko-batch-01-p0-update.md',
  action: 'UPDATE_REQUIRED',
  priority: 'P0',
  limit: 15,
}

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--input') options.input = args[++i]
  else if (arg === '--output-csv') options.outputCsv = args[++i]
  else if (arg === '--output-md') options.outputMd = args[++i]
  else if (arg === '--action') options.action = args[++i]
  else if (arg === '--priority') options.priority = args[++i]
  else if (arg === '--limit') options.limit = Number(args[++i])
}

const raw = fs.readFileSync(options.input, 'utf8').trim()
const lines = raw.split('\n')
const header = lines[0]
const rows = lines.slice(1).map((line) => {
  const parts = line.split(',')
  return {
    line,
    status: parts[0],
    oldPath: parts[1],
    newPath: parts[2],
    normalized: parts[3],
    koPath: parts[4],
    action: parts[5],
    priority: parts[6],
    additions: Number(parts[7] || '0'),
    deletions: Number(parts[8] || '0'),
  }
})

const filtered = rows
  .filter((r) => r.action === options.action && r.priority === options.priority)
  .sort((a, b) => b.additions - a.additions)
  .slice(0, options.limit)

fs.mkdirSync(path.dirname(options.outputCsv), { recursive: true })
fs.writeFileSync(options.outputCsv, [header, ...filtered.map((r) => r.line)].join('\n') + '\n')

const checklist = filtered.map(
  (r) => `- [ ] \`${r.koPath}\` <- \`${r.newPath}\` (add:${r.additions} del:${r.deletions})`
)
const md = [
  `# KO Batch (${options.priority} + ${options.action})`,
  '',
  `- Source backlog: \`${options.input}\``,
  `- Rule: \`docs/translation-rules.md\``,
  `- Glossary: \`docs/translation-glossary.csv\``,
  '',
  '## Checklist',
  ...checklist,
  '',
].join('\n')

fs.writeFileSync(options.outputMd, md)
console.log(`Wrote ${filtered.length} items`)
console.log(`- ${options.outputCsv}`)
console.log(`- ${options.outputMd}`)
