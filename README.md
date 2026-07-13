# MG Studio — Photography & Videography Portfolio

Lives at [studio.mahanghafarian.com](https://studio.mahanghafarian.com). Sister site
to the engineering portfolio at [mahanghafarian.com](https://mahanghafarian.com) —
same dark look and fonts, rebuilt around a camera/cinema visual language
(letterbox bars, viewfinder hero, film-strip cards).

## Development

```bash
npm install
npm run dev
```

Note: on the NTFS mount, hot reload doesn't pick up file changes — restart the dev
server after editing.

## Structure

The homepage (`app/page.tsx`) stacks a hero and a scrollable
`main-content.tsx`, which renders five sections in order:

| Section | Component | Content lives in |
| --- | --- | --- |
| Photos | `app/components/photos.tsx` | `app/lib/collections.ts` (`collections` array) + images in `public/photos/` |
| Videos | `app/components/videos.tsx` | `videos` array in the file itself + thumbnails in `public/videos/` |
| Kit | `app/components/kit.tsx` | `gear` and `rack` arrays in the file itself |
| Experience | `app/components/experience.tsx` | `chapters` array in the file itself |
| Contact | `app/components/contact.tsx` | form posts to formsubmit.co |

The photo section doubles as a teaser for the full archive: each collection
also gets its own gallery page at `/photos/[category]` (see
`app/photos/[category]/page.tsx` and `app/photos/page.tsx`), sourced from the
same `collections.ts` data.

## Editing content

- **Photos** — edit the `collections` array in `app/lib/collections.ts` (title,
  description, EXIF, per-photo `width`/`height`). Real exports replace the
  placeholder gradients in `public/photos/temp/` — see
  [`public/photos/README.md`](public/photos/README.md) for export tips.
- **Videos** — edit the `videos` array in `app/components/videos.tsx`. Drop
  thumbnails in `public/videos/` — see
  [`public/videos/README.md`](public/videos/README.md).
- **Gear & software** — `app/components/kit.tsx` (`gear` and `rack` arrays).
- **Experience timeline** — `app/components/experience.tsx` (`chapters` array).

## Deploying to the subdomain

1. Push this repo to GitHub and import it into the same host as the main portfolio.
2. Add `studio.mahanghafarian.com` as the project's custom domain.
3. Add the CNAME record the host gives you at the DNS provider for `mahanghafarian.com`.
