import type { ReactNode } from 'react'

const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function TrustPage({ title, children }: { title: string; children: ReactNode }) {
  return <main className="site-shell">
    <header className="topbar"><a className="brand" href={`${base}/`}><span className="brand-mark">KD</span><span>Kristian Duda</span></a></header>
    <article className="trust-page section-pad"><p className="eyebrow">Kristian Duda / Software Architect</p><h1>{title}</h1>{children}</article>
    <footer className="trust-links" aria-label="Portfolio information"><a href={`${base}/`}>Portfolio</a><a href={`${base}/about/`}>About</a><a href={`${base}/contact/`}>Contact</a><a href={`${base}/privacy/`}>Privacy</a></footer>
  </main>
}
