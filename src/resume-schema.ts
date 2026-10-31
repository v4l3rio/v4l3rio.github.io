import { z } from "zod";

const textKeys = ["skip", "navLabel", "menu", "close", "work", "projects", "about", "contact", "otherLanguage", "themeLight", "themeDark", "viewWork", "download", "location", "availability", "focus", "workIntro", "current", "workPrivacy", "skills", "skillsIntro", "projectsIntro", "thesis", "repository", "dataset", "documentation", "archive", "archiveIntro", "education", "degree", "university", "grade", "languages", "languageDetail", "interests", "interestsDetail", "qualifications", "credentials", "credential", "completion", "preparation", "target", "contactTitle", "contactCopy", "italianCV", "englishCV", "footer", "error", "errorCopy", "retry", "universityWork", "selectedProjects", "cvTitle", "cvFormat", "github", "linkedin", "home", "copyright", "preparingPdf", "downloadError", "contentError"] as const;
const textShape = Object.fromEntries(textKeys.map(key => [key, z.string()])) as Record<typeof textKeys[number], z.ZodString>;
const url = z.url().refine(value => /^https?:\/\//.test(value), "Use an http or https URL");
const project = z.object({ name: z.string().min(1), tech: z.string(), category: z.string(), description: z.string(), note: z.string().optional(), repo: url, proof: url.optional(), proofType: z.string().optional() });
export const resumeSchema = z.object({
  $schema: z.string().optional(),
  language: z.enum(["en", "it"]),
  text: z.object(textShape),
  metadata: z.object({ title: z.string(), description: z.string(), socialDescription: z.string() }),
  person: z.object({ name: z.string().min(1), role: z.string(), phone: z.string(), email: z.email(), githubLabel: z.string(), githubUrl: url, linkedinUrl: url, websiteUrl: url }),
  profile: z.array(z.string()),
  education: z.object({ date: z.string() }),
  experience: z.array(z.object({ company: z.string().min(1), role: z.string(), date: z.string(), details: z.array(z.string()) })),
  skills: z.array(z.object({ id: z.string().min(1), label: z.string(), value: z.string(), wide: z.boolean().optional() })),
  projects: z.array(project),
  archive: z.array(z.object({ name: z.string(), year: z.string(), url: url.optional() })),
  credentials: z.array(z.object({ title: z.string().min(1), issuer: z.string(), date: z.string(), url: url.optional(), credentialId: z.string().optional(), inPreparation: z.boolean().optional() })),
  pdf: z.object({ filename: z.string().regex(/^[a-zA-Z0-9_-]+\.pdf$/), title: z.string(), profileHeading: z.string(), experienceHeading: z.string(), skillsHeading: z.string(), projectsHeading: z.string(), credentialsHeading: z.string(), includeArchive: z.boolean(), includeInterests: z.boolean() }),
});
export type ResumeData = z.infer<typeof resumeSchema>;
