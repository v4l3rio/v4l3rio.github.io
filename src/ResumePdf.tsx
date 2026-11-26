import type { ReactNode } from "react";
import { Document, Page, Text, View, Link, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { ResumeData } from "./content";

// Fonts in /fonts/cv are static TTFs with the "liga" feature removed, so "fi"/"fl"
// stay two real characters in the PDF text layer (ATS parsing, copy and search).
let registeredBase: string | undefined;
export function registerPdfFonts(base = "/fonts/cv") {
  if (registeredBase === base) return;
  registeredBase = base;
  Font.register({ family: "CV", fonts: [
    { src: `${base}/DMSans-regular.ttf`, fontWeight: 400 },
    { src: `${base}/DMSans-bold.ttf`, fontWeight: 700 },
  ] });
  Font.register({ family: "Display", src: `${base}/BricolageGrotesque-bold.ttf`, fontWeight: 700 });
  Font.registerHyphenationCallback(word => [word]);
}

// Same palette as the website (src/styles/cojeev/tokens.css, light theme).
const ink = "#26282d";
const soft = "#464951";
const accent = "#525d3d";
const olive = "#A8BC75";
const rule = "#d3d8c6";

const s = StyleSheet.create({
  page: { paddingTop: 38, paddingBottom: 40, paddingHorizontal: 50, fontFamily: "CV", fontSize: 10, lineHeight: "13.6pt", color: ink },
  header: { borderBottomWidth: .75, borderBottomColor: rule, paddingBottom: 9, marginBottom: 0 },
  nameRow: { flexDirection: "row", alignItems: "flex-end" },
  name: { fontFamily: "Display", fontWeight: 700, fontSize: 30, lineHeight: "34pt", letterSpacing: -.4 },
  // Drawn shape, not a "." character, so ATS parsers read the surname cleanly.
  dot: { width: 6.5, height: 6.5, borderRadius: 3.25, backgroundColor: olive, marginLeft: 2, marginBottom: 6 },
  role: { fontSize: 12.5, color: accent, fontWeight: 700, marginTop: 2, marginBottom: 6 },
  contact: { fontSize: 9.3, lineHeight: "13pt", color: soft },
  title: { fontFamily: "Display", fontWeight: 700, fontSize: 13.5, lineHeight: "17pt", color: accent, borderBottomWidth: .75, borderBottomColor: rule, paddingBottom: 3, marginBottom: 7, marginTop: 13 },
  paragraph: { marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heading: { fontSize: 11, fontWeight: 700, lineHeight: "14pt", flex: 1, paddingRight: 12 },
  date: { fontSize: 9.3, lineHeight: "14pt", color: soft },
  meta: { fontSize: 9.3, lineHeight: "12.5pt", color: soft, marginTop: 1, marginBottom: 3 },
  company: { fontWeight: 700, color: accent },
  job: { marginBottom: 11 },
  bullet: { flexDirection: "row", marginBottom: 2 },
  marker: { width: 11, color: accent },
  bulletText: { flex: 1 },
  credential: { marginBottom: 4 },
  credentialMeta: { fontSize: 9.3, lineHeight: "12pt", color: soft },
  credentialTitle: { fontWeight: 700, fontSize: 10.3, lineHeight: "13.5pt", flex: 1, paddingRight: 12 },
  skillRow: { flexDirection: "row", marginBottom: 3.5 },
  skillLabel: { width: 132, fontWeight: 700, paddingRight: 10 },
  skillValue: { flex: 1 },
  project: { marginBottom: 11 },
  projectTitle: { fontSize: 11, fontWeight: 700, lineHeight: "14pt" },
  category: { fontWeight: 400, color: soft },
  projectLinks: { fontSize: 9.3, marginTop: 2 },
  link: { color: accent, textDecoration: "underline" },
  sep: { color: olive },
  team: { fontSize: 9.3, lineHeight: "12.5pt", color: soft },
  process: { marginTop: 5, borderLeftWidth: 1.5, borderLeftColor: olive, paddingLeft: 9, paddingVertical: 2 },
  processItem: { fontSize: 9.6, lineHeight: "13pt" },
});

const clean = (text: string) => text.replace(/[\u2011\u2013\u2014]/g, "-");
const display = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/** The "how I worked" layer: team dynamics, method and decisions behind a result. */
function Process({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <View style={s.process}>
    {items.map((item, index) => <View key={index} style={s.bullet}><Text style={[s.processItem, s.marker]}>–</Text><Text style={[s.processItem, s.bulletText]}>{item}</Text></View>)}
  </View>;
}

function Heading({ children }: { children: string }) {
  return <Text style={s.title} minPresenceAhead={40}>{children}</Text>;
}

/** Joins inline items with an olive middle dot, skipping empty ones. */
function Dots({ items }: { items: ReactNode[] }) {
  const kept = items.filter(item => item !== null && item !== undefined && item !== false && item !== "");
  return <>{kept.map((item, index) => <Text key={index}>{index > 0 && <Text style={s.sep}>  ·  </Text>}{item}</Text>)}</>;
}

export function ResumePdf({ data }: { data: ResumeData }) {
  const { text: t, person, pdf: config } = data;
  return <Document title={`${person.name} - ${config.title}`} author={person.name} language={data.language}>
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <View style={s.nameRow}><Text style={s.name}>{person.name}</Text><View style={s.dot} /></View>
        <Text style={s.role}>{person.role}</Text>
        <Text style={s.contact}><Dots items={[t.location, person.phone, <Link style={s.link} src={`mailto:${person.email}`}>{person.email}</Link>]} /></Text>
        <Text style={s.contact}><Dots items={[person.linkedinUrl, person.githubUrl, person.websiteUrl].map(url => <Link style={s.link} src={url}>{display(url)}</Link>)} /></Text>
      </View>

      <Heading>{config.profileHeading}</Heading>
      {data.profile.map((paragraph, index) => <Text key={index} style={s.paragraph}>{paragraph}</Text>)}

      {data.experience.length > 0 && <Heading>{config.experienceHeading}</Heading>}
      {data.experience.map((job, index) => <View key={index} style={s.job} wrap={false}>
        <View style={s.row} minPresenceAhead={35}><Text style={s.heading}>{job.role}</Text><Text style={s.date}>{clean(job.date)}</Text></View>
        <Text style={s.meta}><Dots items={[<Text style={s.company}>{job.company}</Text>, job.team]} /></Text>
        {job.details.length === 1 ? <Text>{job.details[0]}</Text> : job.details.map((detail, index) => <View key={index} style={s.bullet}><Text style={s.marker}>•</Text><Text style={s.bulletText}>{detail}</Text></View>)}
        <Process items={job.process} />
      </View>)}

      {data.skills.length > 0 && <Heading>{config.skillsHeading}</Heading>}
      {data.skills.map(skill => <View key={skill.id} style={s.skillRow} wrap={false}>
        <Text style={s.skillLabel}>{skill.label}</Text><Text style={s.skillValue}>{skill.value}</Text>
      </View>)}

      {data.projects.length > 0 && <Heading>{config.projectsHeading}</Heading>}
      {data.projects.filter(project => !project.hideInPdf).map((project, index) => <View key={index} style={s.project} wrap={false}>
        <Text style={s.projectTitle} minPresenceAhead={40}>{project.name}<Text style={s.category}>  ·  {project.category}</Text></Text>
        {project.team && <Text style={s.meta}>{project.team}</Text>}
        <Text>{project.description}{project.note ? ` ${project.note}` : ""}</Text>
        <Process items={project.process} />
        <Text style={s.projectLinks}><Dots items={[
          <Link src={project.repo} style={s.link}>{t.repository}</Link>,
          project.proof ? <Link src={project.proof} style={s.link}>{project.proofType === "dataset" ? t.dataset : t.documentation}</Link> : null,
          <Text style={s.team}>{project.tech}</Text>,
        ]} /></Text>
      </View>)}

      <View wrap={false}>
        <Heading>{t.education}</Heading>
        <View style={s.row}><Text style={s.heading}>{t.degree}</Text><Text style={s.date}>{clean(data.education.date)}</Text></View>
        <Text style={s.meta}><Dots items={[t.university, t.grade]} /></Text>
      </View>

      {data.credentials.length > 0 && <Heading>{config.credentialsHeading}</Heading>}
      {data.credentials.map((credential, index) => <View key={index} style={s.credential} wrap={false}>
        <View style={s.row}>
          <Text style={s.credentialTitle}>{credential.title}</Text>
          <Text style={s.date}>{credential.inPreparation ? t.preparation : clean(credential.date)}</Text>
        </View>
        <Text style={s.credentialMeta}><Dots items={[
          credential.issuer,
          credential.inPreparation && credential.date !== t.preparation ? clean(credential.date) : null,
          credential.credentialId ? `ID: ${credential.credentialId}` : null,
          credential.url ? <Link src={credential.url} style={s.link}>{t.credential}</Link> : null,
        ]} /></Text>
      </View>)}

      {/* Availability is stated in the profile, so this block keeps only languages and, optionally, interests. */}
      <View wrap={false}>
        <Heading>{config.includeInterests ? `${t.languages} · ${t.interests}` : t.languages}</Heading>
        <Text>{t.languageDetail}</Text>
        {config.includeInterests && <Text>{t.interestsDetail}</Text>}
      </View>
      {config.includeArchive && data.archive.length > 0 && <View><Heading>{t.archive}</Heading>{data.archive.map((project, index) => <Text key={index}><Dots items={[project.name, project.year, project.url ? <Link src={project.url} style={s.link}>{t.repository}</Link> : null]} /></Text>)}</View>}
    </Page>
  </Document>;
}

export async function createPdfBlob(data: ResumeData) {
  registerPdfFonts();
  return pdf(<ResumePdf data={data} />).toBlob();
}
