# Artisan Barber Legacy URL Inventory

Phase 2 working inventory for consolidating URLs from the former Shopify storefront into the custom site.

## Implemented redirects

| Legacy pattern or URL | Current destination | Evidence |
| --- | --- | --- |
| `/blogs/:blog/:handle` | `/read/:handle` | Current article routes retain the Shopify article handle. |
| `/blogs/:blog` | `/read` | Shopify blog indexes are consolidated into the current Read index. |
| `/pages/blog` | `/read` | The former page was the primary article index. |
| `/pages/learn` | `/read` | The former Learn index is consolidated into the current editorial index. |
| `/pages/careers` | `/careers` | The current Careers route replaces the indexed Shopify careers page. |
| `/pages/service` | `/services` | The current Services page replaces the former service page. |
| `/pages/visit` | `/services` | The former Visit page primarily contained services, location, hours, and booking information. |
| `/pages/shop` | `/shop` | The current Shop page replaces the former Shopify landing page. |
| `/collections/newest-products` | `/shop/new` | The current `new` collection exists and replaces the indexed `newest-products` collection. |
| `/collections/best-sellers` | `/shop/best-sellers` | The collection retains its handle under the current Shop route. |
| `/collections/hair-styling` | `/shop/hair-styling` | The collection retains its handle under the current Shop route. |

All implemented redirects use permanent Next.js redirects and return HTTP 308.

## Verified current content

- Shopify exposes 86 articles across the `grooming`, `local`, `journal`, `team`, and `lifestyle` blogs.
- The live Read page exposes the current `/read/:handle` destinations.
- Current product handles remain under `/products/:handle`, so no route-family migration is required for products that retain their handles.
- Current collection destinations are listed under `/shop/:handle` in the generated sitemap.

## Unresolved legacy URLs

| Legacy URL | Current status | Decision needed |
| --- | --- | --- |
| `/pages/foundation` | 404 | The former page describes the charitable Artisan Barber Foundation. There is no equivalent current page; do not redirect it to the Academy or a generic page without an explicit content decision. |

## Sitemap issue discovered during inventory

The live Read index exposes current articles, but the sitemap omitted all article URLs. The sitemap query requested Shopify's unsupported `Article.updatedAt` field, causing each blog response to be rejected. Phase 2 removes that field and uses `publishedAt` for article sitemap modification dates.

## Remaining evidence sources

- Google Search Console page export for the previous 16 months.
- Google Search Console links report or a backlink export.
- Shopify URL redirect export, if redirects still exist in Shopify administration.
- Any archived URL list or previous sitemap not represented in search-engine results.
