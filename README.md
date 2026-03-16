# theholistic.io

Brand manifesto and hub for **The Holistic** by Claudiu Craciun.

---

## What this site is

theholistic.io is the brand home for The Holistic — where free knowledge lives and where visitors can discover Claudiu's work across YouTube, newsletter, and community before deciding to go deeper.

**Architecture within the broader ecosystem:**
- theholistic.io → brand home (this repo)
- claudiucraciun.com → personal hub with paid offers
- claudiucraciun.com/clarity.html → Clarity Session ($500)
- claudiucraciun.com/amazonian.html → Traditional Amazonian Diets ($2,500+)

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Single-page site — hero, about, manifesto, channels, CTA, testimonials |

---

## Design System

| Token | Value |
|---|---|
| Background | `#0D0C0A` |
| Gold (primary) | `#C9A84C` |
| Gold (hover) | `#E8C96A` |
| Text | `#E8E4DC` |
| Text muted | `#8A8680` |
| Font display | Cormorant Garant (Fontshare + Google Fonts) |
| Font body | Switzer (Fontshare) |

**Aesthetic:** Luxury editorial — dark, gold, Cormorant serif. Matching claudiucraciun.com.

---

## Page Sections (top to bottom)

1. **Hero** — full viewport, hero-bg.jpg background with gold glow, headline "Two worlds. One path.", two CTAs
2. **About Claudiu** — photo + bio, pulled high in the scroll so visitors understand who this is immediately
3. **Manifesto** — pullquote + 3 pillars (No titles / Free knowledge / Both worlds)
4. **What this is / isn't** — contrast columns
5. **Free resources** — YouTube, Community, Newsletter links
6. **Work with Claudiu** — Clarity Session + Traditional Amazonian Diets cards (links to claudiucraciun.com)
7. **Testimonials** — 8 real testimonials, Alen featured, no placeholder text

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Main HTML |
| `style.css` | All styles for this site |
| `base.css` | Shared CSS reset/base (same as claudiucraciun.com) |
| `favicon.svg` | H monogram in gold |
| `hero-bg.jpg` | "THE HOLISTIC" brand image with gold glow — hero background |
| `claudiu-profile.jpg` | Claudiu's portrait — used in About section |

---

## SEO

- **Title:** The Holistic — Free Knowledge. Real Transformation.
- **Description:** Business strategy and traditional Amazonian plant diets, freely shared. No titles, no guru positioning.
- **Canonical:** https://theholistic.io/
- **OG image:** hero-bg.jpg
- **Twitter:** @theholistic
- **JSON-LD:** Organization schema with founder Person schema

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
- [ ] Connect Skool community → update welcome message
- [ ] Update Skool icon → use the-holistic-icon-square.png
- [ ] Email signature update for claudiu@claudiucraciun.com

---

## Key Constraints

- **Ayahuasca** must NEVER appear anywhere on this site
- "Traditional Amazonian Diets" is the correct terminology — not plant medicine tourism, not ceremonies
- No guru framing, no shaman title, no psychic positioning
- Free knowledge belongs to everyone; monetise only personal time
- Plant diets are the core — ceremonies are entirely the client's own decision
- 24h money-back guarantee on all paid services (Clarity: 24h from session; Amazonian: 24h from first prep call)

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
| Website | https://claudiucraciun.com |
| YouTube | https://youtube.com/@craciunlabs |
| Community | https://skool.com/the-sanctuary-4657 |
| Newsletter | https://theholisticprofessional.beehiiv.com |
| Email | claudiu@claudiucraciun.com |
| X / Twitter | @theholistic |

---

*Built with Perplexity Computer — https://www.perplexity.ai/computer*
