import en from "../public/content/cv-en.json" with { type: "json" };
import it from "../public/content/cv-it.json" with { type: "json" };
import { resumeSchema, type ResumeData } from "./resume-schema";

export type Language = "en" | "it";
export type { ResumeData };
export const content: Record<Language, ResumeData> = { en: resumeSchema.parse(en), it: resumeSchema.parse(it) };
export const getContent = (language: Language) => content[language];
export const copy = { en: { ...content.en.text, profile: content.en.profile }, it: { ...content.it.text, profile: content.it.profile } };
export const links = { email: `mailto:${en.person.email}`, github: en.person.githubUrl, linkedin: en.person.linkedinUrl, cv: { en: `/cv/${en.pdf.filename}`, it: `/cv/${it.pdf.filename}` } };

export async function loadContent(language: Language): Promise<ResumeData> {
  const response = await fetch(`/content/cv-${language}.json`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
  const data = resumeSchema.parse(await response.json());
  if (data.language !== language) throw new Error("Content language does not match the requested language");
  return data;
}
