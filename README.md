# theholistic.io

Brand manifesto and hub for **The Holistic** by Claudiu Craciun.

---

## What this site is

theholistic.io is the brand home for The Holistic — where free knowledge lives and where visitors can discover Claudiu's work across YouTube, newsletter, and community before deciding to go deeper.

**Architecture within the broader ecosystem:**
- theholistic.io → brand home + storefront (this repo). Offers live HERE.
- theholistic.io/clarity.html → Clarity Session ($500, application-only)
- theholistic.io/amazonian.html → Traditional Amazonian Diets (Claudiu's fee $2,500, SEPARATE from the maestro's fee)
- claudiucraciun.com → the person / the proof (sends deeper traffic to .io)

> NOTE (corrected June 5, 2026): an earlier version of this README placed the offers on
> claudiucraciun.com. That is wrong. The live offers are on **theholistic.io** (`/clarity.html`,
> `/amazonian.html`). Fees are NEVER combined into one number.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, **origin film (Start here)**, two-doors, manifesto, About, testimonials, FAQ |
| `clarity.html` | Clarity Session ($500) — native step-through application |
| `amazonian.html` | Traditional Amazonian Diets — the deep work, separate fees, ceremonial-tradition copy |

---

## Design System

| Token | Value |
|---|---|
| Background | `#0D0C0A` |
| Gold (primary) | `#C9A84C` |
| Gold (hover) | `#E8C96A` |
| Text | `#E8E4DC` |
| Text muted | `#8A8680` |
| Font display | Cormorant Garamond (Google Fonts) |
| Font body | Switzer (Fontshare) |

**Aesthetic:** Luxury editorial — dark, gold, Cormorant serif. Matching claudiucraciun.com.

---

## Page Sections (index.html, top to bottom)

1. **Hero** — full viewport, headline "There was a time I couldn't see a reason to keep going." + dignified "heartbeat" line, two CTAs, and a quiet "Or watch my story first" link to the origin film
2. **Start here — the origin film** — the site's TRUE front door. Facade embed: `origin-thumb.jpg` poster + gold play button → click loads the privacy-enhanced (youtube-nocookie) player. Video: https://youtu.be/fV870rZB5pk ("The Night I Met Myself, in the Amazon", ~14 min, PUBLIC)
3. **Two-doors strip** — Clarity (start here) + Amazonian Diets (go deeper) wayfinding
4. **Prose / agitation / the work** — why insight alone never moved it; the walk, not the brew
5. **Manifesto** — pullquote + pillars
6. **About Claudiu** — the dignified origin story in his own words (the "expensive suit / I didn't have myself" beat), graduation sign-off, nomad framing
7. **Testimonials** — real, attributable only
8. **FAQ** — visible accordions + FAQPage schema (4 Q on index)
9. **Footer** — links + findahelpline.com support line (HARD RULE 7)

### Origin film — facade embed (how it works)
- `index.html` `.starthere-video` button carries `data-video="fV870rZB5pk"` and shows `origin-thumb.jpg`.
- A small script (bottom of `index.html`) swaps the poster for a `youtube-nocookie.com/embed/...?autoplay=1` iframe on click. Nothing loads from YouTube until the visitor clicks (fast + privacy-friendly).
- To change the film later: replace `origin-thumb.jpg` and update the `data-video` ID (one place).
- If the video is ever set Private/Unlisted, the embed will error for visitors — keep it PUBLIC.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Main HTML |
| `404.html` | Branded not-found page (Vercel serves it automatically) |
| `style.css` | All styles for this site |
| `base.css` | Shared CSS reset/base (same as claudiucraciun.com) |
| `site.js` | Shared theme toggle + hide-header-on-scroll (all pages) |
| `api/apply.js` | Vercel serverless form endpoint (Resend; origin check + rate limit) |
| `favicon.svg` | H monogram in gold |
| `hero-bg.jpg` | "THE HOLISTIC" brand image with gold glow — hero background |
| `claudiu-profile.webp` / `.jpg` | Claudiu's portrait — pages use the `.webp`; `.jpg` kept for the Person schema image |
| `origin-thumb.webp` / `.jpg` | Origin-film poster — pages use the `.webp`; `.jpg` kept for the VideoObject schema thumbnail |
| `wordmark.webp` / `.png` | THE HOLISTIC wordmark — pages use the `.webp`; `.png` is the source original |
| `avatar-*.jpg` | Self-hosted testimonial photos (formerly hotlinked from testimonial.to) |

---

## SEO

- **Title:** The Holistic — the deep work most people put off.
- **Description:** For people who feel everything. The patterns that keep coming back, and the slower work that actually moves them. No guru act, no quick fixes. The deeper work is by application.
- **Canonical:** https://www.theholistic.io/
- **OG image:** og-image.jpg (1200×630)
- **Twitter:** @theholisticio
- **JSON-LD:** index — Organization + Person + FAQPage + VideoObject; offer pages — Person + Service + FAQPage
- **AI/answer engines:** robots.txt explicitly welcomes GPTBot, ClaudeBot, PerplexityBot etc.; `llms.txt` describes the work in their terms

---

## Testimonials

| Person | Role | Status |
|---|---|---|
| Alen Oberlechner | Professional medium, Austria | ✅ Live (featured) |
| Mark Jones | Spiritual Medium, UK | ✅ Live |
| Bio Vidigal | Solopreneur, Brazil | ✅ Live |
| Devi Chandra Ma | Medicine Woman, Prana Verein | ✅ Live |
| Matthew Ferguson | Community member | ✅ Live |
| Yonehiro | Medium, Japan | ✅ Live |
| Mia Ottosson | 30+ years on spiritual path, Sweden | ✅ Live |
| Rudi Vanlancker | Personal training studio, Brussels | ✅ Live |
| Eileen Davies | Mediumship field | ⏳ Pending — add when received |

**Rules:**
- DO NOT touch testimonial text — it is final
- Eileen Davies → add to this page when received
- Peru Amazonian clients → add to amazonian.html, NOT here

---

## Pending

- [ ] Add Eileen Davies testimonial when received
- [ ] Submit to Google Rich Results Test + request re-indexing in Search Console (origin film + FAQ/schema) — owner-only (logged-in account)
- [ ] Resolve the "community" destination for the homepage (Skool vs. Beehiiv community) before adding a homepage community link
- [ ] Email signature update for claudiu@claudiucraciun.com
- [x] ~~Origin video as Start here~~ — DONE June 5, 2026 (facade embed live)

---

## Key Constraints

- **Ayahuasca** must NEVER appear anywhere on this site
- "Traditional Amazonian Diets" is the correct terminology — not plant medicine tourism, not ceremonies
- No guru framing, no shaman title, no psychic positioning
- Free knowledge belongs to everyone; monetise only personal time
- Plant diets are the core — ceremonies are entirely the client's own decision
- 24h money-back guarantee on all paid services (Clarity: 24h from session; Amazonian: 24h from first prep call)
- **Fees stay publicly displayed** on the site so people know what to expect (founder decision, July 3, 2026) — but NEVER combined into one number
- Food/provisions copy: describe quality ("premium, diet-friendly"), never name specific cuisines (e.g. no "Japanese rice") — founder decision, July 3, 2026

---

## Deployment

Static HTML/CSS/JS. Deploy to any static host. No build step required.

```bash
# Push to GitHub
git add .
git commit -m "Update: improved hero, about section, CTA section, typography"
git push origin main
```

The site auto-deploys via Perplexity Computer to the CDN hosting at theholistic.io.

---

## Contact & Links

| Platform | Handle/URL |
|---|---|
| Website | https://theholistic.io · https://claudiucraciun.com |
| Origin film | https://youtu.be/fV870rZB5pk (PUBLIC) |
| YouTube | https://youtube.com/@craciunlabs (planned rename → @theholisticio) |
| Community | TBD — confirm Skool vs. Beehiiv community before linking on homepage |
| Newsletter | https://theholistic.beehiiv.com (NOT the retired theholisticprofessional.beehiiv.com) |
| Email | claudiu@claudiucraciun.com |
| Instagram / X | @theholisticio (preferred) |

---

*Built with Perplexity Computer — https://www.perplexity.ai/computer*
