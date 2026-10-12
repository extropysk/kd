import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

export function validateOrganization(organization) {
  assert.equal(organization['@type'], 'Organization')
  assert.equal(organization.name, 'Extropy')
  assert.equal(organization.url, 'https://extropy.sk/')
  assert.equal(organization.contactPoint['@type'], 'ContactPoint')
  assert.equal(organization.contactPoint.email, 'kristian.duda@extropy.sk')
  assert.ok(organization.contactPoint.contactType.length > 10)
  assert.equal(organization.address?.['@type'], 'PostalAddress', 'Organization requires a PostalAddress')
  assert.equal(organization.address.addressLocality, 'Poprad')
  assert.equal(organization.address.addressCountry, 'SK')
}

export function variesOnAccept(headers) {
  return headers.get('vary')?.split(',').some((value) => value.trim().toLowerCase() === 'accept') || false
}

export function validateMarkdownError(body, headers) {
  assert.match(headers.get('content-type') || '', /^text\/markdown(?:\s*;|$)/i)
  assert.ok(variesOnAccept(headers), '404 must vary on Accept')
  assert.ok(body.trim().length >= 20, 'Markdown error explanation must have at least 20 characters')
  assert.match(body, /^# 404/)
  assert.ok(!/<(?:html|script|body)\b/i.test(body), 'Markdown error must not contain the HTML document')
  assert.match(body, /\[[^\]]+\]\(https:\/\/kd\.extropy\.sk\/(llms\.txt|sitemap\.xml)\)/)
}

export function visibleArticleText(body) {
  const article = body.match(/<article\b[^>]*>(.*?)<\/article>/s)
  assert.ok(article, 'trust page must have a visible article')
  return article[1].replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function verifyEndpoints(base, { requireNegotiation = false } = {}) {
  const failures = []
  const checks = [
    ['/', 'text/html', (body) => {
      assert.match(body, /<title>Kristian Duda.*Software Architect/)
      assert.match(body, /<h1[^>]*>.*Kristian Duda.*Software Architect/s)
      assert.match(body, /class="hero-intro">I’m Kristian Duda — a software architect/)
      assert.match(body, /name="description" content="Kristian Duda is a software architect/)
      assert.match(body, /property="og:title" content="Kristian Duda/)
      assert.match(body, /property="og:url" content="https:\/\/kd\.extropy\.sk\/"/)
      assert.match(body, /rel="canonical"[^>]*href="https:\/\/kd\.extropy\.sk\/"/)
      assert.match(body, /<html[^>]*lang="en"/)
      assert.match(body, /property="og:type" content="website"/)
      assert.match(body, /property="og:image" content="https:\/\/kd\.extropy\.sk\/og\.png"/)
      assert.match(body, /property="og:image:width" content="1200"/)
      assert.match(body, /property="og:image:height" content="630"/)
      for (const page of ['about', 'contact', 'privacy']) assert.match(body, new RegExp(`href="[^"#]*/${page}/"`))
      assert.match(body, /rel="describedby"/)
      assert.match(body, /type="text\/markdown"/)
      const match = body.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)
      assert.ok(match, 'Person JSON-LD must be present in initial HTML')
      const person = JSON.parse(match[1])
      assert.equal(person['@context'], 'https://schema.org')
      assert.equal(person['@type'], 'Person')
      assert.equal(person.name, 'Kristian Duda')
      assert.equal(person.url, 'https://kd.extropy.sk/')
      assert.ok(person.description.length > 20)
      assert.equal(person.sameAs.length, 2)
      validateOrganization(person.worksFor)
    }],
    ['/llms.txt', 'text/plain', (body) => {
      assert.match(body, /^# Kristian Duda\r?\n\r?\n> /)
      assert.match(body, /## When to use this/)
      assert.match(body, /HTTP GET/)
      assert.match(body, /kristian\.duda@extropy\.sk/)
      assert.match(body, /legacy AngularJS-to-React migration/)
      assert.match(body, /no callable consulting API/)
      // Every H2 section follows the published llms.txt file-list format.
      for (const section of body.split(/^## .+$/m).slice(1)) {
        for (const line of section.trim().split(/\r?\n/).filter(Boolean)) assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/)
      }
    }],
    ['/index.md', null, (body, headers) => {
      assert.match(headers.get('content-type'), /^(text\/markdown|text\/plain|text\/x-markdown)/)
      assert.match(body, /^# Kristian Duda/)
      for (const heading of ['Expertise', 'Selected work', 'Contact']) assert.ok(body.includes(`## ${heading}`))
    }],
    ['/404.md', null, (body, headers) => {
      assert.match(headers.get('content-type'), /^(text\/markdown|text\/plain|text\/x-markdown)/)
      assert.match(body, /^# 404/)
      assert.ok(body.length >= 20)
      assert.match(body, /\[[^\]]+\]\(https:\/\/kd\.extropy\.sk\/llms\.txt\)/)
    }],
    ...['about', 'contact', 'privacy'].map((page) => [`/${page}/`, 'text/html', (body) => {
      assert.ok(visibleArticleText(body).length >= 500, `${page} requires at least 500 visible characters`)
      assert.match(body, /<html[^>]*lang="en"/)
      assert.match(body, new RegExp(`rel="canonical"[^>]*href="https://kd\\.extropy\\.sk/${page}/"`))
      assert.match(body, new RegExp(`property="og:url" content="https://kd\\.extropy\\.sk/${page}/"`))
      assert.ok(!/name="robots" content="noindex/.test(body), 'trust pages must be indexable')
      for (const target of ['about', 'contact', 'privacy']) assert.match(body, new RegExp(`href="[^"#]*/${target}/"`))
      if (page === 'contact' || page === 'privacy') assert.match(body, /href="mailto:kristian\.duda@extropy\.sk"/)
      if (page === 'privacy') assert.match(body, /github-general-privacy-statement/)
    }]),
    ['/robots.txt', 'text/plain', (body) => {
      assert.match(body, /^User-agent: \*\r?\nAllow: \/\r?\n/)
      assert.match(body, /Sitemap: https:\/\/kd\.extropy\.sk\/sitemap\.xml/)
    }],
    ['/sitemap.xml', null, (body, headers) => {
      assert.match(headers.get('content-type'), /^(application|text)\/xml/)
      assert.match(body, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
      assert.match(body, /<loc>https:\/\/kd\.extropy\.sk\/<\/loc>/)
      const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
      assert.deepEqual(urls.sort(), ['', 'about/', 'contact/', 'privacy/'].map((page) => `https://kd.extropy.sk/${page}`).sort())
    }],
  ]
  for (const [path, type, validate] of checks) {
    try {
      const response = await fetch(`${base}${path}`, { headers: { Accept: type || '*/*' }, signal: AbortSignal.timeout(15000) })
      assert.equal(response.status, 200, `expected HTTP 200, received ${response.status}`)
      if (type) assert.ok(response.headers.get('content-type')?.startsWith(type), 'unexpected content type')
      validate(await response.text(), response.headers)
      console.log(`PASS ${path}`)
    } catch (error) { const message = error.message.split('\n')[0]; failures.push(`${path}: ${message}`); console.log(`FAIL ${path}: ${message}`) }
  }
  try {
    const image = await fetch(`${base}/og.png`, { signal: AbortSignal.timeout(15000) })
    assert.equal(image.status, 200)
    assert.ok(image.headers.get('content-type')?.startsWith('image/png'))
    const bytes = Buffer.from(await image.arrayBuffer())
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(bytes.subarray(12, 16).toString(), 'IHDR')
    assert.equal(bytes.readUInt32BE(16), 1200)
    assert.equal(bytes.readUInt32BE(20), 630)
    console.log('PASS /og.png (PNG, 1200 × 630)')
  } catch (error) { const message = error.message.split('\n')[0]; failures.push(`/og.png: ${message}`); console.log(`FAIL /og.png: ${message}`) }
  // Static hosting serves HTML regardless of Accept. Strict audit mode checks
  // negotiation separately and must fail on GitHub Pages.
  for (const accept of ['text/markdown', 'text/html', 'text/markdown']) {
    try {
      const response = await fetch(`${base}/`, { headers: { Accept: accept }, signal: AbortSignal.timeout(15000) })
      assert.equal(response.status, 200, `expected HTTP 200, received ${response.status}`)
      const expectedType = requireNegotiation ? accept : 'text/html'
      assert.ok(response.headers.get('content-type')?.startsWith(expectedType), `expected ${expectedType}, received ${response.headers.get('content-type')}`)
      if (requireNegotiation) assert.ok(variesOnAccept(response.headers), 'homepage must vary on Accept')
      const body = await response.text()
      assert.ok(body.trim().length > 20, 'homepage body must not be empty')
      if (requireNegotiation && accept === 'text/markdown') {
        assert.match(body, /^# Kristian Duda/)
        assert.ok(!/<(?:html|script|body)\b/i.test(body), 'Markdown must not contain the HTML document')
        const source = await fetch(`${base}/index.md`, { signal: AbortSignal.timeout(15000) })
        assert.equal(source.status, 200)
        assert.equal(body, await source.text(), 'negotiated Markdown must match the published profile')
      } else assert.match(body, /^<!DOCTYPE html>/i)
      console.log(`PASS / (Accept: ${accept}; response: ${expectedType})`)
    } catch (error) { const message = error.message.split('\n')[0]; failures.push(`/ (${accept}): ${message}`); console.log(`FAIL / (${accept}): ${message}`) }
  }
  for (const accept of ['text/markdown', 'text/html']) {
    const path = '/__agent-readiness-missing-page'
    try {
      const response = await fetch(`${base}${path}`, { headers: { Accept: accept }, signal: AbortSignal.timeout(15000) })
      assert.equal(response.status, 404, 'final status after redirects must be 404')
      assert.ok(response.headers.get('content-type')?.startsWith(requireNegotiation ? accept : 'text/html'), 'unexpected 404 content type')
      const body = await response.text()
      if (requireNegotiation && accept === 'text/markdown') {
        validateMarkdownError(body, response.headers)
      } else {
        assert.match(body, /^<!DOCTYPE html>/i)
        assert.match(body, /<h1[^>]*>404/)
        assert.match(body, /href="[^"]*\/llms\.txt"/)
        assert.match(body, /href="[^"]*\/sitemap\.xml"/)
        assert.match(body, /name="robots" content="noindex"/)
      }
      console.log(`PASS ${path} (Accept: ${accept}; response: ${requireNegotiation ? accept : 'text/html'})`)
    } catch (error) { const message = error.message.split('\n')[0]; failures.push(`${path} (${accept}): ${message}`); console.log(`FAIL ${path} (${accept}): ${message}`) }
  }
  if (!requireNegotiation) console.log('LIMITATION GitHub Pages: homepage and 404 Markdown negotiation are unsupported; /index.md is the separate static Markdown endpoint.')
  assert.equal(failures.length, 0, failures.join('\n'))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await verifyEndpoints((process.argv[2] || 'https://kd.extropy.sk').replace(/\/$/, ''), { requireNegotiation: process.argv.includes('--require-negotiation') })
  } catch {
    process.exitCode = 1
  }
}
