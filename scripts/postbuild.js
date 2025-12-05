import { run } from 'react-snap'
import fs from 'fs'

const routes = JSON.parse(fs.readFileSync('snap-routes.json', 'utf-8'))

const options = {
  include: routes,
  inlineCss: true,
  puppeteerArgs: ['--no-sandbox'],
  source: 'dist',
}

run(options).catch(console.error)
