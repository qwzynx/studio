"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";

// Thumbnails live in public/videos/ — see public/videos/README.md.
// Set thumbnail to e.g. "/videos/short.jpg"; empty string shows a gradient placeholder.
// link can point to YouTube/Vimeo; empty string renders the card without a link.
const videos = [
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

/* Camera-viewfinder corner brackets; they spread outward slightly on hover
   like a focus frame locking on. */
function ViewfinderCorners() {
  const corners = [
    "top-2 left-2 border-t-2 border-l-2 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5",
    "top-2 right-2 border-t-2 border-r-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
    "bottom-2 left-2 border-b-2 border-l-2 group-hover:-translate-x-0.5 group-hover:translate-y-0.5",
    "bottom-2 right-2 border-b-2 border-r-2 group-hover:translate-x-0.5 group-hover:translate-y-0.5",
  ];
  return (
    <>
      {corners.map((pos) => (
        <span
          key={pos}
          className={`absolute w-3 h-3 md:w-4 md:h-4 border-white/40 group-hover:border-amber-400/90 transition-all duration-500 ${pos}`}
        />
      ))}
    </>
  );
}

export default function Videos({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section id="videos" className="w-full flex flex-col items-start z-10 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col items-start mb-10 ${hideTitle ? "hidden" : ""}`}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
          VIDEOS
        </h2>
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">Moving pictures, moving people</p>
      </motion.div>

      <div className="w-full flex flex-col gap-8 md:gap-10">
        {videos.map((video, index) => {
          const card = (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.08 }}
              className="group relative w-full flex gap-3 md:gap-4 items-stretch rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 p-3 md:p-4 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15),0_10px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Ghost take number, like a slate marker */}
              <span
                aria-hidden
                className="absolute -top-3 right-4 md:right-6 font-mono text-4xl md:text-6xl font-black text-white/[0.05] group-hover:text-amber-400/15 tracking-tighter select-none pointer-events-none transition-colors duration-700"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <Sprockets />

              {/* Thumbnail frame */}
              <div className="relative w-2/5 min-w-[130px] max-w-sm aspect-video rounded-lg overflow-hidden border border-white/10 self-center bg-black">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 40vw, 350px"
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-linear-to-br ${video.gradient} opacity-60 group-hover:opacity-80 group-hover:scale-[1.05] transition-all duration-700`} />
                )}

                {/* Letterbox vignette so the frame reads like graded footage */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                {/* Scanline sheen on hover */}
                <div className="scanlines absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <ViewfinderCorners />

                {/* REC indicator — wakes up when the card is "rolling" */}
                <span className="absolute top-2.5 left-6 md:left-7 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-rec-blink" />
                  <span className="text-[8px] md:text-[10px] font-mono font-bold text-white/90 tracking-[0.2em]">REC</span>
                </span>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-amber-500/90 group-hover:border-amber-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.45)] transition-all duration-500">
                    <Play size={18} className="text-white group-hover:text-black ml-0.5 transition-colors duration-500" fill="currentColor" />
                  </div>
                </div>

                {/* Duration timecode */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] md:text-xs font-mono text-amber-300 tracking-wider border border-white/10">
                  {video.duration}
                </span>

                {/* Playback scrub bar — fills while hovered, as if previewing */}
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10">
                  <div className="scrub-fill h-full bg-amber-400/90 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <span className="text-gray-500 text-xs md:text-sm font-mono">{video.year}</span>
                </div>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed mt-1 md:mt-2 line-clamp-3">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                  {video.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors duration-500"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <Sprockets />
            </motion.article>
          );

          return video.link ? (
            <a key={video.title} href={video.link} target="_blank" rel="noopener noreferrer" className="block">
              {card}
            </a>
          ) : (
            <div key={video.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
