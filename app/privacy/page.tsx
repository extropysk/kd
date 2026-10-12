import type { Metadata } from 'next'
import TrustPage from '@/components/trust-page'

export const metadata: Metadata = {
  title: 'Privacy — Kristian Duda Portfolio',
  description: 'How the Kristian Duda portfolio uses GitHub Pages hosting, external links, and email contact.',
  alternates: { canonical: 'https://kd.extropy.sk/privacy/' },
  openGraph: { title: 'Privacy — Kristian Duda Portfolio', url: 'https://kd.extropy.sk/privacy/' },
}

export default function Privacy() {
  return <TrustPage title="Privacy">
    <p>This is Kristian Duda’s public portfolio, hosted as a static website on GitHub Pages. It presents professional experience and ways to get in touch. The site code does not include analytics tracking, advertising, a contact form, user accounts, or application cookies. Project filtering and the mobile menu run in your browser without submitting those interactions to an application server.</p>
    <h2>Hosting and external services</h2>
    <p>GitHub states that GitHub Pages logs visitors’ IP addresses for security purposes. For details about hosting-related processing, consult the <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">GitHub Pages documentation</a> and <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>. Fonts are delivered with the built site. Following links to GitHub, LinkedIn, or other websites takes you to services with their own privacy practices.</p>
    <h2>Email inquiries</h2>
    <p>The email link opens your chosen email application. If you send a message, its contents and contact details are received through email to discuss your inquiry. Avoid including passwords or confidential project data in an initial message. For questions about this website or information you have sent, contact <a href="mailto:kristian.duda@extropy.sk">kristian.duda@extropy.sk</a>. Any project-specific data handling arrangements should be discussed directly before sharing project material.</p>
  </TrustPage>
}
