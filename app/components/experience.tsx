"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// RACK FOCUS — the career as one manual prime lens. Every chapter is
// engraved on the focus ring at the distance it happened: 2019 sits at the
// lens's minimum focus distance, and the current chapter is out at infinity,
// still rolling. Clicking a chapter (card or engraving) pulls focus — the
// ring slides its marking under the fixed amber index line, the chosen card
// snaps sharp, and every other chapter falls optically out of focus. The
// green AF-confirm brackets echo the hero's viewfinder HUD.
//
// Edit these to match the real story. `m`/`ft` are the barrel engravings.
type Chapter = {
  id: string;
  m: string; // metres row on the focus ring
  ft: string; // feet row, amber like a real barrel
  years: string;
  title: string;
  description: string;
  details: string[];
};

const chapters: Chapter[] = [
  {
    id: "origin",
    m: "0.45",
    ft: "1.5",
    years: "2019",
    title: "First Light",
    description:
      "A hand-me-down camera changes everything. Shot everything that stood still and most things that didn't — on full auto, and thrilled about it.",
    details: ["one borrowed body", "zero settings touched"],
  },
  {
    id: "editor",
    m: "1.2",
    ft: "4",
    years: "2021 – 2023",
    title: "Editor for Hire",
    description:
      "Cutting other people's footage at 2 a.m. — recaps, travel diaries, student films. Where the taste for pacing, sound and grade was built.",
    details: ["other people's footage", "overnight exports"],
  },
  {
    id: "second-shooter",
    m: "3",
    ft: "10",
    years: "2023 – 2024",
    title: "Second Shooter",
    description:
      "Weddings and live events: three hundred guests, no second takes. Learned to read a room and be one step ahead of the moment.",
    details: ["live events", "no second takes"],
  },
  {
    id: "mg-studio",
    m: "∞",
    ft: "∞",
    years: "2024 – now",
    title: "MG Studio",
    description:
      "A one-person operation running end to end — written, shot, edited and graded by the same pair of hands. Portraits, events, short films.",
    details: ["end to end", "still shooting"],
  },
];

// Barrel engraving along the panel's bottom edge.
const stats = ["7 yrs behind the lens", "36+ shoots delivered", "10k frames kept"];

// One engraving cell on the sliding ring. Keep in sync with RING_STEP.
const RING_STEP = 132;

// Gentle settling spring — the ring should land like a hand easing off a
// focus pull, not snap like a UI tab.
const ringSpring = { type: "spring", stiffness: 160, damping: 24 } as const;

function Ticks({ dim = false }: { dim?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-2 flex items-end justify-between"
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`w-px ${
            i === 4
              ? `h-2.5 ${dim ? "bg-white/15" : "bg-white/50"}`
              : `h-1.5 ${dim ? "bg-white/[0.07]" : "bg-white/20"}`
          }`}
        />
      ))}
    </div>
  );
}

// The focus ring: a knurled barrel with the distance window in the middle.
// The scale slides so the selected chapter's engraving sits under the fixed
// index line; a faint sub-MFD mark and a hard stop past infinity bookend it.
function FocusRing({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const knurl = {
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 7px)",
  };

  return (
    <div className="relative h-20 overflow-hidden border-b border-white/10 bg-[#0c0c0b]">
      {/* Knurled grip strips top and bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2" style={knurl} aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5" style={knurl} aria-hidden />

      {/* The sliding scale — anchored at the window's centre, offset per selection */}
      <motion.div
        className="absolute inset-y-0 left-1/2 flex"
        initial={false}
        animate={{ x: -((selected + 1) * RING_STEP + RING_STEP / 2) }}
        transition={reduce ? { duration: 0 } : ringSpring}
      >
        {/* Below minimum focus distance — engraved, unreachable */}
        <div
          className="relative flex h-full w-[132px] flex-none items-center justify-center pb-3"
          aria-hidden
        >
          <span className="font-mono text-sm font-bold text-white/15">0.3</span>
          <Ticks dim />
        </div>

        {chapters.map((chapter, i) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Pull focus to ${chapter.title} (${chapter.years})`}
            aria-pressed={selected === i}
            className="group relative flex h-full w-[132px] flex-none flex-col items-center justify-center pb-3 outline-none focus-visible:bg-white/5"
          >
            <span
              className={`font-mono text-base font-bold tracking-wider transition-colors duration-300 ${
                selected === i ? "text-amber-300" : "text-white/60 group-hover:text-white"
              }`}
            >
              {chapter.m}
            </span>
            <span className="font-mono text-[9px] font-bold tracking-widest text-amber-400/50">
              {chapter.ft} ft
            </span>
            <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
              {chapter.years}
            </span>
            <Ticks />
          </button>
        ))}

        {/* Hard stop past infinity — the barrel ends here */}
        <div className="relative h-full w-[132px] flex-none" aria-hidden>
          <span className="absolute bottom-3 left-8 top-3 w-0.5 rounded bg-red-500/50" />
          <Ticks dim />
        </div>
      </motion.div>

      {/* Window edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-linear-to-r from-[#0c0c0b] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-[#0c0c0b] to-transparent md:w-28" />

      {/* Fixed index line the ring turns under */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
        aria-hidden
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-amber-400" />
      </div>
    </div>
  );
}

function ChapterCard({
  chapter,
  index,
  selected,
  onSelect,
}: {
  chapter: Chapter;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="h-full"
    >
      {/* Focus state lives in CSS classes (not framer) so the blur eases with
          a plain transition and hover can pre-focus a soft card */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`relative flex h-full w-full flex-col rounded-xl border p-4 text-left outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-amber-400/70 md:p-5 ${
          selected
            ? "border-amber-400/50 bg-[#141210] shadow-[0_0_35px_-12px_rgba(245,158,11,0.3)]"
            : "scale-[0.98] border-white/10 bg-[#0f0f0e] opacity-50 blur-[3px] hover:opacity-75 hover:blur-[1.5px]"
        }`}
      >
        {/* AF-confirm corner brackets, like the hero's viewfinder */}
        {[
          "left-1.5 top-1.5 border-l-2 border-t-2",
          "right-1.5 top-1.5 border-r-2 border-t-2",
          "bottom-1.5 left-1.5 border-b-2 border-l-2",
          "bottom-1.5 right-1.5 border-b-2 border-r-2",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute h-3 w-3 border-emerald-400/80 transition-opacity duration-500 ${pos} ${
              selected ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-amber-400/80">
            ▸ {chapter.m} m
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-[8px] font-bold tracking-[0.2em] text-emerald-400 transition-opacity duration-500 ${
              selected ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!selected}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            AF
          </span>
        </div>

        <h3 className="mt-3 font-heading text-xl font-black tracking-tight text-white md:text-2xl">
          {chapter.title}
        </h3>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
          {chapter.years}
        </p>

        <p className="mt-3.5 flex-1 text-[11px] leading-relaxed text-gray-400 md:text-xs">
          {chapter.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {chapter.details.map((d) => (
            <span
              key={d}
              className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35"
            >
              {d}
            </span>
          ))}
        </div>
      </button>
    </motion.div>
  );
}

export default function Experience({ hideTitle = false }: { hideTitle?: boolean }) {
  // Land focused at infinity — the current chapter; clicking back through
  // the years pulls focus closer.
  const [selected, setSelected] = useState(chapters.length - 1);
  const chapter = chapters[selected];

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

      {/* The lens barrel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7 }}
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* Nameplate — model years double as the focal range */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 md:px-5">
          <p className="font-mono text-[10px] tracking-wide text-gray-400 md:text-xs">
            MG PRIME 19–26mm <span className="text-gray-600">·</span> f/1.8{" "}
            <span className="text-gray-600">·</span> MF
          </p>
          <p className="ml-auto font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300 md:text-[10px]">
            focus {chapter.m} m · {chapter.years}
          </p>
        </div>

        <FocusRing selected={selected} onSelect={setSelected} />

        {/* Depth-of-field scale flanking the index */}
        <div
          className="flex items-center justify-center gap-2.5 py-1.5 font-mono text-[8px] font-bold tracking-widest text-white/25"
          aria-hidden
        >
          <span>16</span>
          <span>8</span>
          <span>4</span>
          <span>2</span>
          <span className="text-amber-400/80">▲</span>
          <span>2</span>
          <span>4</span>
          <span>8</span>
          <span>16</span>
        </div>

        {/* The chapters — one sharp, the rest optically out of focus */}
        <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-2 sm:grid-cols-2 md:px-5 md:pb-5 lg:grid-cols-4">
          {chapters.map((c, i) => (
            <ChapterCard
              key={c.id}
              chapter={c}
              index={i}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>

        <p className="px-4 pb-3 text-right font-mono text-[8px] uppercase tracking-[0.25em] text-gray-700 md:px-5 md:text-[9px]">
          manual focus · click a chapter to pull it sharp
        </p>

        {/* Barrel base — engraved stats + the nudge toward booking */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/10 px-4 py-3.5 md:px-5">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white/35 md:text-[9px]">
            {stats.join("  ·  ")}
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400 transition-colors duration-300 hover:text-amber-300 md:text-[10px]"
          >
            pull focus on the next chapter
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
