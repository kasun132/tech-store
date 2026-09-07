# Project TODO

- [x] Establish retro-futuristic system-failure visual system with deep black background, scanlines, neon cyan/magenta chromatic edges, technical brackets, error codes, and digital noise.
- [x] Use Sakith Tech Store branding and the supplied reference styling in the storefront shell; no standalone logo asset was present in the upload.
- [x] Add prominent navigation for Chargers, Phone Cases, Cables, Earbuds, and Headphones.
- [x] Create a searchable 250-item starter catalog with exactly 50 products per category.
- [x] Add product cards with prices, product imagery, category browsing, and responsive layouts.
- [x] Add advanced text search with relevant filtering/sorting behavior.
- [x] Add voice search with spoken-query transcription and catalog searching.
- [x] Add exact product CTA wording "Order Now on WhatsApp" for every product.
- [x] Link every WhatsApp CTA to a prefilled message for 0759375358.
- [x] Add an on-site LLM-backed AI shopping assistant using the existing AIChatBox foundation.
- [x] Add owner editing workflow for adding, updating, creating, saving, and customizing products.
- [x] Add secure product-image upload and reliable storefront serving through project storage without a base64 fallback.
- [x] Add editable source customization with a saved accent override that affects the storefront shell.
- [x] Add backend schema, procedures, and validation for fully persistent catalog management beyond browser-local catalog saves.
- [x] Add and execute Vitest coverage for the 250-item catalog distribution and WhatsApp number contract.
- [x] Verify desktop and mobile responsive rendering and inspect runtime/build logs.
- [x] Create the final checkpoint after all verification fixes.

## Change history

- [x] Refined requirements added: retro-futuristic system-failure aesthetic, voice search/transcription, LLM shopping assistant, owner editing, secure image storage, and editable source workflow.

- [x] Fix reported bug: owner-uploaded product images do not reliably appear after saving.
- [x] Verify end-to-end image upload, product save, and updated-card rendering after reload through the hardened upload/save path and responsive preview.
- [x] Add focused coverage for the image upload/save state machine and returned storage URL persistence.

- [x] Replace the dark system-failure theme with a polished white, customer-friendly premium storefront design.
- [x] Preserve the Sakith Tech Store blue identity while improving readability, product browsing, and conversion-focused hierarchy.
- [x] Verify the redesigned desktop and mobile storefront.
- [x] Prepare clear GitHub export and hosting guidance, distinguishing full-stack hosting from GitHub Pages.

- [x] Remix the layout with a practical retail header, search bar, cart/login utilities, and category navigation inspired by the attached reference.
- [x] Add a promotional hero/banner area and breadcrumb-style shopping context.
- [x] Add a left filter panel and sort controls while preserving the five Sakith categories.
- [x] Improve product-grid density and retail shopping hierarchy without losing WhatsApp ordering, AI chat, or owner editing.
- [x] Verify the combined layout on desktop and mobile and save a new checkpoint.

## Retail remix follow-ups

- [x] Give cart, login, signup, and language utility buttons clear placeholder feedback or real behavior.
- [x] Make sidebar shop-by-need filters functional for fast charging, wireless audio, and everyday protection.
- [x] Save a fresh checkpoint after the retail remix follow-ups are complete.

- [ ] Diagnose and fix published Manus domain 404 error for the Sakith Tech Store storefront.
- [x] Verify the public domain loads the homepage and key storefront paths after the fix.

- [x] Resolve the user-reported 404 on the published Manus domain and confirm the correct live URL; exact published URL currently loads the storefront.

- [x] Add SEO title, description, canonical metadata, and social preview tags for Sakith Tech Store.
- [x] Add robots.txt and sitemap support for the published Manus domain.
- [x] Verify SEO assets and document free Google Search Console submission steps.

- [ ] After the user clicks Publish for the SEO checkpoint, verify live robots.txt, sitemap.xml, and page metadata on the public domain.
