# BASUS International — launch handoff

Prepared on 27 October 2026. The redesigned site is implemented locally. It has not been deployed. The existing public site still has the earlier India–Europe sourcing copy; this handoff does not describe that version as updated.

## A. Website and design

The site remains static HTML, CSS and JavaScript. There is no application framework, package install, database or form service required to run it.

- White and warm off-white reading surfaces, charcoal market and trust sections, restrained metallic gold accents.
- Existing BASUS logos retained. WebP derivatives trim empty margins, so the full brand lockup and tagline are legible in the header and footer.
- Four primary navigation links and one enquiry action. All sections remain accessible from the footer; mobile navigation includes all major sections.
- Hero image remains visible on mobile. A three-part product index links directly to each product.
- Alternating image and specification layouts for the three product lines. Industry information uses compact rows; the supply process uses numbered steps.
- Consistent heading sizes, form controls, borders and page gutters. Visible keyboard focus, a skip link and reduced-motion support.
- No scroll animations hide page content. Navigation uses native fragment links, so section URLs, history and no-JavaScript navigation remain usable.

Files: `index.html`, `style.css`, `main.js`, `assets/`, `404.html`, `_headers`, `robots.txt` and `sitemap.xml`. The existing glossary and both ADRs remain the business reference.

## B. Content and factual positioning

The page now answers buyer questions in this order: products → commercial supplier model → quality → supply process → applications → developing markets → why BASUS → enquiry.

The core content is retained:

- Busbars: rigid and flexible assemblies; ETP/OFC copper; aluminium by specification; CNC punching, bending, edge conditioning, tin/silver/nickel plating and dielectric insulation.
- HV/LV assemblies: routing, shielding, wire gauges, temperature insulation, industrial connectors and customer schematics.
- Interconnects: laminated copper connectors, braided flexible jumpers, press-fit terminals, thermal expansion, vibration and dynamic stress inputs.
- EV charging, BESS, industrial electrification, power equipment and other electrical OEM applications.
- Vision, mission, technical review, partner qualification, quotation, quality documentation, production follow-up and cross-border supply.
- Europe, UK, Middle East, North America and other markets, explicitly presented as routes under development or evaluation.

The introduction states that BASUS is the commercial supplier and that independent Indian partners perform production. It does not claim ownership of factories. ISO 9001, IATF 16949, ISO 14001, IEC, UL, DIN and PPAP references are project-specific review criteria, not BASUS certification claims. Test evidence and applicability must be confirmed for the relevant facility and product. Liquid-/air-cooled cable requirements are flagged for feasibility review. Incoterms are included in quotation and buyer-input guidance.

No testimonials, customer logos, export records, capacities, offices, partner names or certification badges were added. Schema `areaServed` was removed to avoid suggesting an established international footprint.

## C. Audit findings and repairs

| Priority | Existing issue | Repair |
| --- | --- | --- |
| High | `novalidate` and an unchecked submit handler permitted empty or invalid enquiries | Native required/email validation, whitespace checks, length limits and a reviewable draft |
| High | Company, partner and market statements could be read as broader evidence of established operations | Early supplier explanation; facility/project qualifications; clear route-development status |
| Medium | Supplied logo was displayed at 36px high including large empty margins | Optimized derivatives with proportionate dimensions and legible display sizes |
| Medium | Eight navigation links crowded intermediate widths; mobile menu used hidden visual state without full focus handling | Earlier mobile breakpoint, real `hidden` state, Escape/focus/outside-click closure and resize reset |
| Medium | Hero image was hidden below 1024px; three product images were not referenced | Responsive hero and all three accurate product images with descriptive alt text |
| Medium | Small, low-contrast text on light and dark surfaces | Larger reading text, stronger contrast, shared tokens and focus states |
| Medium | External font request was duplicated in HTML and CSS | Self-hosted, Latin-subset WOFF2 fonts with local fallbacks and OFL licenses |
| Medium | Reveal/scroll JavaScript added hidden-content and reduced-motion risks | Content is visible by default; native anchors and CSS reduced-motion handling |
| Medium | WebKit allowed long native selector options to extend the 320px page scroll area | Clipped overflow on the selector itself; retained the native control and added a cross-browser regression check |
| Low | Accessible names overrode visible email/LinkedIn link text | Removed redundant labels and made LinkedIn explicit in the visible link |
| Low | Original JPEG downloads were large; social metadata used a wide-padded logo image | Responsive WebP variants and a dedicated 1200 × 630 social image |
| Low | No site-specific missing-page experience or deployment headers | Branded 404 page and a Netlify-compatible `_headers` file |

The source tree had local edits before this work: changes to HTML/CSS and logos, four untracked industrial images, and a deletion of `assets/basus-icon.jpg`. Those starting changes were preserved. No commit, push or production deployment was made.

### Asset review

All supplied files were inspected, including the light and dark logos and metallic symbol. All five named industrial references exist and match their intended categories. No referenced asset is missing; asset names use consistent case.

| Original | Source dimensions | Public use |
| --- | --- | --- |
| `basus-logo.jpeg` | 1376 × 768 | Cropped-margin WebP brand lockup; original retained |
| `basus-logo-dark.jpg` | 1376 × 768 | Dark WebP lockup; original retained |
| `basus_icon1.jpg` | 1024 × 1024 | Retained source symbol; existing 64 × 64 favicon already uses the mark |
| `hero-bg.jpg` | 1376 × 768 | Responsive 640/768/960/1200px WebP variants |
| `busbar-pillar.jpg` | 1200 × 896 | Responsive 480/768/960px WebP variants |
| `cable-harness-pillar.jpg` | 1200 × 896 | Responsive 480/768/960px WebP variants |
| `interconnect-pillar.jpg` | 1200 × 896 | Responsive 480/768/960px WebP variants |
| `global-supply-map.jpg` | 1376 × 768 | Optimized WebP; described as illustrative, not an operating network |

Original photography and unused source logo/symbol files remain in the repository. The deployment package excludes them. Product images carry an illustrative-use note; image ownership, source licenses and depiction accuracy require owner confirmation. No new factory image or manufacturing ownership claim was introduced.

### Enquiry behavior

1. A product action selects the corresponding enquiry category without replacing the buyer’s text.
2. Required name, valid email and nonblank requirement are checked in the browser.
3. **Prepare Email Enquiry** shows a reviewable draft. It makes no network request and sends no email.
4. **Open Email App** provides an encoded `mailto:` link. The buyer must attach files and send the message there.
5. **Copy Enquiry** supports webmail. If clipboard permission is denied or unavailable, the text is selected for manual copying.
6. Long drafts use copying only because email apps have different URL-length limits. Editing a requirement hides the old draft so it cannot be mistaken for the current version.

There are no uploads, analytics, cookies, browser storage or third-party form requests in the site code. Hosting providers may maintain access logs, and incoming emails are handled by the owner’s email service. Inbox delivery and a real email-app handoff were not tested by sending an enquiry.

### Technical SEO

The canonical, Organization URL, social URLs, robots sitemap reference and sitemap use `https://basusinternational.com/`. Live read-only checks confirmed that `https://www.basusinternational.com/` redirects to that domain and the homepage, robots and sitemap return HTTP 200. HTTPS and HSTS were present on the existing host. Domain ownership and future hosting control were not independently verified.

The page has one H1, semantic main/header/footer landmarks, descriptive product headings and image alt text, crawlable section links, mobile-equivalent content and valid JSON-LD/XML syntax. The social image has accurate declared dimensions. No invented business address or registration data appears in structured data.

Canonical consistency follows [Google’s canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). The homepage uses only applicable fields from [Google’s Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization). Search indexing, ranking, keyword demand and rich-result eligibility are not proven by local checks.

## D. Practical verification

Run from the repository root:

```sh
python3 tests/check-site.py
node --check main.js
python3 scripts/package-site.py
git diff --check
```

The static check validates file paths, srcsets, CSS fonts, image dimensions/alt attributes, duplicate IDs, section links, label targets, schema syntax and crawl-file consistency. The package script validates required files, archive integrity and package contents.

For a local preview:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/`. Standard Python hosting does not apply `_headers` or serve the custom 404 for unknown paths. During QA, a temporary local server also applied the deployment headers and returned the actual custom 404 status; it was a local simulation, not a hosted deploy.

For browser checks, install Playwright as a development tool if it is not available. There is no Playwright dependency in the deployed site. The current Codex environment used its bundled Playwright with the installed Chrome channel and downloaded Firefox/WebKit builds:

```sh
NODE_PATH=/Users/sainul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/browser-checks.cjs
NODE_PATH=/Users/sainul/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/cross-browser-checks.cjs
```

On another workstation, make `playwright` available to Node and install its Firefox/WebKit builds. `BASUS_TEST_URL` can select a different local or staging origin.

QA evidence is in `output/playwright/` and is excluded from the public package. The full Chrome check covers 1440, 1280, 1100, 1024, 820, 768, 760, 390 and 320px, no horizontal overflow, all images, navigation, keyboard skip link, reduced motion, product selection, form errors, encoded drafts, long requirements, stale drafts, clipboard success/denial and no-JavaScript fallback. Firefox and WebKit also passed at 1440, 820, 390 and 320px, covering image/font loading, page width, menu closure, product selection, native validation and draft generation. The 320px WebKit selector regression was reproduced and fixed. No script errors were found in those runs. These engine tests do not replace a check on a physical iPhone or Android device. Browser tests must remain green after future edits.

Local Lighthouse 13.5.0 results with deployment headers applied:

| Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | Blocking time |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile, simulated throttling | 98 | 100 | 100 | 100 | 2.4s | 0 | 0ms |
| Desktop | 100 | 100 | 100 | 100 | 0.5s | 0 | 0ms |

Reports: `output/playwright/lighthouse-mobile.report.html` and `lighthouse-desktop.report.html`. These are local lab results, not production measurements or a complete accessibility certification. Recheck the actual host after publishing. The local Python server does not compress responses; a production static CDN should serve compressed HTML/CSS/JavaScript.

## E. Owner checklist

Before public release:

- [ ] Confirm `basusinternational.com` is the intended production domain and the BASUS-owned hosting project is the destination.
- [ ] Confirm `info@basusinternational.com` is monitored and test incoming email, including attachment handling. Agree how confidential drawings will be exchanged.
- [ ] Confirm the existing LinkedIn company URL while signed in. LinkedIn blocked automated verification with HTTP 999; it was not treated as a broken link.
- [ ] Confirm rights to the supplied logos and imagery and that product illustrations fit the intended capabilities.
- [ ] Approve the retained technical scope, manufacturing partner evaluation language and developing-market status. Provide project-specific certification evidence only when available; the website does not claim BASUS holds these certifications.
- [ ] Test the draft workflow on a real desktop and phone email app, and with a webmail-only setup.
- [ ] Confirm responsibility for incoming personal information, enquiry retention and any privacy notice needed for the business’s actual markets and hosting/email setup.

Useful optional trust information, when verified: registered legal entity name, registration number, official business address, business telephone, approved company profile and the actual qualification/documentation process. These were not found in the supplied material or the current public homepage. None was invented or made a mandatory form field.

### Optional direct submission

A same-origin endpoint hosted with the site could send enquiry emails through an approved transactional email service. On Netlify, Netlify Forms is another option if its processing and storage terms fit the business. Neither was enabled.

Before activation, the owner must approve the service, processing location, retention/deletion rules, privacy wording and who can access submissions. Implementation must include server-side validation and size limits, spam/rate controls, safe error/retry handling, and secrets held only on the server. Attachment support would also need file validation, secure storage and access controls. Show success only after the server accepts the submission; do not promise inbox delivery based on a browser action.

## F. Deployment and verification

The package is generated by:

```sh
python3 tests/check-site.py
python3 scripts/package-site.py
```

Outputs:

- `dist/site/` — 29 public files, with `index.html` at the root.
- `dist/basus-launch.zip` — the same public files in an integrity-checked archive.

Do not upload the whole repository. The package excludes `.git`, `.agents`, business reference documents, tests, scripts, local browser evidence and original unused source images. There is no build command or runtime environment variable required.

For the existing Netlify site:

1. Sign in to the BASUS-controlled Netlify account and identify the existing project attached to `basusinternational.com`. Record its site ID and current production deploy so you can restore it.
2. With the Netlify CLI already installed and authenticated, create a draft deploy against that exact site ID:

   ```sh
   netlify deploy --dir=dist/site --site=YOUR_CONFIRMED_SITE_ID
   ```

3. Inspect the returned draft URL. Draft deploys contain the production canonical; do not submit preview URLs to Search Console. Use access protection if the preview must be private.
4. After the owner completes the checklist, publish the same folder to that existing project:

   ```sh
   netlify deploy --prod --dir=dist/site --site=YOUR_CONFIRMED_SITE_ID
   ```

   Alternatively, upload the contents of `dist/site/` through the existing project’s manual deployment flow. Do not create a replacement project, alter DNS or change the primary domain by accident.
5. For another static host, upload the contents of `dist/site/` to its public web root. Translate `_headers` to that host’s response-header configuration and configure `404.html` with HTTP 404. A host that ignores `_headers` will not apply these protections automatically.

Production checks:

```sh
curl -I https://basusinternational.com/
curl -IL https://www.basusinternational.com/
curl -I https://basusinternational.com/assets/fonts/inter-400.woff2
curl -I https://basusinternational.com/assets/social-share.jpg
curl -I https://basusinternational.com/a-page-that-does-not-exist
curl -fsS https://basusinternational.com/robots.txt
curl -fsS https://basusinternational.com/sitemap.xml
```

Verify HTTP 200 on public files, the correct www redirect, HTTPS, MIME types, CSP and security headers, and HTTP 404 on an unknown URL. Check that HTML/CSS/JS use compression and that no resource is blocked. Assets use a one-hour cache lifetime; change the asset filename when a replacement must appear immediately in previously opened browsers.

At 390px and desktop width, check the header, all three product images, dark-section readability, every CTA, menu operation, form errors and email drafts. Test mail delivery manually with owner approval. Confirm the canonical/social/schema URLs and social image fetch on the public domain. Run Lighthouse again against production, then use Google URL Inspection and submit the homepage sitemap in the owner’s Search Console account. No indexing or ranking outcome is guaranteed.

If production checks fail, restore the recorded Netlify deploy and investigate before publishing again. No DNS change is needed to update an already connected Netlify project.
