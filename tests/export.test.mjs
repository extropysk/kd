import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { verifyEndpoints } from '../scripts/verify-public.mjs'

test('GitHub Pages static export exposes discovery files while preserving HTML responses', async () => {
  const types = { '.html': 'text/html', '.txt': 'text/plain', '.md': 'text/plain', '.xml': 'application/xml', '.png': 'image/png' }
  const server = createServer(async (req, res) => {
    try {
      const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers })
      const path = new URL(request.url).pathname
      if (['/about', '/contact', '/privacy'].includes(path)) {
        res.writeHead(301, { Location: `${path}/` })
        res.end()
        return
      }
      // Test only public endpoints; don't expose arbitrary filesystem paths.
      const pages = { '/': 'index.html', '/about/': 'about/index.html', '/contact/': 'contact/index.html', '/privacy/': 'privacy/index.html' }
      const file = pages[path] || (['/llms.txt', '/index.md', '/404.md', '/robots.txt', '/sitemap.xml', '/og.png'].includes(path) ? path.slice(1) : null)
      const extension = file?.slice(file.lastIndexOf('.')) || '.html'
      const response = new Response(request.method === 'HEAD' ? null : await readFile(resolve('out', file || '404.html')), { status: file ? 200 : 404, headers: { 'Content-Type': types[extension] } })
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (error) { res.writeHead(500); res.end(error.message) }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    await verifyEndpoints(`http://127.0.0.1:${server.address().port}`)
    for (const path of ['/', '/about', '/contact', '/privacy', '/llms.txt', '/index.md', '/404.md', '/robots.txt', '/sitemap.xml', '/og.png', '/__agent-readiness-missing-page']) {
      for (const accept of ['text/markdown', 'text/html']) {
        const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method: 'HEAD', headers: { Accept: accept } })
        assert.equal(response.status, path.startsWith('/__') ? 404 : 200, `HEAD ${path}`)
        assert.equal(response.headers.get('vary'), null)
        assert.equal(await response.text(), '')
      }
    }
    await assert.rejects(verifyEndpoints(`http://127.0.0.1:${server.address().port}`, { requireNegotiation: true }), /expected text\/markdown/)
    const md = await readFile('out/index.md', 'utf8')
    const html = await readFile('out/index.html', 'utf8')
    const footer = html.match(/<footer\b[^>]*>(.*?)<\/footer>/s)?.[1]
    assert.ok(footer, 'homepage footer must be present')
    assert.match(footer, /class="footer-bottom"><nav aria-label="Portfolio information">/)
    for (const page of ['about', 'contact', 'privacy']) {
      assert.equal([...footer.matchAll(new RegExp(`href="[^"#]*/${page}/"`, 'g'))].length, 1, `${page} must appear once in the footer`)
    }
    assert.ok(footer.indexOf('>Contact</a>') < footer.indexOf('>GitHub ↗</a>'))
    assert.ok(footer.indexOf('>LinkedIn ↗</a>') < footer.indexOf('© 2026 Kristian Duda'))
    assert.ok(!footer.includes('Poprad, Slovakia'))
    assert.match(html, /rel="alternate" type="text\/markdown" href="[^"]*\/index\.md"/)
    assert.match(html, /rel="describedby" href="[^"]*\/llms\.txt"/)
    for (const title of ['Stream Circle', 'Tweenly', 'UIS', 'Modulario', 'Bratislava', 'Doby Hory', 'CORA GEO Retec', 'Ditec Intranet']) {
      assert.ok(md.includes(title) && html.includes(title), `${title} must appear in both formats`)
    }
    // All local discovery links must resolve to exported files, not only the known fixture URLs.
    const llms = await readFile('out/llms.txt', 'utf8')
    for (const source of [llms, md]) {
      for (const match of source.matchAll(/\]\((https:\/\/kd\.extropy\.sk\/[^)]+)\)/g)) {
        const path = new URL(match[1]).pathname
        assert.equal((await fetch(`http://127.0.0.1:${server.address().port}${path}`)).status, 200, `broken discovery link: ${match[1]}`)
      }
    }
  } finally { await new Promise((resolve) => server.close(resolve)) }
})
