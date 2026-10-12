import type { Metadata } from 'next'
import TrustPage from '@/components/trust-page'

export const metadata: Metadata = {
  title: 'Contact Kristian Duda — Software Architecture & Engineering',
  description: 'Contact Kristian Duda at Extropy about software architecture, React and Node.js development, migration, and AI agent orchestration.',
  alternates: { canonical: 'https://kd.extropy.sk/contact/' },
  openGraph: { title: 'Contact Kristian Duda', url: 'https://kd.extropy.sk/contact/' },
}

export default function Contact() {
  return <TrustPage title="Contact">
    <p>For software architecture and engineering inquiries, email <a href="mailto:kristian.duda@extropy.sk">kristian.duda@extropy.sk</a>. I am Kristian Duda, founder of Extropy, based in Poprad, Slovakia. You can contact me about Node.js systems, React applications, legacy migrations, technical leadership, and AI agent orchestration.</p>
    <h2>Describe your system</h2>
    <p>A useful first message explains what you are building, your current technology stack, the integrations involved, and the main constraints. Include the problem you want to solve and the kind of help you need, such as an architecture review, a migration plan, or engineering support. Share only information you are comfortable sending by email; we can discuss how to exchange sensitive project material separately.</p>
    <h2>Scope and availability</h2>
    <p>Scope, availability, and commercial terms are confirmed directly. This portfolio does not publish pricing, offer automated booking, or expose a consulting API. My public profiles are available on <a href="https://github.com/kristianduda">GitHub</a> and <a href="https://linkedin.com/in/kristianduda">LinkedIn</a> for additional background. Agents may use the published contact information to draft an inquiry, with their user’s authorization before sending.</p>
  </TrustPage>
}
