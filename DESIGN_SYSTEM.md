# Apps & Deals Store — Design System (GrowthLab.sg)

100% match to www.growthlab.sg and app.growthlab.sg. Tagline: **Build. Connect. Scale.**

---

## Color Palette

| Role | Light | Dark | Hex (primary ref) |
|------|--------|------|--------------------|
| **Primary Blue** | Buttons, links, accents, progress | Same | `#0A66C2` |
| **Growth Green** | Success, launch, funded state | Same | `#00B140` |
| **Accent Yellow/Orange** | Deals, limited-time, badges | Same | `#F59E0B` |
| **Neutral Background** | Page background | Dark toggle | `#F8FAFC` / `#0F172A` |
| **Text Heading** | Headings | Light on dark | `#1E2937` |
| **Text Body** | Body, secondary | Muted light | `#475569` |
| **Border / Card** | Cards, inputs | Dark border | `#E2E8F0` |
| **Card shadow** | Soft elevation | — | `0 1px 3px rgba(0,0,0,0.08)` |

Confetti / success: **#0A66C2**, **#00B140** (green + blue).

---

## Typography

- **Font:** Inter (or exact font from GrowthLab.sg).
- **Headings:** font-weight 600 (semibold) / 700 (bold).
- **Body:** 400 (regular) / 500 (medium).
- Generous whitespace; clean, minimal startup aesthetic.

---

## Components

- **Radius:** 8px (border-radius: 8px) for cards, buttons, inputs, modals.
- **Buttons:** Primary `#0A66C2`, hover scale 1.02; success/green for “Launch” / “Funded”.
- **Progress bars:** Growth green fill `#00B140`, same style as GrowthStarter.
- **Cards:** Soft shadow, 8px radius, border `#E2E8F0`.
- **Modals:** 8px radius, overlay `bg-black/50`, backdrop-blur.
- **Micro-animations:** Button hover scale 1.02; progress fill smooth; confetti on goal reached.

---

## Navigation (Top bar)

- **Logo** left.
- **Menu:** Home | Connect | Launch | Fund | Grow | **Apps & Deals** (active) | Community | Profile.
- **Tagline** “Build. Connect. Scale.” in header/footer.
- **Mobile:** Hamburger, same items.

---

## Accessibility

- WCAG AA; keyboard navigation; ARIA labels where needed.
