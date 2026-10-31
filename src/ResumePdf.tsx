import { Document, Page, Text, View, Link, Font, StyleSheet, pdf } from "@react-pdf/renderer";
import type { ResumeData } from "./content";

let registeredBase: string | undefined;
export function registerPdfFonts(base = "/fonts/cv") {
  if (registeredBase === base) return;
  registeredBase = base;
  Font.register({ family: "CV", fonts: [
    { src: `${base}/DMSans-regular.ttf`, fontWeight: 400 },
    { src: `${base}/DMSans-bold.ttf`, fontWeight: 700 },
  ] });
  Font.registerHyphenationCallback(word => [word]);
}

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 38, paddingHorizontal: 40, fontFamily: "CV", fontSize: 10.8, lineHeight: "14.5pt", color: "#20252b" },
  header: { borderBottomWidth: 1, borderBottomColor: "#20252b", paddingBottom: 8, marginBottom: 0 },
  name: { fontSize: 29, fontWeight: 700, lineHeight: "34pt" },
  role: { fontSize: 13, color: "#184768", fontWeight: 700, marginTop: 3, marginBottom: 5 },
  contact: { fontSize: 8.6, lineHeight: "11pt", color: "#515b66", marginTop: 2 },
  title: { fontSize: 14.5, fontWeight: 700, color: "#184768", borderBottomWidth: .5, borderBottomColor: "#aab6bf", paddingBottom: 4, marginBottom: 6, marginTop: 6 },
  paragraph: { marginBottom: 4 },
  education: { marginTop: 4, marginBottom: 2 },
  eyebrow: { fontSize: 9.6, color: "#515b66", fontWeight: 700 },
  heading: { fontSize: 11.2, fontWeight: 700, lineHeight: "14pt" },
  meta: { fontSize: 9.3, lineHeight: "12pt", color: "#515b66", marginTop: 2, marginBottom: 4 },
  job: { marginBottom: 6 },
  bullet: { flexDirection: "row", marginBottom: 2 },
  marker: { width: 11 },
  bulletText: { flex: 1 },
  credential: { marginBottom: 3 },
  credentialTitle: { fontWeight: 700, fontSize: 10.5 },
  credentialMeta: { fontSize: 9.2, lineHeight: "11pt", color: "#515b66", marginTop: 1 },
  skill: { marginBottom: 4.5, lineHeight: "15pt" },
  bold: { fontWeight: 700 },
  project: { marginBottom: 7 },
  projectMeta: { fontSize: 9.3, lineHeight: "12pt", color: "#515b66", marginTop: 2, marginBottom: 3 },
  projectLinks: { fontSize: 9.2, marginTop: 3 },
  link: { color: "#184768", textDecoration: "underline" },
});

const clean = (text: string) => text.replace(/[\u2011\u2013\u2014]/g, "-");
function Heading({ children }: { children: string }) {
  return <Text style={s.title} minPresenceAhead={35}>{children}</Text>;
}

export function ResumePdf({ data }: { data: ResumeData }) {
  const { text: t, person, pdf: config } = data;
  return <Document title={`${person.name} - ${config.title}`} author={person.name} language={data.language}>
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        <Text style={s.name}>{person.name}</Text><Text style={s.role}>{person.role}</Text>
        <Text style={s.contact}>{t.location} | {person.phone} | <Link style={s.link} src={`mailto:${person.email}`}>{person.email}</Link></Text>
        <Text style={s.contact}><Link style={s.link} src={person.linkedinUrl}>{person.linkedinUrl.replace(/^https?:\/\//, "")}</Link> | <Link style={s.link} src={person.githubUrl}>{person.githubUrl.replace(/^https?:\/\//, "")}</Link> | <Link style={s.link} src={person.websiteUrl}>{person.websiteUrl.replace(/^https?:\/\//, "")}</Link></Text>
      </View>
      <Heading>{config.profileHeading}</Heading>
      {data.profile.map((paragraph, index) => <Text key={index} style={s.paragraph}>{paragraph}</Text>)}
      <View style={s.education} wrap={false}>
        <Text style={s.eyebrow}>{t.education}</Text><Text style={s.heading}>{t.degree}</Text>
        <Text style={s.meta}>{t.university} | {clean(data.education.date)} | {t.grade}</Text>
      </View>
      {data.experience.length > 0 && <Heading>{config.experienceHeading}</Heading>}
      {data.experience.map((job, index) => <View key={index} style={s.job}>
        <Text style={s.heading} minPresenceAhead={35}>{job.role}</Text>
        <Text style={s.meta}><Text style={s.bold}>{job.company}</Text> | {clean(job.date)}</Text>
        {job.details.length === 1 ? <Text>{job.details[0]}</Text> : job.details.map((detail, index) => <View key={index} style={s.bullet}><Text style={s.marker}>•</Text><Text style={s.bulletText}>{detail}</Text></View>)}
      </View>)}
      {data.credentials.length > 0 && <Heading>{config.credentialsHeading}</Heading>}
      {data.credentials.map((credential, index) => <View key={index} style={s.credential} wrap={false}>
        <Text style={s.credentialTitle}>{credential.title}</Text>
        <Text style={s.credentialMeta}>{credential.issuer} | {credential.inPreparation ? `${t.preparation} | ` : ""}{clean(credential.date)}{credential.credentialId ? ` | ID: ${credential.credentialId}` : ""}{credential.url ? <> | <Link src={credential.url} style={s.link}>{t.credential}</Link></> : null}</Text>
      </View>)}
    </Page>
    <Page size="A4" style={s.page}>
      {data.skills.length > 0 && <Heading>{config.skillsHeading}</Heading>}
      {data.skills.map(skill => <Text key={skill.id} style={s.skill}><Text style={s.bold}>{skill.label}: </Text>{skill.value}</Text>)}
      {data.projects.length > 0 && <Heading>{config.projectsHeading}</Heading>}
      {data.projects.map((project, index) => <View key={index} style={s.project}>
        <Text style={s.heading} minPresenceAhead={40}>{project.name}, {project.category}</Text>
        <Text style={s.projectMeta}>{project.tech}</Text>
        <Text>{project.description}{project.note ? ` ${project.note}` : ""}</Text>
        <Text style={s.projectLinks}><Link src={project.repo} style={s.link}>{t.repository}</Link>{project.proof ? <> | <Link src={project.proof} style={s.link}>{project.proofType === "dataset" ? t.dataset : t.documentation}</Link></> : null}</Text>
      </View>)}
      <View wrap={false}><Heading>{t.languages}</Heading><Text>{t.languageDetail}</Text><Text style={s.meta}>{t.availability}</Text></View>
      {config.includeInterests && <View wrap={false}><Heading>{t.interests}</Heading><Text>{t.interestsDetail}</Text></View>}
      {config.includeArchive && data.archive.length > 0 && <View><Heading>{t.archive}</Heading>{data.archive.map((project, index) => <Text key={index}>{project.name} | {project.year}{project.url ? <> | <Link src={project.url} style={s.link}>{t.repository}</Link></> : null}</Text>)}</View>}
    </Page>
  </Document>;
}

export async function createPdfBlob(data: ResumeData) {
  registerPdfFonts();
  return pdf(<ResumePdf data={data} />).toBlob();
}
