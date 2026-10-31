import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShapeArtwork } from "@/components/ui/shape-artwork";
import { Icon } from "@/components/ui/icon";
import { appearanceTokens, defaultAppearance } from "@/lib/cojeev/appearance-tokens";
import { copy, getContent, loadContent, links as fallbackLinks, type Language } from "./content";
import { DownloadLink } from "./DownloadLink";

function ExternalLink({ href, children, className = "text-link" }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<Icon name="arrow-up-right" aria-hidden="true" feedback={false} /></a>;
}

export function App({ language = "en" }: { language?: Language }) {
  const [data, setData] = useState(() => getContent(language));
  const [contentError, setContentError] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const t = data.text;
  const { person, experience, skills, projects, archive, credentials } = data;
  const links = { email: `mailto:${person.email}`, github: person.githubUrl, linkedin: person.linkedinUrl, cv: fallbackLinks.cv };
  useEffect(() => {
    document.title = data.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", data.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", data.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", data.metadata.socialDescription);
  }, [data.metadata]);
  useEffect(() => {
    let active = true;
    loadContent(language).then(value => { if (active) { setData(value); setContentError(false); } })
      .catch(() => { if (active) setContentError(true); });
    return () => { active = false; };
  }, [language]);
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
      <a className="wordmark" href={language === "it" ? "/it/" : "/"} aria-label={t.home}>{person.name}<span aria-hidden="true">.</span></a>
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
      {contentError && <p role="status" className="container">{t.contentError}</p>}
      {downloadError && <p role="alert" className="container">{t.downloadError}</p>}
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-role">{person.role}</p>
          <h1 id="hero-title">{[person.name.split(" ")[0], person.name.split(" ").slice(1).join(" ")].filter(Boolean).map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}<span className="name-dot">.</span></h1>
          <div className="hero-profile">
            {data.profile.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="hero-actions">
            <Button data-stable-hit="" asChild size="lg" shape="card"><a href="#projects">{t.viewWork}</a></Button>
            <Button data-motion="off" data-stable-hit="" asChild size="lg" variant="outline" shape="card"><DownloadLink language={language} label={t.download} preparingLabel={t.preparingPdf} onError={() => setDownloadError(true)} onContent={value => { setDownloadError(false); if (value.language === language) setData(value); }} /></Button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <ShapeArtwork name="cloud-3" tone="olive" rotation={-12} shadow echo echoAngle={12} ambient={false} />
          <p>{t.focus}</p>
        </div>
        <div className="hero-footer"><p>{t.location}</p><p>{t.availability}</p><a href={links.github} target="_blank" rel="noopener noreferrer">{person.githubLabel}</a></div>
      </section>

      <section className="section container experience-section" id="experience" aria-labelledby="experience-title">
        <div className="section-heading"><p className="eyebrow">{t.work}</p><h2 id="experience-title">{t.workIntro}</h2></div>
        <div className="experience-list">
          {experience.map((job, index) => <article className={`job ${index === 0 ? "current-job" : ""}`} key={job.company}>
            <div className="job-heading"><h3>{job.company}</h3><p className="metadata">{job.date}</p></div>
            <p className="job-role">{job.role}</p>
            {job.details.length > 1 ? <ul>{job.details.map(detail => <li key={detail}>{detail}</li>)}</ul> : <p>{job.details[0]}</p>}
          </article>)}
          <p className="confidentiality metadata">{t.workPrivacy}</p>
        </div>
        <div className="toolkit" aria-labelledby="toolkit-title">
          <div className="toolkit-heading"><h3 id="toolkit-title">{t.skills}</h3><p className="metadata">{t.skillsIntro}</p></div>
          <dl>{skills.map(skill => <div key={skill.id} className={skill.wide ? "toolkit-wide" : undefined}>
            <dt>{skill.label}</dt><dd>{skill.value}</dd>
          </div>)}</dl>
        </div>
      </section>

      <section className="projects-section section" id="projects" aria-labelledby="projects-title">
        <div className="container">
          <div className="projects-heading"><div><p className="eyebrow">{t.universityWork}</p><h2 id="projects-title">{t.selectedProjects}</h2></div><p>{t.projectsIntro}</p></div>
          {projects.length > 0 && <article className="thesis-project">
            <div className="thesis-title"><p className="eyebrow">{t.thesis}</p><h3>{projects[0].name}</h3><p>{projects[0].category}</p><p className="metadata">{projects[0].tech}</p></div>
            <div className="thesis-detail"><p>{projects[0].description}</p><p>{projects[0].note}</p><div className="link-group"><ExternalLink href={projects[0].repo}>{t.repository}</ExternalLink>{projects[0].proof && <ExternalLink href={projects[0].proof}>{projects[0].proofType === "dataset" ? t.dataset : t.documentation}</ExternalLink>}</div></div>
          </article>}
          <div className="project-list">{projects.slice(1).map(project => <article className="project-row" key={project.name}>
            <div><h3>{project.name}</h3><p className="project-category">{project.category}</p></div>
            <div><p>{project.description}</p><p className="metadata project-tech">{project.tech}</p></div>
            <div className="project-links"><ExternalLink href={project.repo}>{t.github}</ExternalLink>{project.proof && <ExternalLink href={project.proof}>{t.documentation}</ExternalLink>}</div>
          </article>)}</div>
          <Accordion data-motion="off" type="single" collapsible appearance="editorial" className="project-archive">
            <AccordionItem value="archive"><AccordionTrigger>{t.archive}</AccordionTrigger><AccordionContent><p>{t.archiveIntro}</p><ul>{archive.map(project => <li key={project.name}>{project.url ? <ExternalLink href={project.url}>{project.name}</ExternalLink> : <span className="archive-name">{project.name}</span>}<span className="metadata">{project.year}</span></li>)}</ul></AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="section container about-section" id="about" aria-labelledby="about-title">
        <div className="about-heading"><p className="eyebrow">{t.about}</p><h2 id="about-title">{t.qualifications}</h2></div>
        <div className="about-details">
          <div className="education-record"><p className="eyebrow">{t.education}</p><h3>{t.degree}</h3><p>{t.university}</p><p className="metadata">{data.education.date} <span className="grade">{t.grade}</span></p></div>
          <div><h3>{t.languages}</h3><p>{t.languageDetail}</p></div>
          <div><h3>{t.interests}</h3><p>{t.interestsDetail}</p></div>
        </div>
        <div className="credentials"><h3>{t.credentials}</h3>{credentials.map(item => <article className="credential" key={item.title}>
          <h4>{item.title}</h4><p className="metadata">{item.issuer} · {item.date}</p>
          {item.inPreparation && <p className="eyebrow">{t.preparation}</p>}{item.credentialId && <p className="metadata">ID: {item.credentialId}</p>}{item.url ? <ExternalLink href={item.url}>{t.credential}</ExternalLink> : !item.inPreparation && <p className="metadata">{t.completion}</p>}
        </article>)}</div>
      </section>

      <section className="contact-section section" id="contact" aria-labelledby="contact-title"><div className="container contact-layout">
        <div><p className="eyebrow">{t.contact}</p><h2 id="contact-title">{t.contactTitle}</h2><p className="contact-copy">{t.contactCopy}</p><a className="email-link" href={links.email}>{person.email}</a><div className="link-group"><ExternalLink href={links.linkedin}>{t.linkedin}</ExternalLink><ExternalLink href={links.github}>{t.github}</ExternalLink></div></div>
        <div className="cv-downloads"><h3>{t.cvTitle}</h3><p className="metadata">{t.cvFormat}</p><Button data-motion="off" data-stable-hit="" asChild variant="outline" size="lg" shape="card"><DownloadLink language={"it"} label={t.italianCV} preparingLabel={t.preparingPdf} onError={() => setDownloadError(true)} onContent={value => { setDownloadError(false); if (value.language === language) setData(value); }} /></Button><Button data-motion="off" data-stable-hit="" asChild variant="outline" size="lg" shape="card"><DownloadLink language={"en"} label={t.englishCV} preparingLabel={t.preparingPdf} onError={() => setDownloadError(true)} onContent={value => { setDownloadError(false); if (value.language === language) setData(value); }} /></Button></div>
      </div></section>
    </main>
    <footer className="site-footer container"><p>{t.footer}</p><p>{t.copyright}</p></footer>
  </>;
}

export class PageBoundary extends Component<{ language: Language; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const t = copy[this.props.language];
    const person = getContent(this.props.language).person;
    const links = { ...fallbackLinks, email: `mailto:${person.email}` };
    return <main className="container error-page"><h1>{t.error}</h1><p>{t.errorCopy}</p><a href={links.email}>{person.email}</a><a href={links.cv[this.props.language]} download>{t.download}</a><button onClick={() => location.reload()}>{t.retry}</button></main>;
  }
}
