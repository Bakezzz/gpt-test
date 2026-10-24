# MCF Visuals

A responsive creative portfolio concept with an interactive Three.js sculpture, scroll animation, project dialogs, capability accordions and a downloadable project brief.

## Run

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci --cache /tmp/mcf-npm-cache
npm run dev -- --port 3000
```

## Validate

```sh
npm run build
PLAYWRIGHT_BROWSERS_PATH=/tmp/mcf-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/tmp/mcf-browsers npm test
```

The tests cover desktop WebGL initialization, project dialogs, brief download, mobile navigation, viewport overflow and reduced motion. The tests automatically use `/usr/bin/chromium` when available. Otherwise install the Playwright browser above. You can also set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. On Linux, browser system libraries must be available.

## Content and contact

This is an original design concept. No client names, company history, awards, locations or contact details have been assumed. Project artwork is illustrative and labeled as concept work; the capability copy describes a proposed creative direction and should be confirmed before publication. Replace those concepts with approved MCF Visuals content before using this as an official portfolio.

The contact form creates a text-file brief locally. It does not submit, store or email personal information. Connect an approved contact address or form backend before offering direct enquiries. Fonts are bundled locally, with system fallbacks. All artwork is rendered locally using CSS and Three.js. The 3D scene has a static fallback, and animation respects reduced-motion preferences.
