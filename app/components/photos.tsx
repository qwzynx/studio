"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { collections } from "../lib/collections";

// Tiles are categories; each links to its collection at /photos/[slug].
// Collection data (photos, titles, descriptions) lives in app/lib/collections.ts.
const wideTiles = new Set(["street", "landscape", "events"]);

export default function Photos({ hideTitle = false }: { hideTitle?: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Autofocus reticle that trails the cursor across the grid and locks onto tiles
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reticleX = useSpring(mouseX, { stiffness: 350, damping: 30 });
  const reticleY = useSpring(mouseY, { stiffness: 350, damping: 30 });
  const [reticle, setReticle] = useState({ visible: false, locked: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = gridRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
    const locked = !!(e.target as HTMLElement).closest("a");
    setReticle((r) => (r.visible && r.locked === locked ? r : { visible: true, locked }));
  };

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
        ref={gridRef}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={() => setReticle((r) => ({ ...r, visible: false }))}
        className="relative w-full"
      >
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 [grid-auto-flow:dense]">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
            className={
              wideTiles.has(collection.slug)
                ? "aspect-video sm:col-span-2"
                : "aspect-[4/3]"
            }
          >
            <Link
              href={`/photos/${collection.slug}`}
              className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-colors duration-500 block w-full h-full"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${collection.gradient} opacity-40`} />
              <Image
                src={collection.photos[0].src}
                alt={collection.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.04] transition-all duration-700"
              />
              {/* Darken toward the bottom so the label stays readable */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Light leak sweep on hover */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent" />
              </div>

              {/* Photo count chip */}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 border border-white/10">
                {collection.photos.length} photos
              </span>

              <ArrowUpRight
                className="absolute top-3 right-3 text-white/40 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                size={20}
              />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-white font-bold text-xl md:text-2xl tracking-tight leading-none">
                  {collection.name}
                </p>
                <p className="text-gray-400 text-[11px] mt-1.5 italic font-semibold tracking-widest uppercase">
                  {collection.tagline}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Focus reticle trailing the cursor; turns amber and shrinks when it locks a tile */}
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
