import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import pkg from 'react-helmet-async'

const { HelmetProvider } = pkg
const routesPath = path.join(process.cwd(), 'snap-routes.json')
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'))

const schoolPath = path.join(process.cwd(), 'school-list.json')
const schools = JSON.parse(fs.readFileSync(schoolPath, 'utf-8'))

// Combine into an object with paths as keys
const combined = {};
// Combine using KODSEKOLAH match
schools.forEach((school) => {
  const matchedPath = routes.find(path => path.endsWith(school.KODSEKOLAH));
  if (matchedPath) {
    combined[matchedPath] = {
      code: school.KODSEKOLAH || null,
      title: `${school.NAMASEKOLAH}` || 'Sekolahku',
      description: `Selamat Datang ke ${school.NAMASEKOLAH}` || 'Selamat Datang ke Sekolahku',
      canonical: matchedPath || '/'
    };
  }
})

// Output folder
const BUILD_DIR = path.resolve('./dist')

// Map of route -> meta
const metaMap = {
  '/home': { title: 'Sekolahku - Home', description: 'Selamat Datang ke Sekolahku', canonical: '/home' },
  '/about': { title: 'About Sekolahku', description: 'Mengenai Sekolahku', canonical: '/about' },
  // add more routes as needed
  ...combined
}

// Make sure output folder exists
if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true })

routes.forEach(route => {
  const meta = metaMap[route] || { canonical: route }
  const helmetContext = {}

  // Render React app + HelmetMeta to static markup
  const appHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(
      HelmetProvider,
      { context: helmetContext },
    )
  )

  const helmet = helmetContext.helmet || {}

  const fullHtml = `<!DOCTYPE html>
  <html lang='en'>
  <head>
    ${meta.title ? `<title data-rh="true">${meta.title}</title>` : helmet.title?.toString()}
    ${meta.description ? `<meta name='description' content='${meta.description}'>` : helmet.meta?.toString()}
    ${meta.canonical ? `<link rel='canonical' href='${meta.canonical}'>` : helmet.link?.toString()}
    <link rel="icon" type="image/svg+xml" href="/JataNegara.svg" />
  </head>
  <body>
    <div id='root'>${appHtml}</div>
    <script type='module' src='/assets/index.js'></script>
  </body>
  </html>`

  // Save prerendered HTML
  const outputPath = path.join(
    BUILD_DIR,
    route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, fullHtml)

  // console.log(`✔ Prerendered ${route}`)
})
console.log(`✔ Prerendered`, routes.length, `routes`)
