"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";

// Thumbnails live in public/films/ — see public/films/README.md.
// Set thumbnail to e.g. "/films/short.jpg"; empty string shows a gradient placeholder.
// link can point to YouTube/Vimeo; empty string renders the card without a link.
const films = [
  {
    title: "Untitled Short Film",
    year: "2026",
    duration: "04:32",
    roles: ["Director", "Editor", "Colorist"],
    description:
      "A short film exploring light and solitude in the city — shot over three nights, edited and graded end to end.",
    thumbnail: "",
    gradient: "from-amber-700 to-red-950",
    link: "",
  },
  {
    title: "Event Recap",
    year: "2026",
    duration: "01:48",
    roles: ["Shooter", "Editor"],
    description:
      "Fast-cut recap capturing the energy of a live event — run-and-gun coverage cut to music.",
    thumbnail: "",
    gradient: "from-indigo-800 to-slate-950",
    link: "",
  },
  {
    title: "Travel Diary",
    year: "2025",
    duration: "03:15",
    roles: ["Shooter", "Editor", "Colorist"],
    description:
      "A visual diary from the road — handheld frames, natural light, and a warm film-inspired grade.",
    thumbnail: "",
    gradient: "from-emerald-800 to-cyan-950",
    link: "",
  },
];

/* Sprocket hole strip that makes each row read as physical film.
   On hover the holes roll upward like film running through a projector —
   .film-transport shifts by exactly one hole+gap (--sprocket-step) per loop. */
function Sprockets() {
  return (
    <div className="relative overflow-hidden shrink-0 w-2.5 md:w-3 my-1 [--sprocket-step:1.5rem] md:[--sprocket-step:1.75rem]">
      <div className="film-transport absolute inset-x-0 top-0 flex flex-col gap-3">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-2.5 h-3 md:w-3 md:h-4 rounded-[3px] bg-background border border-white/15 shrink-0" />
        ))}
      </div>
    </div>
  );
}

export default function Films({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section id="films" className="w-full flex flex-col items-start z-10 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col items-start mb-10 ${hideTitle ? "hidden" : ""}`}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
          FILMS
        </h2>
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">Moving pictures, moving people</p>
      </motion.div>

      <div className="w-full flex flex-col gap-8 md:gap-10">
        {films.map((film) => {
          const card = (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group w-full flex gap-3 md:gap-4 items-stretch rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 p-3 md:p-4 transition-colors duration-500"
            >
              <Sprockets />

              {/* Thumbnail frame */}
              <div className="relative w-2/5 min-w-[130px] max-w-sm aspect-video rounded-lg overflow-hidden border border-white/10 self-center">
                {film.thumbnail ? (
                  <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    sizes="(max-width: 768px) 40vw, 350px"
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-linear-to-br ${film.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-700`} />
                )}
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-amber-500/90 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-500">
                    <Play size={18} className="text-white group-hover:text-black ml-0.5 transition-colors duration-500" fill="currentColor" />
                  </div>
                </div>
                {/* Duration timecode */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] md:text-xs font-mono text-amber-300 tracking-wider">
                  {film.duration}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors duration-300">
                    {film.title}
                  </h3>
                  <span className="text-gray-500 text-xs md:text-sm font-mono">{film.year}</span>
                </div>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed mt-1 md:mt-2 line-clamp-3">
                  {film.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                  {film.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/90 bg-amber-500/10 border border-amber-500/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <Sprockets />
            </motion.article>
          );

          return film.link ? (
            <a key={film.title} href={film.link} target="_blank" rel="noopener noreferrer" className="block">
              {card}
            </a>
          ) : (
            <div key={film.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
