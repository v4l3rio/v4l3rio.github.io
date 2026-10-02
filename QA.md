# Verification, 2 October 2026

## Completed checks

- `pnpm build` passes after the archive spacing correction: TypeScript, production assets and prerendered English/Italian HTML.
- The staged application files pass `git diff --cached --check`. Archived HTML and original font licenses retain their existing whitespace and line endings.
- The earlier browser run recorded 12 passing tests, no skipped tests and no failures in `.qa/results.json` (start: 09:36 UTC). It covered both languages and themes at 320, 375, 768 and 1440px, accessibility, keyboard controls, navigation, disclosures, local PDF downloads, no-JavaScript content, zoom and reduced motion.
- The earlier click-through exercised the skip link, section anchors, project CTA, three CV download actions, archive Enter/Space, theme toggle and persistence, mobile-menu Escape/destination closure, home link, language link, email action and 14 external destinations per language.
- External-link checks used controlled responses to verify click behavior and destination addresses. They did not establish availability of third-party services.
- The open archive's foreground `#14171B` on `#F0A4CC` has a calculated contrast ratio of 9.32:1 in both themes.
- Generated files, browser artifacts and dependencies are ignored. A source scan found no private-key blocks or common GitHub/Google API token formats.

## Archive correction

The later correction restores shared 20 to 32px horizontal insets, keeps separators inside the rounded panel and replaces the illustration-width column with a text column of at least 220px. Below 761px the introduction sits above the project list. Content and links inherit the open panel's foreground color instead of dark-theme muted text.

The test source now checks the expanded archive's insets, column width, stacking, bottom clearance, overflow and accessibility in every language/theme/width combination. These new assertions have been typechecked but have not been run in a browser. The earlier 12-test result does not verify this final correction. No further browser sessions were launched after the request to stop them; the final visual check remains outstanding.

## Build warning

Vite reports a main JavaScript chunk above 500kB before compression. The build succeeds. No loading-performance or Lighthouse score is claimed.
