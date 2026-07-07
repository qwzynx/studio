# Photos

Drop gallery images here (e.g. `harbor.jpg`), then set the matching `image` field
in `app/components/photos.tsx` to `"/photos/harbor.jpg"`.

Tips:
- Export at ~2000px on the long edge, JPEG quality ~80 — `next/image` handles the rest.
- Match the `aspect` field ("portrait" 3:4, "square" 1:1, "wide" 16:9) to the crop
  you export, since the tile crops with `object-cover`.
- Update the `exif` fields; they show in the hover caption.
