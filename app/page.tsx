'use client'

import { useMemo, useState } from 'react'

type Project = {
  title: string
  period: string
  category: 'AI systems' | 'Product' | 'Civic tech' | 'Platform'
  description: string
  stack: string
  number: string
  featured?: boolean
}

const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

const projects: Project[] = [
  { title: 'Stream Circle', period: 'Mar 2026 — Present', category: 'AI systems', description: 'Leading the migration of a legacy AngularJS application to React while orchestrating AI agents to accelerate development and improve engineering efficiency.', stack: 'React.js', number: '01', featured: true },
  { title: 'Tweenly', period: 'Oct 2022 — Present', category: 'Product', description: 'Led the creation of a platform for creating, managing, and broadcasting real-time graphics for live television and video production.', stack: 'React · MUI · NestJS · MongoDB · AWS', number: '02', featured: true },
  { title: 'UIS', period: 'Jan 2023 — Present', category: 'Platform', description: 'Spearheading an event-driven platform that accelerates delivery of custom business solutions through reusable architecture and built-in integrations.', stack: 'Payload CMS · PostgreSQL · AWS', number: '03' },
  { title: 'Modulario', period: 'Sep 2024 — Dec 2025', category: 'Platform', description: 'Designed and implemented third-party integrations, connecting Modulario with external platforms and APIs for reliable data exchange.', stack: 'Express.js · React · Tailwind · MongoDB · AWS', number: '04' },
  { title: 'Bratislava', period: 'Oct 2022 — May 2023', category: 'Civic tech', description: 'Developed e-forms and city account features for the official website of Bratislava.', stack: 'Next.js · Tailwind', number: '05' },
  { title: 'Doby Hory', period: 'Jan 2021 — Sep 2022', category: 'Product', description: 'Led the development of a social network tailored for mountain enthusiasts.', stack: 'React · ASP.NET Core · MongoDB', number: '06' },
  { title: 'CORA GEO Retec', period: 'Jul 2018 — May 2022', category: 'Civic tech', description: 'Architected and developed a dynamic web framework utilizing React.js and ASP.NET Web API.', stack: 'React · Kendo UI · ASP.NET · Oracle', number: '07' },
  { title: 'Ditec Intranet', period: 'Oct 2018 — Apr 2020', category: 'Product', description: 'Developed a time tracking application to optimize workflow management and efficiency tracking for internal use.', stack: 'React · MUI · ASP.NET', number: '08' },
]

const experience = [
  ['Founder', 'Extropy', 'Oct 2022 — Present', 'Empowering agents with the tools and guardrails to build production-ready systems.'],
  ['Software Architect', 'AMCEF', 'Jun 2023 — Dec 2025', 'Designed software architectures, provided technical leadership, and mentored development teams.'],
  ['Full Stack Developer', 'Freelance', 'Dec 2017 — Sep 2022', 'Delivered high-quality full stack development services for a variety of clients.'],
  ['Software Developer', 'CORA GEO', 'Jul 2015 — May 2022', 'Designed and developed e-government systems to improve public administration and citizen engagement.'],
]

export default function Page() {
  const [filter, setFilter] = useState('All')
  const [openProject, setOpenProject] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const categories = ['All', 'AI systems', 'Product', 'Platform', 'Civic tech']
  const visibleProjects = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.category === filter), [filter])

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Kristian Duda home"><span className="brand-mark">KD</span><span>Kristian Duda</span></a>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
        <nav id="site-nav" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a className="nav-contact" href="mailto:kristian.duda@extropy.sk" onClick={() => setMenuOpen(false)}>Get in touch <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker"><span className="live-dot" /> Software architect · Agent orchestrator · Slovakia</div>
        <h1><span className="sr-only">Kristian Duda — Software Architect &amp; Agent Orchestrator. </span>Building the<br /><em>systems</em> behind<br />better software.</h1>
        <div className="hero-bottom">
          <p className="hero-intro">I’m Kristian Duda — a software architect with deep Node.js expertise. I orchestrate AI agents, shape resilient architectures, and review the details that make production software trustworthy.</p>
          <a href="#work" className="circle-link" aria-label="Scroll to selected work">↓</a>
          <div className="hero-aside"><span>Currently</span><strong>Founder at Extropy</strong><span>Based in Poprad, Slovakia</span></div>
        </div>
      </section>

      <section className="work-section section-pad" id="work">
        <div className="section-heading"><p className="eyebrow">01 / Selected work</p><p className="section-note">Systems, products &amp; platforms<br />built with intent.</p></div>
        <div className="filter-row" role="toolbar" aria-label="Filter projects">{categories.map((category) => <button key={category} className={filter === category ? 'filter-button active' : 'filter-button'} onClick={() => setFilter(category)}>{category}</button>)}</div>
        <div className="projects-grid">{visibleProjects.map((project) => <article className={project.featured ? 'project-card featured' : 'project-card'} key={project.title}>
          <div className="project-top"><span className="project-number">{project.number}</span><span className="project-period">{project.period}</span></div>
          <div className="project-body"><div><p className="project-category">{project.category}</p><h2>{project.title}</h2></div><button className="project-expand" aria-expanded={openProject === project.title} aria-label={`Show details for ${project.title}`} onClick={() => setOpenProject(openProject === project.title ? null : project.title)}>{openProject === project.title ? '−' : '+'}</button></div>
          <div className={openProject === project.title ? 'project-detail open' : 'project-detail'}><p>{project.description}</p><span>{project.stack}</span></div>
          <div className="project-line" />
        </article>)}</div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="section-heading"><p className="eyebrow">02 / Point of view</p><p className="section-note">The layer between<br />idea and execution.</p></div>
        <div className="about-grid"><p className="about-statement">While agents write the code, <em>I focus on the architecture.</em></p><div className="about-copy"><p>I believe great software is less about shipping more code and more about creating the conditions for the right code to emerge.</p><p>That means strong systems, clear constraints, and a critical eye for the edge cases. Today, I use AI as a force multiplier — not a shortcut.</p></div></div>
        <div className="skills-list"><div className="skill-group"><span>Frontend</span><p>React · React Native · Next.js · Tailwind</p></div><div className="skill-group"><span>Backend</span><p>Node.js · NestJS · Payload CMS · PostgreSQL · MongoDB</p></div><div className="skill-group"><span>Tools</span><p>AWS · GitHub · Claude · Codex</p></div></div>
      </section>

      <section className="experience-section section-pad" id="experience">
        <div className="section-heading"><p className="eyebrow">03 / Experience</p><p className="section-note">A decade of making<br />complex things clearer.</p></div>
        <div className="timeline">{experience.map(([role, company, period, description]) => <div className="timeline-item" key={`${role}-${company}`}><div className="timeline-meta"><span>{period}</span><span>{company}</span></div><div><h2>{role}</h2><p>{description}</p></div></div>)}</div>
        <div className="education"><span>Education</span><div><strong>Slovak University of Technology in Bratislava</strong><p>Engineer’s Degree in Applied Informatics · 2013 — 2018</p></div></div>
      </section>

      <footer className="footer section-pad"><div className="footer-kicker">Have a system to build?</div><h2>Let’s make it<br /><em>work beautifully.</em></h2><a className="email-link" href="mailto:kristian.duda@extropy.sk">kristian.duda@extropy.sk <span>↗</span></a><div className="footer-bottom"><nav aria-label="Portfolio information"><a href={`${base}/about/`}>About</a><a href={`${base}/contact/`}>Contact</a><a href={`${base}/privacy/`}>Privacy</a></nav><div><a href="https://github.com/kristianduda" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/kristianduda" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><span>© 2026 Kristian Duda</span></div></footer>
    </main>
  )
}
