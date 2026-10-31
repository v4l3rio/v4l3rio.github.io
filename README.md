# Valerio Di Zio

Personal portfolio and dynamically generated CV, maintained through English and Italian JSON files. English at `/`, Italian at `/it/`.

## Local preview

Requires Node.js 24+ and pnpm 10.17.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For the complete static version, including Italian and content without JavaScript:

```sh
pnpm build
pnpm preview
```

## Editing content

All current site and CV content lives in two JSON files:

- [`public/content/cv-it.json`](public/content/cv-it.json)
- [`public/content/cv-en.json`](public/content/cv-en.json)

Read [GUIDA-CONTENUTI.md](GUIDA-CONTENUTI.md) for the editing and publishing steps. You do not need to edit React, HTML or upload replacement PDFs.

The browser refreshes the current language JSON on page load. Each download fetches the chosen language JSON again and generates the PDF locally in the browser. The PDF renderer and fonts are loaded only when requested. No external PDF service receives the CV data.

`pnpm build` validates both JSON files, prerenders both pages and generates the static PDF fallbacks from the same data and the same renderer. These copies support direct PDF URLs and visitors without JavaScript. PDFs are build outputs, not separately maintained source files. Future content can flow onto more than two pages.

Structure and implementation:

- `src/resume-schema.ts`: content validation and JSON schema generation.
- `src/App.tsx`: page structure and interactions.
- `src/ResumePdf.tsx`: shared browser/build PDF renderer.
- `src/portfolio.css`: responsive website layout.
- `DESIGN.md`: visual direction.
- `QA.md`: recorded verification.

Cojeev was registered using `pnpm dlx shadcn@latest registry add @000h-cojeev`. Button, Accordion, ShapeArtwork and their dependencies were installed from that registry. Original components live in `src/components/ui`; tokens, styles, licensed fonts and motion helpers are under `src/styles` and `src/lib`. Fonts are served locally. The page does not load analytics, third-party fonts or a fake contact form. The former static site is retained in `legacy/` and is not included in the production build.

## GitHub Pages

`pnpm build` produces `dist/`, with prerendered HTML for both languages, assets and PDFs. The prepared workflow `.github/workflows/pages.yml` builds the `master` branch and deploys that folder.

The repository's **Settings → Pages → Source** must be **GitHub Actions**. A push to `master` then triggers the build and deployment workflow. Do not serve the source `index.html` directly using the old Jekyll deployment.

The professional certification is currently in preparation, with a target of late October 2026. Update that entry and its proof link only after the credential is obtained.

## Verification

`pnpm test` typechecks, builds both static language versions and runs the browser checks. On macOS the tests use the installed Google Chrome. On other systems, run `pnpm exec playwright install chromium` once before testing.

The checks cover both themes and languages at 320, 375, 768 and 1440px, contrast, keyboard navigation, menu, disclosures, PDF downloads, no-JavaScript content, zoom and reduced motion. External-link tests verify the opened address using controlled responses; they do not guarantee availability of third-party services.

See `QA.md` for the checks actually completed. Browser tests launch Chrome and include external-link popups; run them only when that is acceptable.
