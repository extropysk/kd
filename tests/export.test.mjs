import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { verifyEndpoints } from '../scripts/verify-public.mjs'

test('GitHub Pages static export exposes discovery files while preserving HTML responses', async () => {
  const types = { '.html': 'text/html', '.txt': 'text/plain', '.md': 'text/plain', '.xml': 'application/xml' }
  const server = createServer(async (req, res) => {
    try {
      const request = new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers })
      const path = new URL(request.url).pathname
      // Test only public endpoints; don't expose arbitrary filesystem paths.
      const file = ['/', '/llms.txt', '/index.md', '/robots.txt', '/sitemap.xml'].includes(path) ? (path === '/' ? 'index.html' : path.slice(1)) : null
      const extension = file?.slice(file.lastIndexOf('.')) || '.html'
      const response = new Response(request.method === 'HEAD' ? null : await readFile(resolve('out', file || '404.html')), { status: file ? 200 : 404, headers: { 'Content-Type': types[extension] } })
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (error) { res.writeHead(500); res.end(error.message) }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    await verifyEndpoints(`http://127.0.0.1:${server.address().port}`)
    for (const accept of ['text/markdown', 'text/html']) {
      const response = await fetch(`http://127.0.0.1:${server.address().port}/`, { method: 'HEAD', headers: { Accept: accept } })
      assert.equal(response.status, 200)
      assert.equal(response.headers.get('content-type'), 'text/html')
      assert.equal(response.headers.get('vary'), null)
      assert.equal(await response.text(), '')
    }
    await assert.rejects(verifyEndpoints(`http://127.0.0.1:${server.address().port}`, { requireNegotiation: true }), /expected text\/markdown/)
    const md = await readFile('out/index.md', 'utf8')
    const html = await readFile('out/index.html', 'utf8')
    assert.match(html, /rel="alternate" type="text\/markdown" href="[^"]*\/index\.md"/)
    assert.match(html, /rel="describedby" href="[^"]*\/llms\.txt"/)
    for (const title of ['Stream Circle', 'Tweenly', 'UIS', 'Modulario', 'Bratislava', 'Doby Hory', 'CORA GEO Retec', 'Ditec Intranet']) {
      assert.ok(md.includes(title) && html.includes(title), `${title} must appear in both formats`)
    }
  } finally { await new Promise((resolve) => server.close(resolve)) }
})
