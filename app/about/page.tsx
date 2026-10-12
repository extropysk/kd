import type { Metadata } from 'next'
import TrustPage from '@/components/trust-page'

export const metadata: Metadata = {
  title: 'About Kristian Duda — Software Architect',
  description: 'Kristian Duda’s software architecture, engineering background, and approach to AI agent orchestration at Extropy.',
  alternates: { canonical: 'https://kd.extropy.sk/about/' },
  openGraph: { title: 'About Kristian Duda — Software Architect', url: 'https://kd.extropy.sk/about/' },
}

export default function About() {
  return <TrustPage title="About Kristian Duda">
    <p>I am Kristian Duda, a software architect and agent orchestrator based in Poprad, Slovakia, and founder of Extropy. My work combines architecture, technical leadership, and hands-on development of production software. I focus on resilient Node.js systems, React applications, and clear constraints that help teams and AI agents deliver reliable results.</p>
    <h2>Engineering background</h2>
    <p>My portfolio includes Stream Circle’s AngularJS-to-React migration, Tweenly’s real-time broadcast graphics platform, UIS, and integrations for Modulario. Earlier projects include e-forms and city account features for Bratislava, the Doby Hory social network, CORA GEO Retec, and Ditec’s internal time tracking application. I earned an Engineer’s Degree in Applied Informatics at the Slovak University of Technology in Bratislava.</p>
    <h2>How I work</h2>
    <p>I use AI agents alongside architecture, review, and explicit engineering constraints. Software quality depends on understanding the system, its integrations, and its edge cases. The selected work and experience on the portfolio describe my contribution; project names do not imply that their products or APIs are available through this website.</p>
  </TrustPage>
}
