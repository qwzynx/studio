"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Collection, CollectionPhoto } from "../lib/collections";

// The cascade next to the header: a couple of frames per row, each row growing
// and stepping further in from the right edge until it hands off to the
// masonry list. Heights are clamped for responsiveness; widths follow each
// photo's own ratio.
const STAIR_ROWS = [
  { count: 2, height: "clamp(64px, 10vw, 140px)", offset: "0%" },
  { count: 2, height: "clamp(84px, 13vw, 180px)", offset: "8%" },
  { count: 2, height: "clamp(104px, 16vw, 225px)", offset: "18%" },
];

// Borderless polaroid: the image at its native ratio with a white title strip
// underneath. Pass `height` to size the frame by height (staircase) instead of
// by container width (masonry).
function PolaroidFrame({
  photo,
  onClick,
  height,
  sizes,
}: {
  photo: CollectionPhoto;
  onClick: () => void;
  height?: string;
  sizes: string;
}) {
  const ratio = photo.width / photo.height;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6 }}
      onClick={onClick}
      className="group cursor-zoom-in shadow-[0_12px_35px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-500"
      style={height ? { width: `calc(${height} * ${ratio})` } : undefined}
    >
      <div
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
      </div>
      <figcaption className="bg-white px-3 py-2">
        <p className="text-neutral-900 text-[11px] md:text-xs font-semibold tracking-wide truncate">
          {photo.title}
        </p>
      </figcaption>
    </motion.figure>
  );
}

export default function CollectionGallery({ collection }: { collection: Collection }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  let cursor = 0;
  const stairRows = STAIR_ROWS.map((row) => {
    const start = cursor;
    cursor += row.count;
    return { ...row, start, photos: collection.photos.slice(start, start + row.count) };
  });
  const stairTotal = cursor;
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
          <p className="text-gray-400 mt-6 text-sm md:text-base leading-relaxed max-w-md">
            {collection.description}
          </p>
          <p className="text-gray-600 mt-6 text-[11px] font-mono tracking-widest uppercase">
            {collection.photos.length} frames
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
                  height={row.height}
                  sizes="(max-width: 768px) 45vw, 22vw"
                  onClick={() => setLightboxIndex(row.start + j)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* The waterfall widens into the scrollable list */}
      <div className="mt-6 md:mt-8 columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8">
        {listPhotos.map((photo, i) => (
          <div key={photo.src} className="mb-6 md:mb-8 break-inside-avoid">
            <PolaroidFrame
              photo={photo}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onClick={() => setLightboxIndex(stairTotal + i)}
            />
          </div>
        ))}
      </div>

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

            <motion.div
              key={selected.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative flex-1 m-6 md:m-12 mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <div
              className="shrink-0 px-6 md:px-12 py-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white font-bold text-base md:text-lg tracking-tight">
                {selected.title}
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
                {selected.description}
              </p>
              <p className="text-gray-600 text-[10px] font-mono tracking-[0.3em] mt-3">
                {lightboxIndex + 1} / {collection.photos.length}
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
