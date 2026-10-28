# BASUS International — redesign and release handoff

27 October 2026. **Local review build; not published.** The owner deferred the AI-image decision to stakeholders. This design uses no AI industrial imagery. Release still needs owner acceptance of the new design, final product scope and contact arrangements.

## Design and before/after

The supplied GIGA screenshot is a composition reference. BASUS retains its own logo, black/gold palette, product scope and commercial supplier model. No GIGA copy, product photography, specifications, customer logos or claims were reused.

| Previous design | New design |
| --- | --- |
| White hero with a large generated cable image | Charcoal hero with a large three-line proposition and an original SVG component concept |
| Condensed display type | Self-hosted Inter throughout, with compact monospace technical labels |
| Long alternating image/specification rows | Three product panels, clipped image corners and native expandable technical specifications |
| Multiple generated industrial images | Four original, explicitly illustrative SVG diagrams; no dimensions, ratings or production-drawing claims |
| Light quality section | Dark quality section with clear facility/project certification attribution |
| Large generated target-market map | Compact regional summaries with explicit developing-route status |
| Image-based social preview | Typography-based PNG social card with BASUS positioning |

The header uses the supplied dark BASUS logo. The official tagline remains in the hero, logo lockup and footer. White and neutral sections alternate with dark hero, quality and market sections. Product actions select the relevant enquiry category. The five-step process, industries, commercial model, developing markets, buyer benefits and full enquiry workflow remain available.

## Content preservation

The glossary and ADRs 0001/0002 remain the source of business terminology and scope. BASUS contracts as the commercial supplier; independent Indian manufacturing partners perform production. No owned factories, established foreign operations, completed projects, client relationships or BASUS certifications are implied.

Preserved technical content:

- Copper busbars: rigid/flexible configurations, ETP/OFC copper, aluminium by specification, CNC punching/bending/edge conditioning, tin/silver/nickel finishes and dielectric insulation.
- HV/LV cable assemblies: schematics, conductor routing, gauges, shielding, industrial connectors, temperature insulation and project-specific electrical test review.
- Interconnects: flexible copper braids, laminated copper foil connectors, press-welded and press-fit terminals, thermal expansion, vibration and dynamic stresses. Feasibility remains subject to drawings and the selected partner.
- Applications: EV charging, BESS, industrial electrification, switchgear/power equipment and electrical OEM systems. Cooling requirements remain subject to project feasibility.
- Quality: ISO 9001, IATF 16949, ISO 14001, IEC/UL/DIN criteria and PPAP are subject to relevant facility, product and project scope. Documentary evidence remains necessary before a compliance commitment.
- Europe, UK, Middle East, North America and other markets remain developing routes or under evaluation.

Specifications now use native HTML `details` elements. They work with a mouse, keyboard or disabled JavaScript; they are present in the HTML for search engines.

## Asset decisions

The owner confirmed the supplied logo may be used. The original AI industrial images are retained in the source repository for stakeholder review, but are absent from the page and deployment package. This includes the previous hero, product imagery, market map and social preview.

New visuals are `assets/diagrams/hero.svg`, `busbar.svg`, `cable.svg` and `interconnect.svg`. These are simple concept illustrations with no dimensional or performance claims. They are not verified production designs. The social card is `assets/social-card.png` (1200 × 630). It contains typography only.

No external image service, runtime library, framework, third-party font request, analytics or form collection service was added. Only the used Inter font and its OFL license are included in the public package.

## Verification

Preview: `http://127.0.0.1:8766/`.

```sh
python3 tests/check-site.py
node --check main.js
python3 scripts/package-site.py
git diff --check
```

Browser checks use the existing Playwright scripts and the available bundled runtime:

```sh
NODE_PATH=/Users/sainul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/browser-checks.cjs
NODE_PATH=/Users/sainul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/cross-browser-checks.cjs
```

Chrome covers 1920, 1440, 1280, 1100, 1024, 820, 768, 760, 430, 390, 360 and 320px. Checks cover overflow, assets, section links, menu operation, reduced motion, hero illustration boundaries, product selection, keyboard-operated technical specifications, form validation, optional quantity/destination fields, encoded email drafts, clipboard success/denial, long drafts, stale drafts, schema and no-JavaScript navigation/specifications. Firefox and WebKit cover 1440, 820, 390, 360 and 320px for layout, images, navigation and enquiry generation.

Visual review covered desktop/mobile hero, type scale, gold contrast, diagram placement, three-column product alignment, the dark quality section and contact layout. A tablet hero-caption overlap was corrected and a boundary assertion added.

Axe scans at 1440px and 390px found no violations of the tested WCAG A/AA rules, including WCAG 2.2 AA tags. Evidence: `output/playwright/reference-axe-1440.json` and `reference-axe-390.json`. Automated scans do not prove complete accessibility conformance.

Current screenshots use the `reference-*` prefix in `output/playwright/`; browser regression results are in `test-results.json` and `cross-browser-results.json`. Earlier screenshots and reports describe earlier designs and must not be used as evidence for this release.

Local Lighthouse on this redesign (standard Python preview, simulated throttling):

| Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | Blocking time |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 100 | 100 | 100 | 100 | 1.6s | 0 | 0ms |
| Desktop | 100 | 100 | 100 | 100 | 0.4s | 0 | 0ms |

Reports: `output/playwright/reference-mobile.report.html` and `reference-desktop.report.html`. These are local lab measurements, not production results. The local server does not apply deployment response headers. Recheck after release.

## Enquiry and release limits

The form prepares an email draft. It does not send data or upload drawings. The buyer reviews and sends through an email application or copies into webmail. Quantity and delivery destination are optional. Long drafts use the copy path; clipboard failure selects the draft for manual copying. The submit action stays disabled when JavaScript is unavailable, with a direct email fallback.

Real inbox delivery, attachments, phone email clients and physical mobile devices have not been tested. Confirm that `info@basusinternational.com` is monitored. Agree a channel for confidential drawings and the actual privacy/retention policy. The existing LinkedIn URL still requires owner verification. No message was sent during tests.

Optional verified trust information to supply later: legal entity name, registration number, registered address, business telephone and approved partner documentation. No missing business details were invented.

## Deployment

The connected Netlify project was read-only verified earlier in this session:

- Project: `basusin`
- Site ID: `cb419ea8-2266-4ed1-9c37-02f3e4aee15b`
- Primary domain: `https://basusinternational.com`
- Published deploy at that check: `6accf4178f2fe3fa13dccff4`

Canonical, Organization schema, social URLs, sitemap and robots use the primary domain. Earlier live checks confirmed HTTP 200 for the homepage/crawl files and a www-to-apex redirect. This redesign has not changed the public site. Search indexing and production Core Web Vitals are unverified.

Generate the deployable folder and ZIP with `python3 scripts/package-site.py`. Publish only `dist/site/`, not the repository. There is no build step, database or runtime credential requirement. The package excludes internal documentation, tests, QA screenshots, source AI images and unused fonts. `_headers` and `404.html` are included; a non-Netlify host needs equivalent response-header and missing-page configuration. The local Python preview does not apply `_headers`.

After owner review, use the existing authenticated Netlify CLI against the confirmed project:

```sh
netlify deploy --dir=dist/site --site=cb419ea8-2266-4ed1-9c37-02f3e4aee15b
```

Inspect the draft URL before publishing. Drafts are shareable; do not submit their URLs to Search Console. With final release authorization:

```sh
netlify deploy --prod --dir=dist/site --site=cb419ea8-2266-4ed1-9c37-02f3e4aee15b
```

A subsequent production-branch push may replace a manual deploy if Git deployment is configured. Confirm that workflow before release. Do not change DNS or create a replacement project.

After publishing, check homepage/assets/crawl-file HTTP 200, unknown-page HTTP 404, HTTPS, www redirect, CSP/security headers, compression, fonts, social image, desktop/mobile layouts, menu, technical disclosures and the email workflow. Run Lighthouse on the public domain. Use the owner's Search Console account to inspect the canonical URL and sitemap. A local pass does not establish production performance or indexing.
