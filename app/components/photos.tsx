"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";

// Photos live in public/photos/ — see public/photos/README.md.
// Set image to e.g. "/photos/harbor.jpg"; empty string shows a gradient placeholder.
// aspect controls the tile shape: "portrait" (3/4), "square" (1/1), or "wide" (16/9).
const photos = [
  {
    title: "Golden Hour Portrait",
    category: "Portrait",
    image: "",
    aspect: "portrait",
    gradient: "from-amber-500 to-orange-700",
    exif: { camera: "Sony A7 III", lens: "85mm", settings: "f/1.8 · 1/250 · ISO 100" },
  },
  {
    title: "City After Rain",
    category: "Street",
    image: "",
    aspect: "wide",
    gradient: "from-slate-600 to-cyan-900",
    exif: { camera: "Sony A7 III", lens: "35mm", settings: "f/2.8 · 1/125 · ISO 800" },
  },
  {
    title: "Still Life Study",
    category: "Studio",
    image: "",
    aspect: "square",
    gradient: "from-stone-500 to-neutral-800",
    exif: { camera: "Sony A7 III", lens: "50mm", settings: "f/8 · 1/160 · ISO 100" },
  },
  {
    title: "Northern Escape",
    category: "Landscape",
    image: "",
    aspect: "wide",
    gradient: "from-emerald-700 to-teal-950",
    exif: { camera: "Sony A7 III", lens: "16-35mm", settings: "f/11 · 1/60 · ISO 100" },
  },
  {
    title: "Late Night Neon",
    category: "Street",
    image: "",
    aspect: "portrait",
    gradient: "from-fuchsia-700 to-indigo-950",
    exif: { camera: "Sony A7 III", lens: "35mm", settings: "f/1.8 · 1/60 · ISO 3200" },
  },
  {
    title: "Frozen Motion",
    category: "Sport",
    image: "",
    aspect: "square",
    gradient: "from-red-600 to-rose-950",
    exif: { camera: "Sony A7 III", lens: "70-200mm", settings: "f/2.8 · 1/2000 · ISO 400" },
  },
];

const aspectClass: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-video sm:col-span-2",
};

export default function Photos({ hideTitle = false }: { hideTitle?: boolean }) {
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

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 [grid-auto-flow:dense]">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
            className={`relative group rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-colors duration-500 ${aspectClass[photo.aspect]}`}
          >
            {photo.image ? (
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
            ) : (
              <div className={`absolute inset-0 bg-linear-to-br ${photo.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-700 flex items-center justify-center`}>
                <Camera className="text-white/30" size={40} />
              </div>
            )}

            {/* Category chip */}
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 border border-white/10">
              {photo.category}
            </span>

            {/* EXIF caption slides up on hover, like a darkroom contact sheet note */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/75 backdrop-blur-md p-4 border-t border-white/10">
              <p className="text-white font-bold text-sm tracking-tight">{photo.title}</p>
              <p className="text-gray-400 text-[11px] font-mono mt-1 tracking-wide">
                {photo.exif.camera} · {photo.exif.lens} · {photo.exif.settings}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
