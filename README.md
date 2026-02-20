# GrowthLab – Apps & Deals Store

A dedicated marketplace and launch platform inside GrowthLab where startups can **list**, **launch**, and **sell** their apps with deals, pre-orders, and crowdfunding-style funding. Branding matches **www.growthlab.sg** and **app.growthlab.sg** (tagline: *Build. Connect. Scale.*).

## Design system & mockups

- **Design system:** See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for colors, typography, and components.
- **High-fidelity mockups** (in `/public/mockups/`):
  - `mockup-desktop-homepage.png` — Full desktop homepage (1920px style)
  - `mockup-mobile-homepage.png` — Mobile (iPhone 14/15) homepage
  - `mockup-app-card-variations.png` — App cards (live, funded, deal badge)
  - `mockup-launch-wizard.png` — Launch Your App 4-step wizard
  - `mockup-success-popup.png` — Goal Reached success pop-up (confetti)
  - `mockup-app-detail-page.png` — Single app detail / launch page
  - `mockup-my-launches-dashboard.png` — My Launches dashboard
  - `mockup-color-palette-components.png` — Color palette + component library

## Tech stack

- **Next.js** (App Router), React 18+
- **Tailwind CSS** with GrowthLab CSS variables and utility classes
- **shadcn-style** components (New York, neutral), Lucide icons
- **next-themes** for dark mode, **Sonner** for toasts, **canvas-confetti** for launch celebration

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Header**: Logo, global search, quick filters (Featured, New, Deals, Categories), theme toggle, notifications, user menu
- **Search & filters**: Query, sort (Trending, Newest, Most popular), “Deals only” toggle
- **App / deal cards**: Image, title, description, badges (New, Deal, Featured), primary CTA with teal gradient
- **Detail modal**: Full listing view with image, stats, View app / Get deal
- **Launch app modal**: Simple form to “launch” an app (triggers success flow)
- **Launch success celebration**: Full-screen overlay, confetti (brand colors), modal with gradient header, stats, Share + Continue

## Integration

- **Base path**: App runs at `/`; can be mounted under GrowthLab at e.g. `/apps` or `/store`.
- **Auth**: Placeholder (user menu, “My apps” / “My deals”); ready for GrowthLab SSO.

## Brand

- Primary teal: `#0F7377`, light/success: `#00A884`
- Utility classes: `.gs-gradient`, `.gs-card-hover`, `.gs-glass`, `.gs-gradient-text`, etc.
- Dark mode: class-based via `next-themes`.
