import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShapeArtwork } from "@/components/ui/shape-artwork";
import { Icon } from "@/components/ui/icon";
import { appearanceTokens, defaultAppearance } from "@/lib/cojeev/appearance-tokens";
import { archive, copy, credentials, experience, links, projects, skills, type Language } from "./content";

function ExternalLink({ href, children, className = "text-link" }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<Icon name="arrow-up-right" aria-hidden="true" feedback={false} /></a>;
}

export function App({ language = "en" }: { language?: Language }) {
  const t = copy[language];
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const initial = root.dataset.mode === "dark" ? "dark" : "light";
    setMode(initial);
    for (const [name, value] of Object.entries(appearanceTokens(defaultAppearance, initial))) root.style.setProperty(name, value);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  function toggleMode() {
    const next = mode === "light" ? "dark" : "light";
    document.documentElement.dataset.mode = next;
    for (const [name, value] of Object.entries(appearanceTokens(defaultAppearance, next))) document.documentElement.style.setProperty(name, value);
    try { localStorage.setItem("valerio-theme", next); } catch { /* Theme still works when storage is unavailable. */ }
    setMode(next);
  }

  const navItems = [["experience", t.work], ["projects", t.projects], ["about", t.about], ["contact", t.contact]];
  return <>
    <a href="#main" className="skip-link">{t.skip}</a>
    <header className="site-header container">
      <a className="wordmark" href={language === "it" ? "/it/" : "/"} aria-label="Valerio Di Zio, home">Valerio Di Zio<span aria-hidden="true">.</span></a>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} id="main-navigation" aria-label={t.navLabel}>
        {navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-controls" data-motion="off" data-flow="off">
        <a className="language-link" href={language === "en" ? "/it/" : "/"} hrefLang={language === "en" ? "it" : "en"} lang={language === "en" ? "it" : "en"}>{language === "en" ? "IT" : "EN"}<span className="sr-only">: {t.otherLanguage}</span></a>
        <Button data-stable-hit="" variant="ghost" shape="card" className="icon-button" onClick={toggleMode} aria-label={mode === "light" ? t.themeDark : t.themeLight} title={mode === "light" ? t.themeDark : t.themeLight}>
          <Icon name={mode === "light" ? "moon" : "sun"} aria-hidden="true" feedback={false} />
        </Button>
        <Button data-stable-hit="" ref={menuButton} variant="ghost" shape="card" className="menu-button" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{t.menu}</Button>
      </div>
    </header>

    <main id="main" tabIndex={-1}>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-role">Cloud Developer / Cloud Engineer</p>
          <h1 id="hero-title">Valerio<br />Di Zio<span className="name-dot">.</span></h1>
          <p className="hero-profile">{t.profile}</p>
          <div className="hero-actions">
            <Button data-stable-hit="" asChild size="lg" shape="card"><a href="#projects">{t.viewWork}</a></Button>
            <Button data-motion="off" data-stable-hit="" asChild size="lg" variant="outline" shape="card"><a href={links.cv[language]} download>{t.download}<Icon name="download" aria-hidden="true" feedback={false} /></a></Button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <ShapeArtwork name="cloud-3" tone="olive" rotation={-12} shadow echo echoAngle={12} ambient={false} />
          <p>{t.focus}</p>
        </div>
        <div className="hero-footer"><p>{t.location}</p><p>{t.availability}</p><a href={links.github} target="_blank" rel="noopener noreferrer">GitHub / v4l3rio</a></div>
      </section>

      <section className="section container experience-section" id="experience" aria-labelledby="experience-title">
        <div className="section-heading"><p className="eyebrow">{t.work}</p><h2 id="experience-title">{t.workIntro}</h2></div>
        <div className="experience-list">
          {experience.map((job, index) => <article className={`job ${index === 0 ? "current-job" : ""}`} key={job.company}>
            <div className="job-heading"><h3>{job.company}</h3><p className="metadata">{job.date[language]}</p></div>
            <p className="job-role">{job.role[language]}</p>
            {job.details[language].length > 1 ? <ul>{job.details[language].map(detail => <li key={detail}>{detail}</li>)}</ul> : <p>{job.details[language][0]}</p>}
          </article>)}
          <p className="confidentiality metadata">{t.workPrivacy}</p>
        </div>
        <div className="toolkit"><h3>{t.skills}</h3><dl>
          <div><dt>{t.programmingLanguage}</dt><dd>{skills.language}</dd></div>
          <div><dt>{t.development}</dt><dd>{skills.development}, {t.angular}</dd></div>
          <div><dt>{t.cloud}</dt><dd>{skills.cloud}</dd></div>
          <div><dt>{t.tools}</dt><dd>{skills.tools}, {t.containers}</dd></div>
          <div><dt>{t.practices}</dt><dd>{t.methods}</dd></div>
          <div><dt>{t.architectures}</dt><dd>{t.architectureDetail}</dd></div>
        </dl></div>
      </section>

      <section className="projects-section section" id="projects" aria-labelledby="projects-title">
        <div className="container">
          <div className="projects-heading"><div><p className="eyebrow">{language === "en" ? "University work" : "Lavori universitari"}</p><h2 id="projects-title">{language === "en" ? "Selected projects." : "Progetti selezionati."}</h2></div><p>{t.projectsIntro}</p></div>
          <article className="thesis-project">
            <div className="thesis-title"><p className="eyebrow">{t.thesis}</p><h3>FairLib</h3><p>{projects[0].category[language]}</p><p className="metadata">{projects[0].tech}</p></div>
            <div className="thesis-detail"><p>{projects[0].description[language]}</p><p>{projects[0].note?.[language]}</p><div className="link-group"><ExternalLink href={projects[0].repo}>{t.repository}</ExternalLink><ExternalLink href={projects[0].proof!}>{t.dataset}</ExternalLink></div></div>
          </article>
          <div className="project-list">{projects.slice(1).map(project => <article className="project-row" key={project.name}>
            <div><h3>{project.name}</h3><p className="project-category">{project.category[language]}</p></div>
            <div><p>{project.description[language]}</p><p className="metadata project-tech">{project.tech}</p></div>
            <div className="project-links"><ExternalLink href={project.repo}>GitHub</ExternalLink>{project.proof && <ExternalLink href={project.proof}>{t.documentation}</ExternalLink>}</div>
          </article>)}</div>
          <Accordion data-motion="off" type="single" collapsible appearance="editorial" className="project-archive">
            <AccordionItem value="archive"><AccordionTrigger>{t.archive}</AccordionTrigger><AccordionContent><p>{t.archiveIntro}</p><ul>{archive.map(project => <li key={project.name}>{project.url ? <ExternalLink href={project.url}>{project.name}</ExternalLink> : <span className="archive-name">{project.name}</span>}<span className="metadata">{project.year}</span></li>)}</ul></AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="section container about-section" id="about" aria-labelledby="about-title">
        <div className="about-heading"><p className="eyebrow">{t.about}</p><h2 id="about-title">{t.qualifications}</h2></div>
        <div className="about-details">
          <div className="education-record"><p className="eyebrow">{t.education}</p><h3>{t.degree}</h3><p>{t.university}</p><p className="metadata">2022 – 2025 <span className="grade">{t.grade}</span></p></div>
          <div><h3>{t.languages}</h3><p>{t.languageDetail}</p></div>
          <div><h3>{t.interests}</h3><p>{t.interestsDetail}</p></div>
        </div>
        <div className="credentials"><h3>{t.credentials}</h3>{credentials.map(item => <article className="credential" key={item.title}>
          <h4>{item.title}</h4><p className="metadata">{item.issuer} · {item.date[language]}</p>
          {item.url ? <ExternalLink href={item.url}>{t.credential}</ExternalLink> : <p className="metadata">{t.completion}</p>}
        </article>)}<article className="credential preparation"><p className="eyebrow">{t.preparation}</p><h4>Professional Cloud Developer</h4><p className="metadata">Google Cloud · {t.target}</p></article></div>
      </section>

      <section className="contact-section section" id="contact" aria-labelledby="contact-title"><div className="container contact-layout">
        <div><p className="eyebrow">{t.contact}</p><h2 id="contact-title">{t.contactTitle}</h2><p className="contact-copy">{t.contactCopy}</p><a className="email-link" href={links.email}>diziovalerio@gmail.com</a><div className="link-group"><ExternalLink href={links.linkedin}>LinkedIn</ExternalLink><ExternalLink href={links.github}>GitHub</ExternalLink></div></div>
        <div className="cv-downloads"><h3>Curriculum vitae</h3><p className="metadata">PDF · {language === "en" ? "Two pages, ATS-friendly format" : "Due pagine, formato compatibile con ATS"}</p><Button data-motion="off" data-stable-hit="" asChild variant="outline" size="lg" shape="card"><a href={links.cv.it} download>{t.italianCV}<Icon name="download" aria-hidden="true" feedback={false} /></a></Button><Button data-motion="off" data-stable-hit="" asChild variant="outline" size="lg" shape="card"><a href={links.cv.en} download>{t.englishCV}<Icon name="download" aria-hidden="true" feedback={false} /></a></Button></div>
      </div></section>
    </main>
    <footer className="site-footer container"><p>{t.footer}</p><p>© 2026</p></footer>
  </>;
}

export class PageBoundary extends Component<{ language: Language; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const t = copy[this.props.language];
    return <main className="container error-page"><h1>{t.error}</h1><p>{t.errorCopy}</p><a href={links.email}>diziovalerio@gmail.com</a><a href={links.cv[this.props.language]} download>{t.download}</a><button onClick={() => location.reload()}>{t.retry}</button></main>;
  }
}
