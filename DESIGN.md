# Valerio Di Zio, personal portfolio

## Product intent

This is an existing public portfolio, updated from the approved October 2026 CV. Readers are recruiters, technical colleagues and prospective collaborators arriving from a CV, LinkedIn or GitHub. Their first decision is whether Valerio's experience fits their needs; their next actions are reading the work, checking public repositories, downloading a CV or contacting him.

## Direction

User-selected source: Cojeev UI, installed through `pnpm dlx shadcn@latest registry add @000h-cojeev`. Use its real components and self-hosted typography, not an imitation. Reading this as a personal developer portfolio with Cojeev's warm editorial language. ENERGY 2 / RHYTHM 2 / MOTION 2.

- Typography: Bricolage Grotesque provides a recognizable, personable name and heading voice; DM Sans keeps longer technical descriptions easy to read.
- Color: Cojeev Paper canvas and ink, with olive as the single editorial accent; both light and dark modes must meet AA contrast.
- Hierarchy: name and role first, current work second, then repositories as evidence, qualifications and contact.
- Layout: a wide introduction, an experience list, a highlighted thesis followed by project rows, and a compact qualifications area. Content does not need a uniform wall of cards.
- Spacing: generous section gaps separate topics; tighter title/metadata gaps keep each record together.
- Project archive: its header and content share 20–32px side insets, keeping separators clear of the rounded panel. The introduction gets a readable column of at least 220px on desktop; below 761px it sits above the list. Open-panel text inherits Cojeev's accent foreground in both themes.
- Illustration: one authored Cojeev cloud shape links the chosen visual system to Cloud Developer, without pretending to be a portrait, diagram or company logo.
- Icons: only controls with a clear meaning, such as theme, menu, download and external destinations.
- Motion: short disclosure and theme transitions explain state changes; content is never hidden behind scroll animation. Respect reduced motion.
- Header controls and outlined downloads use Cojeev's quiet mode for stable contrast and complete borders; filled-button motion is clipped within its hit area under zoom. The primary action stays ink/canvas in both modes, preserving olive as the single accent.

## Scope and content

English and Italian, with downloadable ATS CVs in both languages. Preserve FairLib, PositionPal, NesGen and Scooby. Older projects remain in a small archive, not as the page's main professional evidence. Show only the MSc in the main education record. Avoid private clients, metrics without evidence, student status, inflated skill claims, Terraform and named container engines. FairLib includes pre-processing and in-processing, not implemented post-processing. The professional certification is in preparation, not obtained or booked. Certifications have exact dates and proof links where supplied.

## Interaction and state plan

Navigation anchors, project disclosures, language switch, light/dark switch, native email link and PDF downloads all have real destinations or state changes. Content is local and prerendered, so no synthetic loading/empty states for nonexistent fetching. A recoverable error boundary and useful no-JavaScript content protect the main reader journey. On narrow screens the menu opens in normal flow, closes on destination/Escape, and retains visible focus. Mobile actions are at least 44px tall.

## Verification and deployment

Typecheck, production build, static HTML check and browser click-through at 320, 375, 768 and 1440px; both languages, both themes, keyboard, reduced motion, contrast, console, local PDFs and link targets. Test the production preview, not just development mode. Keep an element-by-element record in `QA.md`. The build outputs a static `dist` for GitHub Pages. A workflow may be prepared locally; publication and repository settings changes are not authorized by this request.
