"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { collections, type Collection, type CollectionPhoto } from "../lib/collections";

// The cascade next to the header: a couple of frames per row, each row growing
// and stepping further in from the right edge until it hands off to the
// masonry list. Heights are clamped for responsiveness; widths follow each
// photo's own ratio.
const STAIR_ROWS = [
  { count: 2, height: "clamp(64px, 10vw, 140px)", offset: "0%" },
  { count: 2, height: "clamp(84px, 13vw, 180px)", offset: "8%" },
  { count: 2, height: "clamp(104px, 16vw, 225px)", offset: "18%" },
];

// Slight scatter so the prints read as laid out by hand on a light table;
// each frame straightens as you hover it. Pattern repeats every six frames.
const TILTS = [-1.3, 0.9, -0.6, 1.4, -1.0, 0.7];

// Borderless polaroid: the image at its native ratio with a white title strip
// underneath, plus contact-sheet details — a rebate frame number and a warm
// light-leak sweep on hover, matching the shelf's preview frames. Pass
// `height` to size the frame by height (staircase) instead of by container
// width (masonry). `index` is the photo's position in the whole roll.
function PolaroidFrame({
  photo,
  index,
  onClick,
  height,
  sizes,
}: {
  photo: CollectionPhoto;
  index: number;
  onClick: () => void;
  height?: string;
  sizes: string;
}) {
  const ratio = photo.width / photo.height;
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6 }}
      onClick={onClick}
      className="group cursor-zoom-in"
      style={height ? { width: `calc(${height} * ${ratio})` } : undefined}
    >
      {/* Tilt/lift live on this wrapper, not the motion.figure — framer owns
          that element's `transform`, while the native rotate/translate
          properties here compose with it instead of fighting it. */}
      <div
        className="rotate-(--tilt) shadow-[0_12px_35px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:rotate-0 group-hover:-translate-y-1 group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
        style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as React.CSSProperties}
      >
        {/* The print develops as it scrolls into view: washed-out and soft → sharp, full color */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { filter: "sepia(0.45) brightness(1.35) contrast(0.75) saturate(0.35) blur(5px)" }
          }
          whileInView={{ filter: "sepia(0) brightness(1) contrast(1) saturate(1) blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative overflow-hidden bg-neutral-900"
          style={{ aspectRatio: `${photo.width} / ${photo.height}`, height }}
        >
          <Image
            src={photo.src}
            alt={photo.title}
            fill
            sizes={sizes}
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
          {/* Warm light leak sweeping the print once per hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent" />
          </div>
          {/* Rebate frame number, contact-sheet style */}
          <span className="absolute bottom-1 right-1.5 font-mono text-[8px] md:text-[9px] font-bold tracking-widest text-amber-300/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {String(index + 1).padStart(2, "0")}A
          </span>
        </motion.div>
        <figcaption className="bg-white px-3 py-2">
          <p className="text-neutral-900 text-[11px] md:text-xs font-semibold tracking-wide truncate">
            {photo.title}
          </p>
        </figcaption>
      </div>
    </motion.figure>
  );
}

export default function CollectionGallery({ collection }: { collection: Collection }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  // True while a swipe is in flight, so the click that follows a drag release
  // doesn't fall through to the backdrop and close the viewer.
  const draggingRef = useRef(false);

  const stairStarts = STAIR_ROWS.map((_, i) =>
    STAIR_ROWS.slice(0, i).reduce((sum, r) => sum + r.count, 0)
  );
  const stairRows = STAIR_ROWS.map((row, i) => {
    const start = stairStarts[i];
    return { ...row, start, photos: collection.photos.slice(start, start + row.count) };
  });
  const stairTotal = STAIR_ROWS.reduce((sum, r) => sum + r.count, 0);
  const listPhotos = collection.photos.slice(stairTotal);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setLightboxIndex((current) =>
        current === null
          ? current
          : (current + delta + collection.photos.length) % collection.photos.length
      );
    },
    [collection.photos.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, close, step]);

  const selected = lightboxIndex === null ? null : collection.photos[lightboxIndex];
  // The frames flanking the open one — mounted invisibly in the lightbox so
  // stepping (or swiping) lands on an already-decoded image, not a black gap.
  const neighbours =
    lightboxIndex === null
      ? []
      : [-1, 1].map(
          (d) =>
            collection.photos[
              (lightboxIndex + d + collection.photos.length) % collection.photos.length
            ]
        );

  // Roll-to-roll navigation along the shelf order, wrapping at the ends.
  const rollIndex = collections.findIndex((c) => c.slug === collection.slug);
  const prevRoll = collections[(rollIndex - 1 + collections.length) % collections.length];
  const nextRoll = collections[(rollIndex + 1) % collections.length];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 md:pt-28 pb-28 md:pb-36 relative z-10">
      {/* Title/description top-left, waterfall of frames cascading from top-right */}
      <div className="w-full flex flex-col md:flex-row md:items-start gap-12 md:gap-8">
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-2/5 md:sticky md:top-28 shrink-0"
        >
          <Link
            href="/#photos"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 text-xs font-bold uppercase tracking-[0.25em] mb-8"
          >
            <ArrowLeft size={14} />
            All collections
          </Link>
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white uppercase">
            {collection.name}
          </h1>
          <p className="text-amber-400 mt-4 text-sm italic font-semibold tracking-widest uppercase">
            {collection.tagline}
          </p>
          {/* Label stripe — the same gradient wash as this roll's canister on the shelf */}
          <div
            className={`mt-6 h-1 w-24 rounded-full bg-linear-to-r ${collection.gradient}`}
            aria-hidden
          />
          <p className="text-gray-400 mt-6 text-sm md:text-base leading-relaxed max-w-md">
            {collection.description}
          </p>
          <p className="text-gray-600 mt-6 text-[11px] font-mono font-bold tracking-widest uppercase">
            Roll {collection.slug}-135 · {collection.photos.length} exp ·{" "}
            <span className="text-amber-400/80">developed</span>
          </p>
        </motion.header>

        <div className="flex-1 flex flex-col items-end gap-5 md:gap-6 min-w-0">
          {stairRows.map((row) => (
            <div
              key={row.start}
              className="flex items-end justify-end gap-4 md:gap-5"
              style={{ marginRight: row.offset }}
            >
              {row.photos.map((photo, j) => (
                <PolaroidFrame
                  key={photo.src}
                  photo={photo}
                  index={row.start + j}
                  height={row.height}
                  sizes="(max-width: 768px) 45vw, 22vw"
                  onClick={() => setLightboxIndex(row.start + j)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Film-edge divider: the staircase hands off to the full contact sheet */}
      <div className="mt-10 md:mt-14 mb-8 md:mb-10 flex items-center gap-3 md:gap-4" aria-hidden>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-white/20" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-full bg-white/20" />
          ))}
        </div>
        <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
          full roll
        </p>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-full bg-white/20" />
          ))}
        </div>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-white/10 to-white/20" />
      </div>

      {/* The waterfall widens into the scrollable list */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8">
        {listPhotos.map((photo, i) => (
          <div key={photo.src} className="mb-6 md:mb-8 break-inside-avoid">
            <PolaroidFrame
              photo={photo}
              index={stairTotal + i}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onClick={() => setLightboxIndex(stairTotal + i)}
            />
          </div>
        ))}
      </div>

      {/* Shelf navigation — step to the neighbouring rolls or back to the
          full archive, so a roll never dead-ends */}
      <nav
        aria-label="Other collections"
        className="mt-14 flex items-center justify-between gap-4 border-t border-white/10 pt-6 md:mt-20 md:pt-8"
      >
        <Link
          href={`/photos/${prevRoll.slug}`}
          className="group flex min-w-0 items-center gap-2 text-left"
        >
          <ArrowLeft
            size={14}
            className="flex-none text-gray-600 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-amber-400"
          />
          <span className="min-w-0">
            <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-gray-600 md:text-[9px]">
              previous roll
            </span>
            <span className="block truncate text-sm font-bold tracking-tight text-gray-300 transition-colors duration-300 group-hover:text-amber-300 md:text-base">
              {prevRoll.name}
            </span>
          </span>
        </Link>

        <Link
          href="/photos"
          className="hidden flex-none rounded-full border border-white/10 px-5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 transition-all duration-300 hover:border-amber-400/50 hover:text-amber-400 sm:block md:text-[10px]"
        >
          the archive
        </Link>

        <Link
          href={`/photos/${nextRoll.slug}`}
          className="group flex min-w-0 items-center gap-2 text-right"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-gray-600 md:text-[9px]">
              next roll
            </span>
            <span className="block truncate text-sm font-bold tracking-tight text-gray-300 transition-colors duration-300 group-hover:text-amber-300 md:text-base">
              {nextRoll.name}
            </span>
          </span>
          <ArrowRight
            size={14}
            className="flex-none text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400"
          />
        </Link>
      </nav>

      {/* Fullscreen viewer — portaled to <body> so the page wrapper's stacking
          context can't trap it under the fixed navbar */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
        {selected && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
          >
            {/* Viewfinder HUD readout, same language as the hero */}
            <div className="absolute top-7 left-6 md:top-8 md:left-8 z-10 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 select-none">
              <span className="text-amber-400/90">
                {String(lightboxIndex + 1).padStart(2, "0")}A
              </span>
              <span> · {collection.name}</span>
            </div>

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 p-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous photo"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-500 hover:text-white transition-colors duration-300"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next photo"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-500 hover:text-white transition-colors duration-300"
            >
              <ChevronRight size={36} />
            </button>

            {/* Each frame opens like an aperture iris. Dragging sideways
                advances the roll — swipe left for the next frame, right for
                the previous; the elastic constraints snap the print back if
                the pull doesn't clear the threshold. */}
            <motion.div
              key={selected.src}
              initial={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at 50% 50%)", opacity: 0.6 }}
              animate={{ clipPath: "circle(100% at 50% 50%)", opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={() => {
                draggingRef.current = true;
              }}
              onDragEnd={(_, info) => {
                const pull = info.offset.x + info.velocity.x * 0.2;
                if (pull < -80) step(1);
                else if (pull > 80) step(-1);
                setTimeout(() => {
                  draggingRef.current = false;
                }, 0);
              }}
              className="relative flex-1 m-6 md:m-12 mb-0 touch-pan-y"
              onClick={(e) => {
                // The stage fills the screen but the print is letterboxed
                // inside it (object-contain). Only a click that lands on the
                // print itself keeps the viewer open — the empty margins act
                // like the backdrop and close it.
                if (draggingRef.current) {
                  e.stopPropagation();
                  return;
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = selected.width / selected.height;
                const printW = Math.min(rect.width, rect.height * ratio);
                const printH = printW / ratio;
                const x0 = rect.left + (rect.width - printW) / 2;
                const y0 = rect.top + (rect.height - printH) / 2;
                const onPrint =
                  e.clientX >= x0 &&
                  e.clientX <= x0 + printW &&
                  e.clientY >= y0 &&
                  e.clientY <= y0 + printH;
                if (onPrint) e.stopPropagation();
              }}
            >
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                sizes="100vw"
                className="object-contain"
                loading="eager"
              />
              {/* Invisible neighbours, already decoded for the next step */}
              <div className="pointer-events-none absolute inset-0 opacity-0" aria-hidden>
                {neighbours.map((photo) => (
                  <Image
                    key={photo.src}
                    src={photo.src}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain"
                    loading="eager"
                  />
                ))}
              </div>
              {/* Viewfinder corner brackets framing the stage */}
              <span className="absolute top-0 left-0 w-6 h-6 md:w-10 md:h-10 border-t-2 border-l-2 border-white/25 pointer-events-none" aria-hidden />
              <span className="absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 border-t-2 border-r-2 border-white/25 pointer-events-none" aria-hidden />
              <span className="absolute bottom-0 left-0 w-6 h-6 md:w-10 md:h-10 border-b-2 border-l-2 border-white/25 pointer-events-none" aria-hidden />
              <span className="absolute bottom-0 right-0 w-6 h-6 md:w-10 md:h-10 border-b-2 border-r-2 border-white/25 pointer-events-none" aria-hidden />
            </motion.div>

            {/* No stopPropagation here — a click anywhere off the print
                (caption strip included) closes the viewer */}
            <div className="shrink-0 px-6 md:px-12 py-6 text-center">
              <p className="text-white font-bold text-base md:text-lg tracking-tight">
                {selected.title}
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
                {selected.description}
              </p>
              {/* Shooting data, contact-sheet style */}
              <p className="mt-3 font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500">
                <span className="text-amber-400/80">{selected.exif.aperture}</span>
                <span className="mx-2 text-white/20">·</span>
                <span>
                  {/* Long exposures already carry their unit ("30s") */}
                  {selected.exif.shutter.endsWith("s")
                    ? selected.exif.shutter
                    : `${selected.exif.shutter}s`}
                </span>
                <span className="mx-2 text-white/20">·</span>
                <span>ISO {selected.exif.iso}</span>
              </p>
              <p className="text-[10px] font-mono font-bold tracking-[0.3em] mt-3">
                <span className="text-amber-400/90">
                  {String(lightboxIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-white/25">
                  /{String(collection.photos.length).padStart(2, "0")}
                </span>
              </p>
            </div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
