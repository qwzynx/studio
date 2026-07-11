"use client";

import React from "react";
import { motion } from "framer-motion";

// Edit these to match the real story. Entries read newest-first, like a roll
// rewinding — the last frame is where it all started. `MG 400` in the edge
// code is a riff on film stock names; keep or change it.
const roll = [
  {
    period: "2024 — NOW",
    title: "MG Studio",
    org: "Freelance photographer & filmmaker",
    description:
      "Running a one-person studio end to end — scouting, shooting, editing and grading portraits, events and short films, for clients and for the love of it.",
    roles: ["Photography", "Direction", "Colour"],
  },
  {
    period: "2023 — 2024",
    title: "Second Shooter",
    org: "Weddings & live events",
    description:
      "Learned to read a room and anticipate the moment — covering the angles the lead couldn't, and turning around same-week selects.",
    roles: ["Events", "Candid"],
  },
  {
    period: "2021 — 2023",
    title: "Editor for Hire",
    org: "Creators & student films",
    description:
      "Cut recaps, travel diaries and shorts from other people's footage — where the taste for pacing, sound and grade was built.",
    roles: ["Editing", "Grading"],
  },
  {
    period: "2019",
    title: "First Roll",
    org: "A hand-me-down camera",
    description:
      "Shot everything that stood still and most things that didn't. Most frames were terrible. A few weren't — and that was enough.",
    roles: ["The hook"],
  },
];

// The frame-counter window at the top of the section — edit freely.
const counters = [
  { value: "07", label: "Years behind the lens" },
  { value: "36+", label: "Shoots delivered" },
  { value: "10K", label: "Frames kept" },
];

/* Vertical sprocket strip that forms the timeline spine. Same geometry as the
   Films strips: --sprocket-step = one hole height + gap, so the hover-driven
   film-transport loop is seamless. */
function SprocketSpine() {
  return (
    <div className="relative overflow-hidden flex-1 w-2.5 md:w-3 [--sprocket-step:1.5rem] md:[--sprocket-step:1.75rem]">
      <div className="film-transport absolute inset-x-0 top-0 flex flex-col gap-3">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-2.5 h-3 md:w-3 md:h-4 rounded-[3px] bg-background border border-white/15 shrink-0" />
        ))}
      </div>
    </div>
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
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">The reel so far</p>
      </motion.div>

      {/* Frame counter — reads like the exposure counter window on a camera */}
      <div className="w-full max-w-xl grid grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-14">
        {counters.map((counter, index) => (
          <motion.div
            key={counter.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="rounded-2xl bg-white/[0.02] border border-white/10 p-3 md:p-4 flex flex-col items-center gap-2"
          >
            <span className="px-3 py-1 rounded-md bg-black/60 border border-white/15 font-mono text-amber-300 text-lg md:text-2xl tracking-[0.2em]">
              {counter.value}
            </span>
            <span className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold text-center leading-relaxed">
              {counter.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* The roll — each entry is one frame; sprockets roll while hovered */}
      <div className="w-full flex flex-col">
        {roll.map((entry, index) => {
          const frame = `${String(roll.length - index).padStart(2, "0")}A`;
          return (
            <article key={entry.title} className="group relative flex gap-4 md:gap-6 items-stretch">
              {/* Timeline spine: frame number chip + sprocket strip down to the next frame */}
              <div className="flex flex-col items-center shrink-0 w-10 md:w-12">
                <div className="w-10 h-8 md:w-11 md:h-9 rounded-md bg-black/50 border border-white/15 group-hover:border-amber-400/60 flex items-center justify-center font-mono text-[10px] md:text-xs text-amber-300 tracking-widest transition-colors duration-500 mb-2 shrink-0">
                  {frame}
                </div>
                <SprocketSpine />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative overflow-hidden flex-1 min-w-0 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-amber-400/40 p-4 md:p-6 mb-6 md:mb-8 transition-colors duration-500"
              >
                {/* Warm light leak sweeps across the frame once per hover */}
                <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-amber-300 text-[11px] md:text-xs tracking-[0.25em]">{entry.period}</span>
                  <span className="font-mono text-gray-600 text-[9px] md:text-[10px] tracking-[0.3em] uppercase hidden sm:block">
                    MG 400 · {frame}
                  </span>
                </div>
                <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors duration-300 mt-2">
                  {entry.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm font-mono mt-0.5">{entry.org}</p>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed mt-2 md:mt-3">{entry.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/90 bg-amber-500/10 border border-amber-500/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </motion.div>
            </article>
          );
        })}

        <p className="w-full text-center font-mono text-[10px] tracking-[0.4em] text-gray-600 uppercase mt-1">
          — start of roll —
        </p>
      </div>
    </section>
  );
}
