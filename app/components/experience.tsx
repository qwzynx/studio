"use client";

import React from "react";
import { motion } from "framer-motion";

// The career reads as a shooting script: a cream paper page (a deliberate
// break from the site's dark chrome) set in Courier, with the years as
// sluglines, CUT TO:s between chapters, and the roles pencilled into the
// margins in the director's handwriting. Scenes run chronologically — the
// script opens where the story did.
//
// Edit these to match the real story.
const scenes = [
  {
    slug: "EXT. BACKYARD — GOLDEN HOUR",
    period: "2019",
    intro: "A HAND-ME-DOWN CAMERA",
    action:
      "changes everything. Shot everything that stood still and most things that didn't. Most frames were terrible. A few weren't — and that was enough.",
    scribble: "the hook!",
  },
  {
    slug: "INT. BEDROOM EDIT BAY — 2 A.M.",
    period: "2021 – 2023",
    intro: "EDITOR FOR HIRE",
    action:
      "cutting recaps, travel diaries and shorts from other people's footage, for creators and student films — where the taste for pacing, sound and grade was built.",
    scribble: "editing · grading",
  },
  {
    slug: "INT. WEDDING VENUE — EVENING",
    period: "2023 – 2024",
    intro: "SECOND SHOOTER",
    action:
      "learns to read a room and anticipate the moment — covering the angles the lead couldn't, and turning around same-week selects.",
    scribble: "events · candid",
  },
  {
    slug: "INT. MG STUDIO — PRESENT DAY",
    period: "2024 – now",
    intro: "MG STUDIO",
    action:
      "a one-person operation running end to end — scouting, shooting, editing and grading portraits, events and short films, for clients and for the love of it.",
    scribble: "photography · direction · colour",
  },
];

// Typed into the title block like production notes.
const stats = "7 YEARS BEHIND THE LENS · 36+ SHOOTS DELIVERED · 10K FRAMES KEPT";

// A brass brad holding the page together, screenplay-style.
function Brad({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute left-4 md:left-6 h-3 w-3 rounded-full bg-linear-to-br from-[#d3b168] to-[#8a6a2d] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] ${className}`}
    />
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

      {/* The page */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8 }}
        className="screenplay-page relative mx-auto w-full max-w-3xl overflow-hidden rounded-[3px] bg-[#f3ecda] px-8 py-10 text-stone-800 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)] sm:px-12 md:px-16 md:py-14"
      >
        {/* Aged-paper vignette + coffee ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(120,90,20,0.18)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-20 right-8 h-24 w-24 rounded-full border-[5px] border-amber-900/[0.09]"
        />

        <Brad className="top-14" />
        <Brad className="bottom-14" />

        {/* Page number */}
        <p aria-hidden className="absolute right-6 top-4 text-xs text-stone-500 md:right-10">
          1.
        </p>

        {/* Title block */}
        <div className="mb-10 flex flex-col items-center gap-2 text-center md:mb-12">
          <h3 className="text-xl font-bold tracking-widest md:text-2xl">
            <span className="border-b-2 border-stone-800 pb-0.5">THE REEL SO FAR</span>
          </h3>
          <p className="mt-3 text-xs md:text-sm">written, shot &amp; graded by</p>
          <p className="text-sm font-bold tracking-widest md:text-base">MAHAN GHAFARIAN</p>
          <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-amber-700 md:text-xs">
            GOLDENROD REVISION · JUL 2026
          </p>
          <p className="mt-1 text-[9px] tracking-wider text-stone-500 md:text-[11px]">{stats}</p>
        </div>

        <p className="mb-8 text-sm font-bold md:text-base">FADE IN:</p>

        {/* Scenes */}
        <div className="flex flex-col gap-8 md:gap-10">
          {scenes.map((scene, index) => (
            <motion.div
              key={scene.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="group"
            >
              {index > 0 && (
                <p className="mb-8 text-right text-sm font-bold md:mb-10 md:text-base">CUT TO:</p>
              )}

              <div className="relative">
                {/* Slugline with scene numbers in both margins */}
                <div className="flex items-baseline gap-3 md:gap-5">
                  <span className="text-sm font-bold md:text-base">{index + 1}</span>
                  <h4 className="min-w-0 flex-1 text-sm font-bold uppercase leading-snug tracking-wide md:text-base">
                    {scene.slug}{" "}
                    <span className="whitespace-nowrap">({scene.period})</span>
                  </h4>
                  <span className="hidden text-sm font-bold sm:inline md:text-base">{index + 1}</span>
                </div>
                {/* Pencilled underline appears when the scene is read */}
                <div className="ml-6 mt-0.5 h-0.5 w-0 bg-amber-600/50 transition-all duration-500 group-hover:w-40 md:ml-8" aria-hidden />

                {/* Director's margin scribble */}
                <p className="pointer-events-none absolute -top-5 right-0 -rotate-3 font-scribble text-lg text-amber-700/80 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-amber-700 md:-top-6 md:text-2xl">
                  {scene.scribble}
                </p>

                <p className="mt-3 pl-6 text-[13px] leading-relaxed md:pl-8 md:text-[15px] md:leading-loose">
                  <span className="font-bold">{scene.intro}</span> — {scene.action}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ending */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 md:mt-12"
        >
          <p className="text-right text-sm font-bold md:text-base">FADE OUT.</p>
          <p className="mt-8 text-center text-sm font-bold tracking-[0.3em] md:text-base">THE END</p>
          <p className="mt-1 rotate-[-2deg] text-center font-scribble text-xl text-amber-700/80 md:text-2xl">
            (to be continued…)
          </p>
        </motion.div>

        <p className="mt-10 text-center text-[8px] tracking-[0.2em] text-stone-500 md:text-[9px]">
          MG STUDIO · THIS MATERIAL IS THE PROPERTY OF THE FILMMAKER · DO NOT DUPLICATE
        </p>
      </motion.div>
    </section>
  );
}
