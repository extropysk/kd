import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { validateMarkdownError, validateOrganization, variesOnAccept, verifyEndpoints } from '../scripts/verify-public.mjs'

test('exported Organization includes the confirmed public address and inquiry contact', async () => {
  for (const file of ['index.html', 'about/index.html', 'contact/index.html', 'privacy/index.html', '404.html']) {
    const html = await readFile(resolve('out', file), 'utf8')
    const match = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)
    assert.ok(match, `${file} must expose JSON-LD in the initial HTML`)
    const organization = JSON.parse(match[1]).worksFor
    validateOrganization(organization)
    assert.deepEqual(organization.address, { '@type': 'PostalAddress', addressLocality: 'Poprad', addressCountry: 'SK' })
    for (const field of ['address', 'contactPoint']) {
      const incomplete = { ...organization }
      delete incomplete[field]
      assert.throws(() => validateOrganization(incomplete), `${field} is required`)
    }
    assert.throws(() => validateOrganization({ ...organization, address: { '@type': 'Place', addressLocality: 'Poprad', addressCountry: 'SK' } }))
    assert.throws(() => validateOrganization({ ...organization, contactPoint: { '@type': 'ContactPoint', email: 'kristian.duda@extropy.sk', contactType: '' } }))
  }
})

test('Vary must contain the exact Accept token, including combined and case-insensitive headers', () => {
  for (const vary of ['Accept', 'accept-encoding, Accept', 'ACCEPT, Accept-Encoding']) {
    assert.equal(variesOnAccept(new Headers({ Vary: vary })), true)
  }
  for (const vary of ['', 'accept-encoding', 'X-Accept', 'Accept-Language', '*']) {
    assert.equal(variesOnAccept(new Headers({ Vary: vary })), false)
  }
  assert.equal(variesOnAccept(new Headers()), false)
})

test('Markdown 404 audit requires a real Markdown body, media type, discovery link and cache variation', async () => {
  const body = await readFile('public/404.md', 'utf8')
  const headers = new Headers({ 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept-Encoding, Accept' })
  validateMarkdownError(body, headers)
  assert.throws(() => validateMarkdownError(body, new Headers({ 'Content-Type': 'text/html', Vary: 'Accept' })))
  assert.throws(() => validateMarkdownError(body, new Headers({ 'Content-Type': 'text/markdown', Vary: 'X-Accept' })))
  assert.throws(() => validateMarkdownError('# 404', headers))
  assert.throws(() => validateMarkdownError('# 404 — This page does not exist.', headers))
  assert.throws(() => validateMarkdownError(`${body}\n<html>Not found</html>`, headers))
})

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
    for (const title of ['Stream Circle', 'Tweenly', 'UIS', 'AMCEF Modulario', 'Bratislava', 'Jdi do hor', 'CORA GEO Retec', 'Ditec Intranet', 'AFS Retail Execution']) {
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
