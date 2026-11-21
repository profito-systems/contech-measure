# Contech Measure / Miarka Profito

Historical Miarka / Contech development source, preserved for reproducibility and Git history. The current public Miarka application and its release owner are in the personal Profito Systems website repository, not this organisation's GitHub Pages.

**Current live visitor path:** https://mattmurz.github.io/miarka/

**Current public release source:** https://github.com/MattMurz/mattmurz.github.io/tree/main/miarka

This is a provenance statement, not a completed repository transfer, archive, redirect, or deletion.

## Current measurement model

Miarka v2 can calibrate a photograph from:

- A4 or A5 paper
- an ISO/IEC 7810 ID-1 sized card, 85.60 × 53.98 mm
- brick faces with editable nominal dimensions
- blocks, tiles, phones, books or other rectangles with two known dimensions
- one known segment for front-facing planes only

The card option is intended for non-sensitive objects such as loyalty, gift or access cards in the standard ID-1 format. Users should not photograph payment-card details or identity-document data.

After calibration the UI can measure two line segments on the same physical plane as the reference object and calculate a rectangular area. A manual four-corner mode is available when automatic rectangle detection is unreliable.

## Accuracy boundary

This is a practical estimation tool, not a surveying instrument. Perspective correction assumes the reference object and measured points are on the same flat plane. Measurements spanning different planes, curved surfaces or strong depth changes are not reliable.

## Development

Run:

npm run check

The checks validate syntax, assembly, reference geometry and loader regression cases. Run npm run test:browser with Playwright installed for desktop and touch smoke tests. See docs/REFERENCE_RESEARCH.md for sources, results and limits.

## Source of truth and planned retirement

- **Single public deployment owner:** `MattMurz/mattmurz.github.io` (main), serving `/miarka/`. Keep the Profito homepage, Miarka and Profito Local under the existing personal site until a separately reviewed release changes this.
- **Historical development and research owner:** this `profito-systems/contech-measure` repository. Its `main` and `gh-pages` history are retained and must remain accessible until an owner-approved transfer or complete Git backup has been independently verified.
- **Measured code overlap (17 November 2026):** `src/cv/detectA4.js`, `src/cv/opencv-loader.js`, `src/cv/warp.js`, `src/ui/konvaLayer.js`, `public/sample-a4.jpg` and `scripts/measurement.test.mjs` have matching Git blob hashes with their corresponding paths in the personal Profito repository. Do not copy the old module wholesale.
- **Differences to preserve:** the public `miarka/` adds multilingual UI and website integrations. The longer research record in the personal repository `docs/MIARKA_REFERENCE_RESEARCH.md` contains the original material from `docs/REFERENCE_RESEARCH.md` plus follow-up results. The old `scripts/check-detect-a4-geometry.mjs` is covered by the broader public `scripts/check-reference-geometry.mjs`, which also checks the card and output geometry. Preserve the historical script in this Git history, not as a duplicate current test.
- **Deployment drift:** `.github/workflows/deploy.yml` on organisation `main` currently pushes forcibly to `gh-pages`. The existing Draft PR #16 disables the redundant legacy publishing workflow. It is not merged yet, and `gh-pages` must not be removed merely because the current business host is elsewhere.
- **Organisation retirement is not yet complete.** Before transferring or removing it, inventory branches, tags, Pages, links, Git history, collaborators and any other dependencies; capture a restorable Git backup with full commit history; verify independent readback, and obtain explicit approval for the destructive final action. A ZIP of `main` does **not** preserve repository history.
- **No irreversible actions in this README update.** No renaming of the Profito public hostname, domain switch, GitHub Pages deployment, organisation deletion, customer-photo publication, new runner, secret, or cloud billable service.

For current interface, release tests and safety guidance, see the existing Profito public ownership document:
https://github.com/MattMurz/mattmurz.github.io/blob/main/docs/PROFITO_PUBLIC_MODULE_OWNERSHIP_2026-11-15.md

