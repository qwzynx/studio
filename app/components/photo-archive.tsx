"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { collections } from "../lib/collections";

// The archive: every developed roll filed on one wall, each collection as a
// lab sleeve — cover contact print up top, sprocket edge, and the label strip
// underneath. Same film-lab language as the shelf and the gallery pages;
// clicking a sleeve opens that roll's gallery.

function SprocketEdge() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-3 items-center gap-2.5 overflow-hidden bg-black/70 px-2"
      aria-hidden
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="h-1.5 w-2 flex-none rounded-full bg-white/25" />
      ))}
    </div>
  );
}

function ArchiveSleeve({
  collection,
  index,
}: {
  collection: (typeof collections)[number];
  index: number;
}) {
  const cover = collection.photos[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/photos/${collection.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] outline-none transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-400/40 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:ring-amber-400/70"
      >
        {/* Cover contact print */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
          <SprocketEdge />
          <Image
            src={cover.src}
            alt={cover.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          {/* Label-gradient wash keyed to this roll's canister */}
          <div
            className={`absolute inset-0 bg-linear-to-tr ${collection.gradient} opacity-25 mix-blend-overlay`}
            aria-hidden
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" aria-hidden />
          {/* Warm light leak sweeping the print once per hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent" />
          </div>
          {/* Rebate markings, contact-sheet style */}
          <span className="absolute bottom-2 left-3 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">
            roll {collection.slug}-135
          </span>
          <span className="absolute bottom-2 right-3 font-mono text-[9px] font-bold tracking-[0.2em] text-amber-300/90">
            {collection.photos.length} exp
          </span>
        </div>

        {/* Label strip */}
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-amber-300 md:text-2xl">
              {collection.name}
            </h2>
            <ArrowUpRight
              size={16}
              className="flex-none text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-400"
            />
          </div>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400/80">
            {collection.tagline}
          </p>
          <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-400 md:text-sm">
            {collection.description}
          </p>
          <div
            className={`mt-4 h-1 w-14 rounded-full bg-linear-to-r ${collection.gradient} transition-all duration-500 group-hover:w-24`}
            aria-hidden
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function PhotoArchive() {
  const totalExposures = collections.reduce((sum, c) => sum + c.photos.length, 0);

  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-24 md:px-16 md:pb-36 md:pt-28">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link
          href="/#photos"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-400 transition-colors duration-300 hover:text-amber-400"
        >
          <ArrowLeft size={14} />
          Back to the studio
        </Link>
        <h1 className="font-heading text-5xl font-bold uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white md:text-7xl">
          The Archive
        </h1>
        <p className="mt-4 text-sm italic font-semibold uppercase tracking-widest text-amber-400">
          Every roll, developed
        </p>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
          The full shelf in one place — {collections.length} rolls,{" "}
          {totalExposures} frames that made it back from the lab. Pick a sleeve
          to open the roll.
        </p>
      </motion.header>

      {/* Film-edge divider, same as the gallery hand-off */}
      <div className="mb-8 mt-10 flex items-center gap-3 md:mb-10 md:mt-12 md:gap-4" aria-hidden>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-white/20" />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-full bg-white/20" />
          ))}
        </div>
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600 md:text-[10px]">
          {collections.length} rolls filed
        </p>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-full bg-white/20" />
          ))}
        </div>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-white/10 to-white/20" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {collections.map((collection, i) => (
          <ArchiveSleeve key={collection.slug} collection={collection} index={i} />
        ))}
      </div>
    </div>
  );
}
