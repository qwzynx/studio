# MG Studio

**Photography & videography portfolio** — lives at [studio.mahanghafarian.com](https://studio.mahanghafarian.com).

Sister site to the engineering portfolio at [mahanghafarian.com](https://mahanghafarian.com) — same
dark look and fonts, rebuilt around a camera/cinema visual language: letterbox bars, a viewfinder
hero, and every section staged as a piece of real photo/video gear (a film canister shelf, an NLE
timeline, a flight case, a manual-focus lens barrel).

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

## Features

- **Cinematic shell** — full-viewport letterbox bars, a viewfinder-HUD hero, film-grain overlay,
  and scroll-snapped sections, all in a fixed dark theme.
- **Photos** — a horizontally scrollable shelf of "film canisters" (one per collection) teases the
  work on the homepage; clicking one flies it into a detail view and unspools the roll. Each
  collection also gets a full gallery page at `/photos/[category]`, plus an archive index at
  `/photos`, with a fullscreen lightbox and per-photo EXIF readout (aperture, shutter, ISO).
- **Videos** — staged as an editing suite: a program monitor above an NLE-style timeline where
  each clip is a block sized to its real duration. Plays through the sequence automatically;
  clicking a clip pins the playhead to loop just that one.
- **Kit** — gear presented as an open flight case: camera bodies and lenses pressed into a foam
  insert on one side, post-production software mounted as a 1U rack of outboard units (in
  signal-path order) on the other.
- **Experience** — a career timeline styled as a manual-focus lens barrel; dragging or clicking a
  chapter pulls focus onto it while the rest fall out of focus.
- **Contact** — a booking inquiry form that posts to [formsubmit.co](https://formsubmit.co/), with
  inline submit/error states.
- **SEO baked in** — JSON-LD structured data (`Person` + `WebSite`), OpenGraph/Twitter cards, a
  generated `sitemap.xml`, `robots.txt`, and a web app manifest.
- **Responsive** across phone, tablet, and desktop, with reduced-motion fallbacks on the animated
  sections.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI library | [React](https://react.dev/) 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [lucide-react](https://lucide.dev/), [react-icons](https://react-icons.github.io/react-icons/) |
| Linting | [ESLint](https://eslint.org/) with `eslint-config-next` |
| Deployment | Static-friendly Next.js app, deployed under a custom subdomain |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** on an NTFS mount, hot reload doesn't pick up file changes — restart the dev server
> after editing.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Project structure

The homepage (`app/page.tsx`) stacks a `Hero`, a scrollable `MainContent`, and a `Footer`.
`main-content.tsx` renders five sections in order:

| Section | Component | Content lives in |
| --- | --- | --- |
| Photos | `app/components/photos.tsx` | `app/lib/collections.ts` (`collections` array) + images in `public/photos/` |
| Videos | `app/components/videos.tsx` | `videos` array in the file itself + thumbnails in `public/videos/` |
| Kit | `app/components/kit.tsx` | `gear` and `rack` arrays in the file itself |
| Experience | `app/components/experience.tsx` | `chapters` array in the file itself |
| Contact | `app/components/contact.tsx` | form posts to formsubmit.co |

The photo section doubles as a teaser for the full archive: each collection also gets its own
gallery page at `/photos/[category]` (see `app/photos/[category]/page.tsx`,
`app/components/collection-gallery.tsx`, and the archive index at `app/photos/page.tsx` /
`app/components/photo-archive.tsx`), sourced from the same `collections.ts` data.

```
app/
├── components/          # All UI sections and shared chrome
│   ├── hero.tsx             Viewfinder hero
│   ├── main-content.tsx     Scroll-driven section stack + floating title pill
│   ├── photos.tsx           Homepage film-canister shelf teaser
│   ├── photo-archive.tsx    /photos archive index
│   ├── collection-gallery.tsx  /photos/[category] gallery + lightbox
│   ├── videos.tsx           NLE-timeline video section
│   ├── kit.tsx              Flight-case gear + post-production rack
│   ├── experience.tsx       Manual-focus-lens career timeline
│   ├── contact.tsx          Booking inquiry form
│   ├── navbar.tsx           Side navbar with scroll progress
│   ├── letterbox.tsx        Fixed letterbox bars
│   ├── focus-text.tsx       Animated heading text
│   └── footer.tsx
├── lib/
│   └── collections.ts   Photo collection + per-photo EXIF data
├── photos/
│   ├── page.tsx          /photos archive
│   └── [category]/page.tsx  Per-collection gallery
├── layout.tsx            Fonts, metadata, JSON-LD
├── page.tsx               Homepage
├── manifest.ts / robots.ts / sitemap.ts
└── globals.css
public/
├── photos/                Gallery images (temp/ holds placeholder gradients)
└── videos/                Video thumbnails
```

## Editing content

- **Photos** — edit the `collections` array in `app/lib/collections.ts` (title, description,
  EXIF, per-photo `width`/`height`). Real exports replace the placeholder gradients in
  `public/photos/temp/` — see [`public/photos/README.md`](public/photos/README.md) for export
  tips.
- **Videos** — edit the `videos` array in `app/components/videos.tsx`. Drop thumbnails in
  `public/videos/` — see [`public/videos/README.md`](public/videos/README.md).
- **Gear & software** — `app/components/kit.tsx` (`gear` and `rack` arrays).
- **Experience timeline** — `app/components/experience.tsx` (`chapters` array).

## Deploying to the subdomain

1. Push this repo to GitHub and import it into the same host as the main portfolio.
2. Add `studio.mahanghafarian.com` as the project's custom domain.
3. Add the CNAME record the host gives you at the DNS provider for `mahanghafarian.com`.
