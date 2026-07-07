# MG Studio — Photography & Videography Portfolio

Lives at [studio.mahanghafarian.com](https://studio.mahanghafarian.com). Sister site
to the engineering portfolio at [mahanghafarian.com](https://mahanghafarian.com) —
same dark look and fonts, rebuilt around a camera/cinema visual language
(letterbox bars, viewfinder hero, film-strip cards).

## Editing content

- **Photos** — `app/components/photos.tsx` (`photos` array) + images in `public/photos/`
- **Films** — `app/components/films.tsx` (`films` array) + thumbnails in `public/films/`
- **Gear & software** — `app/components/kit.tsx` (`gear` and `post` arrays)

## Development

```bash
npm install
npm run dev
```

Note: on the NTFS mount, hot reload doesn't pick up file changes — restart the dev
server after editing.

## Deploying to the subdomain

1. Push this repo to GitHub and import it into the same host as the main portfolio.
2. Add `studio.mahanghafarian.com` as the project's custom domain.
3. Add the CNAME record the host gives you at the DNS provider for `mahanghafarian.com`.
