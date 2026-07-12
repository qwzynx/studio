"use client";

import React from "react";
import { motion } from "framer-motion";

// The career hangs as a FILMOGRAPHY: a cinema corridor of one-sheet posters,
// each chapter of the story sold as its own feature film — festival laurels,
// a tagline, a billing block of micro-credits, and a plaque underneath with
// what actually happened. The current chapter runs under a NOW PLAYING
// marquee; a torn ticket stub at the bottom carries the career stats.
//
// Edit these to match the real story.
type Feature = {
  id: string;
  title: string[];
  year: string;
  genre: string;
  tagline: string;
  festival: string;
  synopsis: string;
  roles: string[];
  credits: string;
  tilt: string;
  nowPlaying?: boolean;
};

const features: Feature[] = [
  {
    id: "origin",
    title: ["THE HAND-ME-DOWN", "CAMERA"],
    year: "2019",
    genre: "Origin story",
    tagline: "Every story needs a first frame.",
    festival: "BACKYARD FILM FESTIVAL",
    synopsis:
      "A hand-me-down camera changes everything. Shot everything that stood still and most things that didn't — most frames were terrible, a few weren't, and that was enough.",
    roles: ["first camera", "golden hour"],
    credits:
      "MG STUDIO PRESENTS A GOLDEN-HOUR PRODUCTION “THE HAND-ME-DOWN CAMERA” STARRING ONE BORROWED BODY AND A KIT LENS · SHOT ENTIRELY ON AUTO · NO TRIPOD WAS HARMED",
    tilt: "lg:-rotate-1",
  },
  {
    id: "editor",
    title: ["EDITOR", "FOR HIRE"],
    year: "2021 – 2023",
    genre: "Workplace thriller",
    tagline: "Other people's footage. His pacing.",
    festival: "2 A.M. RENDER CLUB",
    synopsis:
      "Cutting recaps, travel diaries and shorts from other people's footage, for creators and student films — where the taste for pacing, sound and grade was built.",
    roles: ["editing", "grading"],
    credits:
      "MG STUDIO PRESENTS “EDITOR FOR HIRE” FEATURING NINETY-MINUTE EXPORTS AND ONE VERY TIRED LAPTOP · TIMELINE BY TRIAL AND ERROR · SLEEP APPEARS COURTESY OF NOBODY",
    tilt: "lg:rotate-[0.75deg]",
  },
  {
    id: "second-shooter",
    title: ["SECOND", "SHOOTER"],
    year: "2023 – 2024",
    genre: "Romantic epic",
    tagline: "One step ahead of the moment.",
    festival: "GRAND BALLROOM CIRCUIT",
    synopsis:
      "Weddings and live events taught the craft of reading a room — covering the angles the lead couldn't, and turning around same-week selects.",
    roles: ["events", "candid"],
    credits:
      "MG STUDIO PRESENTS “SECOND SHOOTER” WITH A CAST OF THREE HUNDRED GUESTS · CATERING NOT INCLUDED · FILMED ON LOCATION AT SOMEBODY ELSE'S BIG DAY",
    tilt: "lg:-rotate-[0.75deg]",
  },
  {
    id: "mg-studio",
    title: ["MG", "STUDIO"],
    year: "2024 – NOW",
    genre: "Feature presentation",
    tagline: "Written, shot & graded end to end.",
    festival: "IN THEATRES EVERYWHERE",
    synopsis:
      "A one-person operation running end to end — scouting, shooting, editing and grading portraits, events and short films, for clients and for the love of it.",
    roles: ["photography", "direction", "colour"],
    credits:
      "MG STUDIO PRESENTS A MAHAN GHAFARIAN PICTURE “MG STUDIO” WRITTEN SHOT EDITED GRADED AND DELIVERED BY THE SAME PAIR OF HANDS · SEQUEL IN PRODUCTION",
    tilt: "lg:rotate-1",
    nowPlaying: true,
  },
];

// Punched on the ticket stub under the poster wall.
const stats = ["7 years behind the lens", "36+ shoots delivered", "10k frames kept"];

// One branch of a festival laurel — mirrored with `flip` for the right side.
function Laurel({ flip = false }: { flip?: boolean }) {
  const leaves = [
    { x: 10.5, y: 36, r: -68 },
    { x: 7.5, y: 30.5, r: -52 },
    { x: 5.6, y: 24.5, r: -34 },
    { x: 5.0, y: 18.5, r: -16 },
    { x: 5.8, y: 12.5, r: 4 },
    { x: 8.0, y: 7.2, r: 26 },
    { x: 11.4, y: 3.2, r: 48 },
  ];
  return (
    <svg
      viewBox="0 0 16 40"
      aria-hidden
      className={`h-8 w-3.5 text-amber-200/70 transition-colors duration-500 group-hover:text-amber-300 ${
        flip ? "-scale-x-100" : ""
      }`}
    >
      <path
        d="M13 39 C5.5 32 3.5 21 8.5 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.7"
      />
      {leaves.map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={leaf.y}
          rx="1.7"
          ry="3.6"
          fill="currentColor"
          transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`}
        />
      ))}
    </svg>
  );
}

// The key art behind each poster's type — pure CSS, one scene per chapter.
function PosterArt({ id }: { id: string }) {
  switch (id) {
    case "origin":
      // Golden hour: a low sun sinking behind a dark horizon.
      return (
        <div className="absolute inset-0 bg-linear-to-b from-[#331a04] via-[#59290a] to-[#120a04]">
          <div className="absolute left-1/2 top-[30%] h-36 w-36 -translate-x-1/2 rounded-full bg-linear-to-b from-amber-200 via-amber-400 to-orange-700 opacity-90 blur-[2px]" />
          <div className="absolute left-1/2 top-[30%] h-36 w-36 -translate-x-1/2 rounded-full bg-amber-300/40 blur-2xl" />
          <div className="absolute inset-x-0 top-[52%] bottom-0 bg-linear-to-b from-[#1a0e04] to-black" />
          <div className="absolute inset-x-4 top-[52%] h-px bg-amber-200/50" />
        </div>
      );
    case "editor":
      // The 2 a.m. edit bay: a lone monitor glowing in a dark blue room.
      return (
        <div className="absolute inset-0 bg-linear-to-b from-[#050a1c] via-[#0a1330] to-[#03050e]">
          <div className="absolute left-1/2 top-[26%] h-24 w-36 -translate-x-1/2 rounded-sm border border-sky-300/40 bg-sky-400/15 shadow-[0_0_50px_rgba(56,189,248,0.35)]">
            <div className="scanlines absolute inset-0" />
            <div className="absolute inset-x-2 bottom-2 flex gap-1" aria-hidden>
              <span className="h-1.5 flex-[3] rounded-full bg-sky-300/50" />
              <span className="h-1.5 flex-[2] rounded-full bg-sky-300/30" />
              <span className="h-1.5 flex-[4] rounded-full bg-sky-300/40" />
            </div>
            <span className="absolute right-1.5 top-1 font-mono text-[8px] font-bold tracking-widest text-sky-200/80">
              02:00
            </span>
          </div>
          <div className="absolute left-1/2 top-[47%] h-10 w-52 -translate-x-1/2 bg-sky-400/10 blur-xl" />
        </div>
      );
    case "second-shooter":
      // The venue: warm bokeh floating over an evening ballroom.
      return (
        <div className="absolute inset-0 bg-linear-to-b from-[#1d0b10] via-[#2e1414] to-[#0d0507]">
          {[
            "left-[12%] top-[16%] h-10 w-10 bg-amber-300/45",
            "left-[62%] top-[10%] h-14 w-14 bg-rose-300/35",
            "left-[38%] top-[30%] h-7 w-7 bg-amber-200/50",
            "left-[78%] top-[34%] h-9 w-9 bg-orange-300/40",
            "left-[18%] top-[42%] h-12 w-12 bg-rose-200/30",
            "left-[55%] top-[46%] h-6 w-6 bg-amber-300/45",
          ].map((pos) => (
            <span key={pos} className={`absolute rounded-full blur-md ${pos}`} aria-hidden />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black to-transparent" />
        </div>
      );
    default:
      // The studio: a single spotlight cone landing on the monogram.
      return (
        <div className="absolute inset-0 bg-linear-to-b from-[#151310] to-black">
          <div
            className="absolute left-1/2 top-0 h-[68%] w-[135%] -translate-x-1/2 bg-linear-to-b from-amber-100/25 via-amber-200/10 to-transparent"
            style={{ clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)" }}
          />
          <p
            aria-hidden
            className="absolute left-1/2 top-[34%] -translate-x-1/2 font-heading text-7xl font-black tracking-tighter text-amber-100/90 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]"
          >
            MG
          </p>
          <div className="absolute left-1/2 top-[56%] h-2 w-40 -translate-x-1/2 rounded-[100%] bg-amber-200/20 blur-sm" />
        </div>
      );
  }
}

function Poster({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.09 }}
      className="group relative"
    >
      {/* Marquee tag on the current feature */}
      {feature.nowPlaying && (
        <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-rec-blink" aria-hidden />
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-black">
            Now playing
          </span>
        </div>
      )}

      {/* Lightbox case — hangs slightly crooked, straightens on approach */}
      <div
        className={`relative rounded-xl border bg-neutral-900 p-2 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out hover:rotate-0 hover:-translate-y-1.5 ${feature.tilt} ${
          feature.nowPlaying
            ? "border-amber-400/40 shadow-[0_0_45px_-10px_rgba(245,158,11,0.35)]"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        {/* Case bolts */}
        {["left-1 top-1", "right-1 top-1", "left-1 bottom-1", "right-1 bottom-1"].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute h-1 w-1 rounded-full bg-white/25 shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)] ${pos}`}
          />
        ))}

        {/* The one-sheet */}
        <div className="relative aspect-2/3 overflow-hidden rounded-md bg-black">
          <PosterArt id={feature.id} />

          {/* Scrim so the type always reads */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/15 to-black/45" />

          {/* Light sweep across the glass on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="light-leak absolute -inset-y-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-100/20 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center px-4 pb-3.5 pt-4 text-center">
            {/* Festival laurels */}
            <div className="flex items-center gap-1.5">
              <Laurel />
              <p className="max-w-28 font-mono text-[7px] font-bold uppercase leading-relaxed tracking-[0.2em] text-amber-100/80">
                Official selection
                <br />
                <span className="text-amber-300/90">{feature.festival}</span>
              </p>
              <Laurel flip />
            </div>

            <div className="flex-1" aria-hidden />

            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-white/50">
              {feature.genre}
            </p>
            <h3 className="mt-1.5 font-heading text-[22px] font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {feature.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-2 text-[11px] italic leading-snug text-amber-200/90">
              {feature.tagline}
            </p>

            {/* Billing block — the squashed micro-credits every one-sheet has */}
            <p className="mt-3 w-full scale-y-[1.6] px-1 text-[5px] font-semibold uppercase leading-[1.7] tracking-[0.08em] text-white/40">
              {feature.credits}
            </p>

            <div className="mt-2.5 flex w-full items-center justify-between">
              <span className="border border-white/40 px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-[0.15em] text-white/80">
                {feature.year}
              </span>
              <span className="font-mono text-[7px] font-bold tracking-[0.3em] text-white/40">
                MGS·FILMS
              </span>
            </div>
          </div>
        </div>

        {/* Plaque under the glass — what the chapter actually was */}
        <div className="mt-2 rounded-md border border-white/10 bg-black/40 px-3 py-2.5 text-left">
          <p className="text-[11px] leading-relaxed text-gray-400">{feature.synopsis}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {feature.roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-amber-300/90"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Experience({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section id="experience" className="w-full flex flex-col items-start z-10 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col items-start mb-10 ${hideTitle ? "hidden" : ""}`}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
          EXPERIENCE
        </h2>
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">
          The filmography so far
        </p>
      </motion.div>

      {/* The poster wall */}
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Poster key={feature.id} feature={feature} index={index} />
        ))}
      </div>

      {/* Ticket stub — the career stats, torn at the door */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mx-auto mt-12 flex items-stretch"
      >
        <div className="flex items-center overflow-hidden rounded-lg border border-amber-400/30 bg-amber-500/[0.06]">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 py-3">
            {stats.map((stat) => (
              <span
                key={stat}
                className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200/90 md:text-[10px]"
              >
                {stat}
              </span>
            ))}
          </div>
          {/* Perforation + stub */}
          <div className="relative flex items-center self-stretch border-l border-dashed border-amber-400/40 px-3">
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.25em] text-amber-300 md:text-[9px]">
              Admit one
            </span>
          </div>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 rotate-6 font-scribble text-xl text-amber-400/80 md:-right-16 md:text-2xl"
        >
          sequel in production…
        </p>
      </motion.div>
    </section>
  );
}
