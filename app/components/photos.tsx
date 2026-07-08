"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { collections, type Collection } from "../lib/collections";

// Each category is a film canister; the label carries the title and hovering
// rolls the strip out to reveal the cover photo and description.
//
// Layout: fixed rows of three (.film-shelf-row in globals.css). On hover the
// row's grid columns re-balance so the open roll pushes its neighbours, while
// the row total always equals the container width — no overflow, no wrap.
// The strip itself is fluid: it fills whatever width its column grants, and
// the description fades in so text never visibly reflows mid-animation.
// Collection data (photos, titles, descriptions) lives in app/lib/collections.ts.
type RollSize = "sm" | "md" | "lg";

const rollSizes: Record<string, RollSize> = {
  portrait: "lg",
  street: "md",
  landscape: "lg",
  nature: "sm",
  night: "sm",
  studio: "md",
  product: "md",
  architecture: "lg",
  events: "sm",
};

const rollConfig: Record<RollSize, { height: string; canister: string; title: string }> = {
  lg: { height: "h-44 md:h-52", canister: "w-24 md:w-28", title: "text-xl md:text-2xl" },
  md: { height: "h-36 md:h-40", canister: "w-20 md:w-24", title: "text-lg md:text-xl" },
  sm: { height: "h-28 md:h-32", canister: "w-16 md:w-20", title: "text-base md:text-lg" },
};

function SprocketRow() {
  return (
    <div className="h-3 flex-none overflow-hidden px-2" aria-hidden>
      <div className="film-transport-x flex w-max gap-2.5 [--sprocket-step-x:1.125rem]">
        {Array.from({ length: 72 }).map((_, i) => (
          <span key={i} className="mt-[3px] h-1.5 w-2 flex-none rounded-full bg-white/25" />
        ))}
      </div>
    </div>
  );
}

function FilmRoll({ collection, index }: { collection: Collection; index: number }) {
  const size = rollSizes[collection.slug] ?? "md";
  const cfg = rollConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className={`w-full min-w-0 ${cfg.height}`}
    >
      <Link
        href={`/photos/${collection.slug}`}
        className="group flex h-full w-full items-center"
      >
        {/* Canister — the cylinder carrying the category title */}
        <div className={`relative z-10 h-full flex-none ${cfg.canister}`}>
          <div className="absolute inset-0 rounded-2xl border border-white/10 bg-neutral-900 shadow-lg shadow-black/40 transition-colors duration-500 group-hover:border-amber-400/40" />
          {/* Slim end caps */}
          <div className="absolute inset-x-3 top-1.5 h-px bg-white/15" />
          <div className="absolute inset-x-3 bottom-1.5 h-px bg-white/15" />
          {/* Label */}
          <div
            className={`absolute inset-x-1.5 top-3 bottom-3 overflow-hidden rounded-xl bg-linear-to-b ${collection.gradient} transition-shadow duration-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]`}
          >
            {/* Faint curvature so the label still reads as a cylinder */}
            <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/25" />
            {/* Process dots */}
            <div className="absolute top-2 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
              <span className="h-1 w-1 rounded-full bg-white/80" />
              <span className="h-1 w-1 rounded-full bg-white/50" />
              <span className="h-1 w-1 rounded-full bg-white/30" />
            </div>
            <div className="relative flex h-full items-center justify-center gap-0.5 overflow-hidden px-1 pt-2">
              <p
                className={`[writing-mode:vertical-rl] rotate-180 whitespace-nowrap ${cfg.title} font-bold tracking-tight text-white drop-shadow-sm`}
              >
                {collection.name}
              </p>
              <p className="max-h-full [writing-mode:vertical-rl] rotate-180 truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
                {collection.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Film strip — a leader tab when closed; rolls out to fill the column */}
        <div className="relative -ml-2 h-[80%] min-w-0 flex-1 overflow-hidden max-w-full sm:max-w-6 sm:group-hover:max-w-full sm:group-focus-within:max-w-full transition-[max-width] duration-[650ms] ease-[cubic-bezier(0.33,1,0.4,1)]">
          <div className="flex h-full w-full flex-col rounded-r-2xl border border-white/10 bg-neutral-950/90">
            <SprocketRow />

            <div className="flex min-h-0 flex-1 items-stretch gap-2 pl-4 pr-2.5 py-1 md:gap-2.5 md:pr-3">
              {/* Cover photo frame */}
              <div className="relative aspect-[4/3] h-full flex-none overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={collection.photos[0].src}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 640px) 40vw, 320px"
                  className="object-cover"
                />
                {/* Light leak sweep on hover */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent" />
                </div>
              </div>

              {/* Frame-edge marking */}
              <span
                className="flex-none self-center [writing-mode:vertical-rl] rotate-180 font-mono text-[8px] font-bold tracking-[0.2em] text-amber-400/60"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}A
              </span>

              {/* Description frame — fades in once the strip is mostly out,
                  so the fluid width never shows text re-wrapping */}
              <div className="relative flex min-w-0 flex-1 flex-col justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-3.5 md:px-5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-200 sm:group-hover:duration-500 sm:group-hover:delay-150 sm:group-focus-within:duration-500 sm:group-focus-within:delay-150">
                <div className={`absolute inset-0 bg-linear-to-br ${collection.gradient} opacity-10`} />
                <p className="relative text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300 md:text-[10px]">
                  {collection.tagline}
                </p>
                <p className="relative mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-gray-300 md:line-clamp-3 md:text-sm">
                  {collection.description}
                </p>
                <p className="relative mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 md:text-[10px]">
                  {collection.photos.length} photos
                  <ArrowUpRight
                    size={12}
                    className="text-amber-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </p>
              </div>
            </div>

            <SprocketRow />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Photos({ hideTitle = false }: { hideTitle?: boolean }) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Autofocus reticle that trails the cursor across the shelf and locks onto rolls
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reticleX = useSpring(mouseX, { stiffness: 350, damping: 30 });
  const reticleY = useSpring(mouseY, { stiffness: 350, damping: 30 });
  const [reticle, setReticle] = useState({ visible: false, locked: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = shelfRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
    const locked = !!(e.target as HTMLElement).closest("a");
    setReticle((r) => (r.visible && r.locked === locked ? r : { visible: true, locked }));
  };

  const rows: Collection[][] = [];
  for (let i = 0; i < collections.length; i += 3) {
    rows.push(collections.slice(i, i + 3));
  }

  return (
    <section id="photos" className="w-full flex flex-col items-start z-10 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col items-start mb-10 ${hideTitle ? "hidden" : ""}`}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
          PHOTOS
        </h2>
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">Stills worth a thousand frames</p>
      </motion.div>

      <div
        ref={shelfRef}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={() => setReticle((r) => ({ ...r, visible: false }))}
        className="relative w-full"
      >
        <div className="flex w-full flex-col gap-5 md:gap-6">
          {rows.map((row, r) => (
            <div key={r} className="film-shelf-row w-full">
              {row.map((collection, i) => (
                <FilmRoll key={collection.slug} collection={collection} index={r * 3 + i} />
              ))}
            </div>
          ))}
        </div>

        {/* Focus reticle trailing the cursor; turns amber and shrinks when it locks a roll */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            style={{ x: reticleX, y: reticleY }}
            animate={{ opacity: reticle.visible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 w-0 h-0 z-20 pointer-events-none hidden lg:block"
          >
            <motion.div
              animate={{ scale: reticle.locked ? 0.8 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ x: "-50%", y: "-50%" }}
              className={`relative w-16 h-16 transition-colors duration-200 ${
                reticle.locked ? "text-amber-400" : "text-white/60"
              }`}
            >
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-current" />
              <span
                className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tracking-[0.2em] transition-opacity duration-200 ${
                  reticle.locked ? "opacity-100" : "opacity-0"
                }`}
              >
                AF·LOCK
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
