# Farooq Halabi portfolio

This repository contains the source for [fahalabi.github.io](https://fahalabi.github.io/). It is a framework-free static site built with semantic HTML, readable CSS and a small amount of vanilla JavaScript.

## Update guide

- Main portfolio copy and sections: `index.html`
- Design system and responsive layout: `assets/css/styles.css`
- Scroll reveals/progress, pointer effects, mobile navigation, recommendations, copy-link and certificate lightbox: `assets/js/main.js`
- Downloadable one-page professional profile: `Farooq-Halabi-Profile.pdf`
- Retained original CV: `Farooq-Halabi-CV.pdf` (not linked from the current page)
- Social preview image: `assets/images/portfolio-social.png` (1200 × 630)
- Hero portrait: `assets/images/farooq-portrait.webp` (supplied photograph, WebP encoding, no retouching)
- Recognition certificates: `assets/images/recognition/`
- Search metadata: `index.html`, `robots.txt`, `sitemap.xml` and `site.webmanifest`

## Content rules

- Keep the hero employer-neutral.
- Label estimates as estimates and validation-stage work as validation-stage work.
- Keep AI human-governed: AI can support research, structure, drafting and testing; people own facts, policy and approval.
- Keep excluded or unapproved projects out of the public portfolio.
- Do not publish volunteering photographs that identify children without documented permission.
- Do not add project dates to project headings.
- Do not add an overall slide count to the training material revamp.
- Current role and Shahid dates were confirmed by the owner on 21 September 2026.
- Use practical BMAD and Canva descriptions; the owner approved removing the self-assigned expert titles from the page.
- Keep outcomes labelled as reported results. Preserve the combined English/Arabic article count, approximate audience sizes and estimated time saving.
- Earlier UAE work has no year range on the homepage because the previous HTML and retained CV differ on its end year.
- The original CV is preserved as supplied. The new download is explicitly a professional profile, not a replacement CV, and uses the reconciled website claims and practical tool descriptions.

## Local review

The current direction was built after the owner reset the earlier designs and delegated creative direction. It leads with a short value proposition, four professional work examples, a compact experience timeline, recommendations and contact. Detailed evidence, qualifications and recognition use native disclosures so the first read stays short.

The palette is near-black #111216, warm white #f5f3ee and orange #ff6b35. Geist and Geist Mono are self-hosted. Icons are inline SVGs. The work-card illustrations are schematic, not actual product screenshots. The supplied portrait remains unretouched; a CSS grayscale treatment reveals colour on hover, with colour shown on touch devices.

Motion includes staggered headline entry, a travelling question-to-answer line, scroll reveals/progress and bounded pointer responses. Motion uses native CSS and JavaScript. The operating system's reduced-motion setting disables decorative movement. Recommendations change only when the visitor uses the previous/next controls; there is no autoplay. No motion toggle or saved preference is needed.

Serve the folder with any static HTTP server and open the local address in a browser. Before publishing, check 1440, 768, 390 and 320px layouts, keyboard navigation, mobile navigation across 801px, actual motion, reduced motion, disclosures, all three recommendations, certificate dialogs and fallback links, copy-link feedback, the profile download and the 404 page. Content and native disclosures must remain usable without JavaScript; all recommendations are shown in that fallback.

GitHub Pages publishes the repository root from the `main` branch.
