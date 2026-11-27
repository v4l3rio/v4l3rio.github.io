import { z } from "zod";

const textKeys = ["skip", "navLabel", "menu", "close", "work", "projects", "about", "contact", "otherLanguage", "themeLight", "themeDark", "viewWork", "download", "location", "availability", "focus", "workIntro", "current", "workPrivacy", "skills", "skillsIntro", "projectsIntro", "thesis", "repository", "dataset", "documentation", "archive", "archiveIntro", "education", "degree", "university", "grade", "languages", "languageDetail", "interests", "interestsDetail", "qualifications", "credentials", "credential", "completion", "preparation", "target", "contactTitle", "contactCopy", "italianCV", "englishCV", "footer", "error", "errorCopy", "retry", "universityWork", "selectedProjects", "cvTitle", "cvFormat", "github", "linkedin", "home", "copyright", "preparingPdf", "downloadError", "contentError", "howIWorked", "filterByTech"] as const;
const textShape = Object.fromEntries(textKeys.map(key => [key, z.string()])) as Record<typeof textKeys[number], z.ZodString>;
const url = z.url().refine(value => /^https?:\/\//.test(value), "Use an http or https URL");
const project = z.object({ name: z.string().min(1), tech: z.string(), category: z.string(), description: z.string(), note: z.string().optional(), team: z.string().optional(), process: z.array(z.string()).optional(), hideInPdf: z.boolean().optional(), repo: url, proof: url.optional(), proofType: z.string().optional() });
const stack = z.object({ title: z.string().min(1), groups: z.array(z.object({ label: z.string().min(1), items: z.array(z.string().min(1)).min(1) })).min(1) });
export const resumeSchema = z.object({
  $schema: z.string().optional(),
  language: z.enum(["en", "it"]),
  text: z.object(textShape),
  metadata: z.object({ title: z.string(), description: z.string(), socialDescription: z.string() }),
  person: z.object({ name: z.string().min(1), role: z.string(), phone: z.string(), email: z.email(), githubLabel: z.string(), githubUrl: url, linkedinUrl: url, websiteUrl: url }),
  profile: z.array(z.string()),
  education: z.object({ date: z.string() }),
  filters: z.array(z.string().min(1)).optional(),
  experience: z.array(z.object({ company: z.string().min(1), role: z.string(), date: z.string(), details: z.array(z.string()), team: z.string().optional(), process: z.array(z.string()).optional(), stack: stack.optional() })),
  skills: z.array(z.object({ id: z.string().min(1), label: z.string(), value: z.string(), wide: z.boolean().optional() })),
  projects: z.array(project),
  archive: z.array(z.object({ name: z.string(), year: z.string(), url: url.optional() })),
  credentials: z.array(z.object({ title: z.string().min(1), issuer: z.string(), date: z.string(), url: url.optional(), credentialId: z.string().optional(), inPreparation: z.boolean().optional() })),
  pdf: z.object({ filename: z.string().regex(/^[a-zA-Z0-9_-]+\.pdf$/), title: z.string(), profileHeading: z.string(), experienceHeading: z.string(), skillsHeading: z.string(), projectsHeading: z.string(), credentialsHeading: z.string(), includeArchive: z.boolean(), includeInterests: z.boolean() }),
}).superRefine((data, ctx) => {
  // The web-only stack block may not list a service the skills section does not.
  const skills = data.skills.map(skill => skill.value.toLowerCase()).join("\n");
  data.experience.forEach((job, jobIndex) => job.stack?.groups.forEach((group, groupIndex) => group.items.forEach((item, itemIndex) => {
    if (!skills.includes(item.toLowerCase())) ctx.addIssue({ code: "custom", path: ["experience", jobIndex, "stack", "groups", groupIndex, "items", itemIndex], message: `"${item}" is not listed in skills` });
  })));
});
export type ResumeData = z.infer<typeof resumeSchema>;
