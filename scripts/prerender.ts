import fs from 'fs'
import path from 'path'

const BUILD_DIR = path.resolve('./dist')
const routes: string[] = JSON.parse(fs.readFileSync('./snap-routes.json', 'utf-8'))

// Read the built index.html once
const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8')

routes.forEach((route: string) => {
  const outputPath = path.join(
    BUILD_DIR,
    route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, indexHtml)

  console.log(`✔ Prerendered ${route}`)
})
