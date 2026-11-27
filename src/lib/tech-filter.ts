import { createElement, Fragment, type ReactNode } from "react";
import type { ResumeData } from "../resume-schema";

type Job = ResumeData["experience"][number];
type Project = ResumeData["projects"][number];

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Whole-term, case-insensitive: "Java" is not in "JavaScript", "SQL" is not in "PostgreSQL", "CI/CD" and "Pub/Sub" match as written. */
const source = (term: string) => `(?<![\\p{L}\\p{N}])${escape(term)}(?![\\p{L}\\p{N}])`;

export const slugify = (name: string) => name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const jobId = (job: Pick<Job, "company">) => `work-${slugify(job.company)}`;
export const projectId = (project: Pick<Project, "name">) => `project-${slugify(project.name)}`;

export const mentions = (term: string, texts: (string | undefined)[]) => {
  const pattern = new RegExp(source(term), "iu");
  return texts.some(text => text !== undefined && pattern.test(text));
};

/** Text the filter looks at, mirrored by what the page highlights. */
export const jobTexts = (job: Job) => [job.role, ...job.details, ...(job.process ?? []), ...(job.stack ? [job.stack.title, ...job.stack.groups.flatMap(group => [group.label, ...group.items])] : [])];
export const projectTexts = (project: Project) => [project.tech, project.description, project.note, ...(project.process ?? [])];

/** Where a technology is used: jobs first, then projects. */
export function usedIn(term: string, data: Pick<ResumeData, "experience" | "projects">) {
  return [
    ...data.experience.filter(job => mentions(term, jobTexts(job))).map(job => ({ id: jobId(job), name: job.company })),
    ...data.projects.filter(project => mentions(term, projectTexts(project))).map(project => ({ id: projectId(project), name: project.name })),
  ];
}

/** Wraps every occurrence of the term in <mark>. Returns the plain string when no term is active. */
export function highlight(text: string, term: string | null): ReactNode {
  if (!term) return text;
  const parts = text.split(new RegExp(`(${source(term)})`, "iu"));
  if (parts.length === 1) return text;
  return createElement(Fragment, null, parts.map((part, index) => index % 2 ? createElement("mark", { key: index }, part) : part));
}
