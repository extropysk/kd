import type { Metadata } from 'next'
import TrustPage from '@/components/trust-page'

export const metadata: Metadata = {
  title: 'About Kristian Duda — Full-stack Product Builder',
  description: 'Kristian Duda’s full-stack engineering background and approach to product delivery, AI-assisted development, and integrations at Extropy.',
  alternates: { canonical: 'https://kd.extropy.sk/about/' },
  openGraph: { title: 'About Kristian Duda — Full-stack Product Builder', url: 'https://kd.extropy.sk/about/' },
}

export default function About() {
  return <TrustPage title="About Kristian Duda">
    <p>I am Kristian Duda, a full-stack product builder based in Poprad, Slovakia, and founder of Extropy. I combine hands-on full-stack development, software architecture, and technical leadership. My work spans business-system integrations, data-driven products, and production platforms. I use AI agents to accelerate development, with responsibility for architecture and code review.</p>
    <h2>Engineering background</h2>
    <p>My portfolio includes the AngularJS-to-React migration of Stream Circle’s TV automation and playout platform, development of Tweenly’s browser-based broadcast graphics platform, UIS, and third-party integrations for Modulario’s modular business management platform. Earlier projects include e-forms and city account features for Bratislava, the Jdi do hor social network, CORA GEO Retec, Ditec’s internal time tracking application, and AFS Retail Execution for field sales and merchandising. I earned an Engineer’s Degree in Applied Informatics at the Slovak University of Technology in Bratislava.</p>
    <h2>How I work</h2>
    <p>I take ownership from understanding the problem through implementation, review, and production delivery. I combine hands-on development with architecture and technical leadership, using AI agents to accelerate the work. I stay responsible for the solution, its integrations, and the details that make it reliable in practice. The selected work and experience on the portfolio describe my contribution; project names do not imply that their products or APIs are available through this website.</p>
  </TrustPage>
}
