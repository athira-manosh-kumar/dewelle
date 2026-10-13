# Dewelle

A modern Korean beauty storefront concept with original AI-generated packaging photography and the Dew Buddy mascot. Built with HTML, CSS and vanilla JavaScript.

## Explore

- 86 products across skincare, sun care, masks, eye/lip care, everyday tint, patches, body care, haircare, grooming, accessories and discovery minis.
- Face, Hair, Body, Women’s Edit and Men’s Edit in the Shop menu and catalogue, plus skin/hair type, ingredient, category, search and price filters. Twelve products load at a time.
- Dedicated product pages with proposed skin/hair matches, shade choice, ingredient direction and use-after/follow-with guidance.
- 14 ready combos, each with one styled group photograph, same-category product swaps, required shade selection and live set totals.
- Morning/evening beginner guidance for all genders and a Men's Edit for shaving and beard care.
- Wishlist, editable shopping bag and demo checkout. Different shades remain separate bag items. Local storage saves bag/wishlist only on the current browser.
- A cinematic animated hero, scroll reveals, pointer depth, floating dew shapes and mascot motion; device reduced-motion preferences are respected.

## Local preview

From this directory, run `python3 -m http.server 8770 --bind 127.0.0.1`, then visit http://localhost:8770/.

Use `node verify.cjs` for catalogue and shopping-logic checks. Browser visual testing is a separate step; passing these checks does not verify rendered layout or interaction behavior.

## Source files

- `catalog.json`: product and combo source data.
- `catalog.js`: browser-ready copy of the same catalogue.
- `CATALOGUE.md`: readable product list.
- `CATALOG-IMAGE-PROMPTS.json`: final packaging-photo prompts and retouch instructions.
- `assets/catalog/`: 86 optimized product photos.
- `assets/combos/`: 14 complete set photographs.
- `CATALOGUE-SOURCES.md` and `IMAGE-USAGE.md`: references and image provenance.

## Concept status

Dewelle is fictional. Products, skin/hair suitability, shades, prices and formulas are proposed design data. SPF50+ PA++++ is a sunscreen formulation target, not tested protection. Medicated patches have no invented active ingredient, strength or treatment directions. Packaging photos show representative concepts, not verified shade swatches. Checkout places no order and collects no payment or personal information.

## Validation

Checks cover catalogue and combo integrity, skin/ingredient discovery, optional routine steps and budgets, shade-specific bags, shipping totals, quantity limits, wishlist actions, product-page rendering and image references. Final image review includes checking branding on background props. Live browser verification may be blocked by the browser's policy check; report it separately when unavailable.
