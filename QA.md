# Verification, 2 October 2026

## Archive hover correction, 16 October 2026

- Removed the header hover fill so the archive remains one continuous panel surface, open or closed, in both themes. Keyboard focus and disclosure behavior are preserved.
- `pnpm build` passes. All eight layout/accessibility checks pass across both languages, both themes and 320, 375, 768 and 1440px. A direct pointer-hover check confirms identical paint before/after hover for the open/closed panel in both themes; the current light-mode screenshot was visually inspected.

## Profile and UI refinement, 16 October 2026

- Updated both introductions: a more natural opening, current Google Cloud work without the employer name, and graduation explicitly dated 2025. CV HTML, portfolio copy and prerendered text agree.
- Split the website toolkit into everyday work and other technologies used in projects and earlier roles. The user confirmed Kotlin, Scala, Angular, gRPC, RabbitMQ, PostgreSQL, Akka, TensorFlow and PyTorch; Angular moved out of the everyday group.
- Replaced the pink open archive with a neutral theme-aware surface, plain chevron, subtle hover and inset keyboard focus. The hover background does not interpolate across themes, preserving contrast during immediate switches.
- Added regression coverage for the same surface before/after opening, no background image, clearance below the header and the inset keyboard focus indicator. Existing accessibility checks still cover closed and expanded states in both themes.
- Inspected current desktop toolkit and open archive screenshots in light/dark mode, including the narrow dark layout. Both PDF languages remain two A4 pages with all 55 text blocks, 12 links, embedded fonts and tagged structure; all four rendered pages passed visual and geometry checks.
- Current PDF hashes, identical in the local output, repository and production build: English `b9694d4dd24f5f44dfb061077449ab258437960770e5fa2ec28ee1048a05992d`; Italian `07d842e4609ef19d24e8522e6c586f2b1298019b5d4f7a022538e526bbe913d7`.
- Final validation: `pnpm build` and all 12 Playwright tests pass, including the new archive regressions, both languages/themes, mobile layouts, accessibility, keyboard actions, PDF downloads, no-JavaScript content, zoom and reduced motion. Only the pre-existing bundle-size warning remains.

## Personal profile update, 16 October 2026

- Replaced the Italian introduction with the user-approved presentation, including cooking, video games and spending time with others; updated the English translation to match.
- Regenerated both downloadable PDFs from the CV HTML sources. Each retains two A4 pages, all 55 text blocks, 12 links, embedded fonts and tagged structure. All four pages were rendered with Poppler and visually reviewed; geometry checks found no overlapping words or content outside the page.
- Local approved PDFs, repository copies and production downloads are byte-identical. SHA-256: English `c142a92069acd18ea0960ba22cf96fc12fc52fbbd99280c7d3f8cd8dfc64a3fe`; Italian `e2944d1d05b4a9009c8a63f3c8223cbcd2b945b6b4ae1bcba47329f72b68b456`.
- The initial browser run exposed pre-existing horizontal overflow in the English About section at 320 and 375px, reproduced with the previous introduction. The grade text now wraps on mobile instead of forcing the grid wider than the viewport.
- Final `pnpm test`: all 12 tests pass after the correction. Coverage includes both languages and themes at 320, 375, 768 and 1440px, accessibility, expanded archive spacing, navigation, downloads, keyboard controls, no-JavaScript content, zoom and reduced motion. The production build passes with the existing bundle-size warning.

## CV alignment, 3 October 2026

- `pnpm build` passes: TypeScript, production assets and prerendered English/Italian HTML. The existing bundle-size warning remains.
- Both prerendered summaries exactly match the approved CV HTML. Each toolkit contains six labelled definitions separating language, frameworks/libraries/SDKs, Google Cloud services, tools, development practices and architectures.
- Angular is explicitly previous experience. No DDD, TDD, Terraform, named container engine or generic Google AI skill was added. The English education record explains the original 110/110 cum laude grade without fabricating a GPA.
- Static checks confirm that every section anchor has a destination, all four selected projects remain, and all three CV download actions point to the two existing PDF files in the production build.
- The approved PDFs, repository copies and built downloads are byte-identical. SHA-256: English `e5ddc84248b281e4a325c875e62c762bb864cac32bb7ef661839d6f42569892e`; Italian `c98a5cfa9c946dc02de5bd5628f7e2e87b6dcb311b20b9942dfa463199e40f74`.
- Typography, CSS, controls and the established responsive rules were not changed. No browser sessions or browser tests were launched. Static/build checks do not establish the visual layout of the longer text in either theme or viewport.

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
