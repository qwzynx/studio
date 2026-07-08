# Photos

Gallery images live here. `temp/` holds placeholder gradients — replace them with
real exports (e.g. `portrait/golden-hour.jpg`), then update the matching entry in
`app/lib/collections.ts` (`src`, `width`, `height`, `title`, `description`).

Tips:
- Export at ~2000px on the long edge, JPEG quality ~80 — `next/image` handles the rest.
- `width`/`height` must match the actual file: the gallery frames take the shape of
  each picture's ratio, so wrong values will stretch or crop it.
- `title` shows on the white strip under each frame; `description` shows in the
  fullscreen viewer.
