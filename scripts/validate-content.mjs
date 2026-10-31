import { readFile, writeFile } from "node:fs/promises";
import { z } from "zod";
import { resumeSchema } from "../src/resume-schema.ts";

let invalid = false;
for (const language of ["en", "it"]) {
  const filename = `public/content/cv-${language}.json`;
  try {
    const result = resumeSchema.safeParse(JSON.parse(await readFile(filename, "utf8")));
    if (!result.success) throw new Error(z.prettifyError(result.error));
    if (result.data.language !== language) throw new Error(`language must be ${language}`);
    const ids = result.data.skills.map(skill => skill.id);
    if (new Set(ids).size !== ids.length) throw new Error("Each skill group needs a unique id");
    console.log(`Validated ${filename}`);
  } catch (error) {
    console.error(`${filename}: ${error.message}`);
    invalid = true;
  }
}
if (invalid) process.exit(1);
await writeFile("public/content/resume.schema.json", JSON.stringify(z.toJSONSchema(resumeSchema), null, 2) + "\n");
