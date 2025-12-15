import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import pkg from 'react-helmet-async'
const { HelmetProvider } = pkg

try {
  // Load Vite manifest (hashed assets)
  const manifest = JSON.parse(fs.readFileSync('./dist/.vite/manifest.json', 'utf-8'))

  // Find correct JS entry file
  const entry = manifest['index.html']?.file || Object.values(manifest)[0].file
  const scriptPath = `/${entry}`

  function escapeHTML(str) {
    if (!str) return ''
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }

  // Load original index.html to preserve all meta tags
  const template = fs.readFileSync('./dist/index.html', 'utf-8')
  const routes = JSON.parse(fs.readFileSync('./snap-routes.json', 'utf-8'))
  const schools = JSON.parse(fs.readFileSync('./school-list.json', 'utf-8'))

  const combined = {}
  schools.forEach(school => {
    const matchedPath = routes.find(r => r.endsWith(school.KODSEKOLAH))
    if (matchedPath) {
      combined[matchedPath] = {
        title: school.NAMASEKOLAH,
        description: `Selamat Datang ke ${school.NAMASEKOLAH}`,
        canonical: matchedPath,
      }
    }
  })

  const metaMap = {
    '/': { title: 'Sekolahku - Home', description: 'Selamat Datang ke Sekolahku', canonical: '/' },
    '/home': { title: 'Sekolahku - Home', description: 'Selamat Datang ke Sekolahku', canonical: '/home' },
    '/about': { title: 'About Sekolahku', description: 'Mengenai Sekolahku', canonical: '/about' },
    ...combined,
  }

  routes.forEach(route => {
    const meta = metaMap[route] || {}

    const helmetContext = {}
    const appHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(HelmetProvider, { context: helmetContext }))

    let html = template

    // Replace title
    html = html.replace(/<title[^>]*>.*<\/title>/, `<title data-rh="true">${escapeHTML(meta.title || 'Sekolahku')}</title>`)

    // Replace meta description
    if (meta.description) {
      html = html.replace(
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeHTML(meta.description || '')}">`,
      )
    }

    // Replace canonical
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHTML(meta.canonical || route)}">`)
    } else {
      // Inject before </head>
      html = html.replace('</head>', `  <link rel="canonical" href="${escapeHTML(meta.canonical || route)}">\n</head>`)
    }

    // Inject prerendered HTML
    html = html.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`)

    // Replace hashed JS
    html = html.replace(/<script type="module"[^>]*><\/script>/, `<script type="module" src="${scriptPath}"></script>`)

    // Output path
    const out = path.join('./dist', route === '/' ? 'index.html' : `${route.slice(1)}/index.html`)

    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, html)
  })

  console.log(`✔ Full prerender completed with total of `, routes.length, `routes`)
} catch (error) {
  const err = JSON.stringify(error)
  if (!err.includes('ENOENT')) {
    console.warn('Error during prerendering:', error)
  }
}
