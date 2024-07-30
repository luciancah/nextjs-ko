import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://nextjs-ko.org'

async function generateSitemap() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Skipping sitemap generation in non-production environment.')
    return
  }

  const pages = await globby(['pages/**/*.mdx', 'pages/**/*.md'])

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const content = fs.readFileSync(page, 'utf8')
          const { data } = matter(content)

          const url = page
            .replace('pages', '')
            .replace(/\.mdx?$/, '')
            .replace(/\/index$/, '')

          const lastmod = data.date
            ? new Date(data.date).toISOString()
            : new Date().toISOString()

          return `
            <url>
              <loc>${SITE_URL}${url}</loc>
              <lastmod>${lastmod}</lastmod>
            </url>
          `
        })
        .join('')}
    </urlset>`

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap)

  console.log('Sitemap generated successfully!')
}

generateSitemap()
