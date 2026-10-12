import TrustPage from '@/components/trust-page'

export default function NotFound() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return <TrustPage title="404 — Page not found"><p>The requested page does not exist or has moved. Return to the portfolio or use the machine-readable discovery files to find published content.</p><p><a href={`${base}/llms.txt`}>Agent discovery (llms.txt)</a> · <a href={`${base}/sitemap.xml`}>Sitemap</a> · <a href={`${base}/404.md`}>Markdown error explanation</a></p></TrustPage>
}
