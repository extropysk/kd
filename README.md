# Kristian Duda portfolio

Static Next.js portfolio hosted on GitHub Pages. Install with `pnpm install --frozen-lockfile`, build with `pnpm build`, then run `pnpm test`. The GitHub Actions workflow builds, tests, and deploys the static `out/` artifact.

## Agent discovery

The homepage keeps its visual design and HTML behavior. It includes server-rendered Schema.org Person JSON-LD, identity in its H1, a canonical URL, and discovery links:

- `rel="alternate" type="text/markdown"` points to `/index.md`.
- `rel="describedby"` points to `/llms.txt`.
- `/llms.txt` explains best-fit use cases, project evidence, and how to contact Kristian.
- `/index.md` provides the profile as a static Markdown document. Keep it synchronized with the visible portfolio.
- `/robots.txt` and `/sitemap.xml` support search indexing.

All four discovery files live in `public/` and are copied into the static export.

## Verification

`pnpm test` (or `pnpm test:export`) checks the built static files over a local HTTP server: homepage identity, JSON-LD, Markdown discovery links, all four machine-readable files, HTML responses, HEAD behavior, and HTTP 404 responses.

After deployment, run `pnpm verify:public` to check the public endpoints and discovery files on the live site.

```sh
curl -sS -L -i https://kd.extropy.sk/
curl -sS -L -i https://kd.extropy.sk/index.md
curl -sS -L -i https://kd.extropy.sk/llms.txt
curl -sS -L -i https://kd.extropy.sk/some-path-that-does-not-exist
```

Expect HTTP 200 for the homepage and discovery files, a Markdown profile at `/index.md`, and HTTP 404 for the nonexistent path.

## Search follow-up

After deployment, verify ownership in Google Search Console and Bing Webmaster Tools, submit `https://kd.extropy.sk/sitemap.xml`, and request homepage indexing. Point public GitHub and LinkedIn website links directly at `https://kd.extropy.sk/` and seek relevant editorial mentions linking to the canonical domain. Recheck `Kristian Duda software architect` after indexing.
