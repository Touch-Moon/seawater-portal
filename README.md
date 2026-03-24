# 🌊 Seawater Portal

**A modern redesign of a multi-site Canadian local news network — 10 community sites powered by a single codebase.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Demo

> 🔗 **Live:** [seawater-portal.vercel.app](https://seawater-portal.vercel.app)

## Screenshots

<!-- Add screenshots after deployment -->
| Desktop (Dark) | Desktop (Light) | Mobile |
|:---:|:---:|:---:|
| *Coming soon* | *Coming soon* | *Coming soon* |

## About

I originally built the frontend for a network of 10 Canadian local news portals. This project is a complete redesign from scratch — reimagined with a modern Korean portal-style UI inspired by [Daum](https://www.daum.net) and [Naver](https://www.naver.com).

The original sites share the same Rails monolith codebase, differentiated only by brand colors, logos, and content feeds. This redesign preserves that multi-site architecture while modernizing the stack with Next.js 15, Supabase, and SCSS.

## Live Sites (Original)

These are the 10 community news sites currently in production — all running on a shared codebase:

| Site | Community |
|------|-----------|
| [steinbachonline.com](https://steinbachonline.com) | Steinbach, Manitoba |
| [cochranenow.com](https://cochranenow.com) | Cochrane, Alberta |
| [highriveronline.com](https://highriveronline.com) | High River, Alberta |
| [okotoksonline.com](https://okotoksonline.com) | Okotoks, Alberta |
| [centralalbertaonline.com](https://centralalbertaonline.com) | Central Alberta |
| [discovermoosejaw.com](https://discovermoosejaw.com) | Moose Jaw, Saskatchewan |
| [discoverwestman.com](https://discoverwestman.com) | Westman, Manitoba |
| [discoverhumboldt.com](https://www.discoverhumboldt.com) | Humboldt, Saskatchewan |
| [classic107.com](https://classic107.com) | Classic 107 Radio |
| [chvnradio.com](https://chvnradio.com) | CHVN Radio |

## Features

- **Dark / Light Theme** — System-aware toggle with smooth transitions
- **Live News Feeds** — RSS integration with category filtering (Local, Sports, National, Ag News, Community)
- **Weather Dashboard** — Current conditions, hourly/daily forecasts, and live radar map (Environment Canada)
- **Radio Player** — Live streaming with Now Playing polling
- **Events Calendar** — Supabase-powered with detail pages
- **Business Directory** — Searchable local business listings
- **Buy & Sell Classifieds** — Tabbed grid with pagination
- **Authentication** — Supabase Auth (sign up, login, password reset, account settings)
- **Newsletter Signup** — Email subscription CTA
- **SEO** — Dynamic sitemap, Open Graph images, robots.txt

## Development Environment

| Tool | Version / Detail |
|------|-----------------|
| OS | macOS (Darwin 25.3.0) |
| Node.js | v24.10.0 |
| npm | 11.6.0 |
| IDE | VS Code |
| React | 19 |
| Next.js | 15 (App Router) |
| TypeScript | 5 |
| SCSS | Sass (BEM methodology) |
| Framer Motion | Animation library |
| Supabase | PostgreSQL + Auth |
| Vercel | Deployment platform |

## API & Integrations

### Implemented

| Integration | Description | Status |
|------------|-------------|--------|
| **RSS News Feeds** | Direct fetch from site RSS endpoints (8 categories). Server-side with ISR (60s revalidation). | ✅ Live data |
| **WeatherAPI** | Current conditions + hourly/daily forecasts. Free tier (1M calls/month). ISR 300s. | ✅ Live data |
| **MSC GeoMet (Environment Canada)** | Live radar map via WMS tile layer on Leaflet. Free, no API key required. 6-min refresh. | ✅ Live data |
| **EC Weather Alerts** | ATOM feed for active weather warnings. Displayed on weather page sidebar. | ✅ Live data |
| **Golden West Radio Streaming** | 3 radio channels (AM 1250, MIX 96.7, Country 107.7). CORS-proxied via Next.js API route. | ✅ Live data |
| **Supabase Auth** | Sign up, login, password reset, session management, account settings. | ✅ Functional |
| **Supabase Database** | Events, businesses, classifieds — filtered by `site_key` for multi-site support. | ✅ Seed data |

### Not Implemented (with reasoning)

| Feature | Current State | Why |
|---------|--------------|-----|
| **Buy & Sell (Real Data)** | Mock data (18 items) | The original site links to [hellogoodbuy.ca](https://hellogoodbuy.ca) via quick link — no public API available. I wanted to demonstrate the classifieds UI/UX as an integrated in-app experience, so I built it with mock data. |
| **Newsletter Subscription** | UI only | Requires a mail service (e.g., Mailchimp, Resend) to be wired up. The form UI and success state are fully built. |
| **Google Ads** | Placeholder banners | Requires an active AdSense/Ad Manager account. Ad slots are positioned and sized to spec. |
| **Multi-Site Switching** | Architecture ready | Domain detection + `SiteConfig` table linking is prepared. Connect domains on Vercel to activate. |

### For Production Deployment

To bring this to a fully live production state, the following steps are needed:

1. **Supabase `site_configs`** — Populate the table with each site's brand color, logo URL, weather location, and radio stream URL
2. **Domain mapping** — Add custom domains in Vercel and enable hostname-based site detection in the proxy
3. **Newsletter API** — Connect Mailchimp/Resend to the existing subscription form
4. **Ad network** — Replace placeholder banners with AdSense/Ad Manager tags
5. **Classifieds data source** — Either user-submitted listings via Supabase or a future API integration

## Accessibility (WCAG 2.1 AA)

This project was audited and remediated for WCAG 2.1 AA compliance across three phases.

| Category | Implementation |
|----------|---------------|
| **ARIA Patterns** | `role="tablist/tab/tabpanel"` for tabbed interfaces, `role="menu/menuitem"` for dropdowns, `role="dialog"` for panels, `aria-live="polite"` for dynamic content |
| **Keyboard Navigation** | Focus trap in SidePanel and FontSizeModal, arrow key navigation in menus, Escape to close all overlays, focus restoration on close |
| **Screen Reader** | `.sr-only` text for icon-only buttons, external link announcements ("opens in new tab"), `role="status"` for success messages |
| **Reduced Motion** | `prefers-reduced-motion` respected in both CSS animations and JS auto-rotation (ContestPanel, EventsPanel) |
| **Color Contrast** | All text meets AA 4.5:1 minimum ratio — including light mode tertiary text (`#767676` on `#ffffff`) |
| **Semantic HTML** | `<nav>`, `<main>`, `<article>`, proper heading hierarchy (`h1` → `h2` → `h3`) |
| **Forms** | `autoComplete` attributes, `aria-label` on inputs, inline error messages, password strength indicators |

> **Lighthouse Scores:** Performance **86** · Accessibility **97** · Best Practices **96** · SEO **100**

## Multi-Site Architecture

A single Vercel deployment serves all 10 community sites. The architecture separates **what changes** (brand, content sources) from **what stays the same** (layout, components, features) — so adding a new site requires zero code changes.

### How It Works

```
Request: cochranenow.com/news
         │
         ▼
┌─────────────────────┐
│   Next.js Proxy     │  ← Reads hostname from request headers
│   (proxy.ts)        │  ← Maps "cochranenow.com" → site_key: "cochrane"
└────────┬────────────┘
         ▼
┌─────────────────────┐
│   Supabase          │  ← SELECT * FROM site_configs WHERE site_key = 'cochrane'
│   site_configs      │  ← Returns: brand color, logo, RSS URL, weather location, radio URL
└────────┬────────────┘
         ▼
┌─────────────────────┐
│   Shared Codebase   │  ← Same components, same layout, same features
│   (100% reused)     │  ← Only data sources and CSS variables differ
└─────────────────────┘
```

1. **Domain Detection** — The proxy middleware reads the incoming hostname and maps it to a `site_key` (e.g., `cochranenow.com` → `cochrane`). Unknown domains fall back to the default site (Steinbach).

2. **Config Loading** — A `site_configs` table in Supabase stores per-site settings. The app loads the matching row at request time and uses it to configure brand colors (injected as CSS custom properties), RSS feed URLs, weather location, and radio stream endpoints.

3. **Data Isolation** — All content tables (`articles`, `events`, `businesses`, `classifieds`) include a `site_key` column. Queries automatically filter by the active site, so each community sees only its own content from the shared database.

### What Changes Per Site

| Config | Example |
|--------|---------|
| Brand colors | `#fee200` (Steinbach) / `#e63946` (Cochrane) |
| Logo | Site-specific SVG |
| News RSS feed | `steinbachonline.com/rss/` / `cochranenow.com/rss/` |
| Weather location | Steinbach, MB / Cochrane, AB |
| Radio streams | Golden West / Local station |

### What Stays the Same

Layout, components, features, auth, database schema, and deployment — **100% shared codebase**. Adding a new community site means inserting one row into `site_configs` and pointing a domain in Vercel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript 5 |
| Styling | SCSS + BEM (no Tailwind, no CSS Modules) |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Weather | [WeatherAPI](https://www.weatherapi.com) + [MSC GeoMet](https://eccc-msc.github.io/open-data/) (radar) |
| News | RSS feeds (direct fetch, ISR 60s) |
| Maps | Leaflet + WMS (Environment Canada radar) |
| Deployment | Vercel |
| Theme | next-themes (dark/light, default: dark) |

## Getting Started

```bash
# Clone
git clone https://github.com/Touch-Moon/seawater-portal.git
cd seawater-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys — see .env.example for details

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

[MIT](LICENSE)
