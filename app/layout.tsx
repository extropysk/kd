import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://kd.extropy.sk'),
  alternates: {
    canonical: 'https://kd.extropy.sk/',
  },
  title: 'Kristian Duda — Software Architect & Agent Orchestrator',
  description: 'Kristian Duda is a software architect and agent orchestrator in Poprad, Slovakia, building Node.js systems, React applications, and production software at Extropy.',
  openGraph: {
    type: 'website',
    url: 'https://kd.extropy.sk/',
    title: 'Kristian Duda — Software Architect & Agent Orchestrator',
    description: 'Software architecture, Node.js systems, React applications, and AI agent orchestration by Kristian Duda, founder of Extropy.',
    siteName: 'Kristian Duda',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2f0ea',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://kd.extropy.sk/#person',
    name: 'Kristian Duda',
    description: metadata.description,
    url: 'https://kd.extropy.sk/',
    jobTitle: 'Software Architect & Agent Orchestrator',
    email: 'kristian.duda@extropy.sk',
    worksFor: { '@type': 'Organization', name: 'Extropy' },
    homeLocation: { '@type': 'Place', name: 'Poprad, Slovakia' },
    sameAs: ['https://github.com/kristianduda', 'https://linkedin.com/in/kristianduda'],
    knowsAbout: ['Software architecture', 'AI agent orchestration', 'Node.js', 'React', 'Next.js'],
  }
  return <html lang="en" className="bg-background"><head><link rel="describedby" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/llms.txt`} /><link rel="alternate" type="text/markdown" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/index.md`} /></head><body className={`${inter.variable} ${spaceMono.variable} antialiased`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} />{children}</body></html>
}
