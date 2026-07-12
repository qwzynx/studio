"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";

// The section is staged as an editing suite: a program monitor up top and an
// NLE timeline below, where each video is a clip laid on the V1 track with a
// matching block on A1. Clicking a clip loads it into the monitor; the red
// playhead loops across whichever clip is selected. Clip widths are
// proportional to real duration, so the timeline doubles as an honest
// at-a-glance runtime comparison.
//
// Thumbnails live in public/videos/ — see public/videos/README.md.
// Set thumbnail to e.g. "/videos/short.jpg"; empty string shows a gradient
// placeholder. link can point to YouTube/Vimeo; empty string means the
// monitor has no play-through and the inspector shows no watch button.
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

const toSeconds = (tc: string) => {
  const [m, s] = tc.split(":").map(Number);
  return m * 60 + s;
};

const seconds = videos.map((v) => toSeconds(v.duration));
const totalSeconds = seconds.reduce((a, b) => a + b, 0);
const clipStarts = seconds.map((_, i) => seconds.slice(0, i).reduce((a, b) => a + b, 0));

const formatTick = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Deterministic pseudo-waveform — Math.random would mismatch between server
// and client render, so heights come from a fixed hash of clip + bar index.
const waveHeight = (clip: number, bar: number) =>
  25 + (((clip * 7919 + bar * 104729) % 89) / 89) * 65;

function AudioWave({ clip }: { clip: number }) {
  const bars = Math.max(14, Math.round(seconds[clip] / 6));
  return (
    <div className="flex h-full w-full items-center gap-px overflow-hidden px-1.5" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-full min-w-px flex-1 rounded-full bg-amber-400/45"
          style={{ height: `${waveHeight(clip, i)}%` }}
        />
      ))}
    </div>
  );
}

export default function Videos({ hideTitle = false }: { hideTitle?: boolean }) {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  // The playhead loop is infinite — park it while the timeline is off-screen
  // so it doesn't keep the main thread busy for the whole session.
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { amount: 0.2 });
  const playheadParked = reduce || !timelineInView;
  const video = videos[selected];

  const startPct = (clipStarts[selected] / totalSeconds) * 100;
  const endPct = ((clipStarts[selected] + seconds[selected]) / totalSeconds) * 100;

  // Ruler: labels every 2 minutes, minor ticks every 30 seconds.
  const labelTicks = Array.from({ length: Math.floor(totalSeconds / 120) + 1 }, (_, i) => i * 120);
  const minorTicks = Array.from({ length: Math.floor(totalSeconds / 30) + 1 }, (_, i) => i * 30);

  return (
    <section id="videos" className="w-full flex flex-col items-start z-10 relative">
      {/* Keep a crawlable heading when the floating pill owns the visual title */}
      {hideTitle ? (
        <h2 className="sr-only">Videos — moving pictures, moving people</h2>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start mb-10"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
            VIDEOS
          </h2>
          <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">Moving pictures, moving people</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7 }}
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* Application chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <p className="min-w-0 truncate font-mono text-[10px] md:text-xs text-gray-400 tracking-wide">
            the_reel_v12_FINAL_final.prproj
          </p>
          <p className="ml-auto hidden sm:block font-mono text-[9px] md:text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            autosaved · just now
          </p>
        </div>

        {/* Monitor + inspector */}
        <div className="flex flex-col lg:flex-row">
          {/* Program monitor */}
          <div className="relative lg:w-[58%] shrink-0 bg-black p-3 md:p-4">
            <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
              {video.thumbnail ? (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 1024px) 90vw, 700px"
                  className="object-cover"
                />
              ) : (
                <motion.div
                  key={video.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-linear-to-br ${video.gradient} opacity-70`}
                />
              )}

              {/* Graded-footage vignette + CRT scanlines */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
              <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />

              {/* Action-safe / title-safe guides */}
              <div className="pointer-events-none absolute inset-[5%] rounded border border-white/15" aria-hidden />
              <div className="pointer-events-none absolute inset-[11%] rounded border border-white/[0.07]" aria-hidden />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-white/25" aria-hidden />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-white/25" aria-hidden />

              {/* Monitor readouts */}
              <div className="absolute left-3 top-2.5 flex items-center gap-2">
                <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-white/80">
                  PGM
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-rec-blink" />
                  <span className="font-mono text-[8px] md:text-[9px] font-bold tracking-[0.25em] text-white/70">
                    PLAYING
                  </span>
                </span>
              </div>
              <span className="absolute right-3 top-2.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] md:text-xs tracking-[0.2em] text-amber-300">
                00:{video.duration}:00
              </span>

              {/* Lower third */}
              <div className="absolute inset-x-3 bottom-2.5 flex items-baseline justify-between gap-3">
                <h3 className="min-w-0 truncate text-base md:text-xl font-bold tracking-tight text-white drop-shadow">
                  {video.title}
                </h3>
                <span className="font-mono text-[10px] md:text-xs text-white/60">{video.year}</span>
              </div>

              {/* Play-through only when there's somewhere to go */}
              {video.link && (
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${video.title}`}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm transition-all duration-500 hover:scale-110 hover:border-amber-400 hover:bg-amber-500/90 hover:shadow-[0_0_30px_rgba(245,158,11,0.45)]">
                    <Play size={20} className="ml-0.5 text-white" fill="currentColor" />
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Inspector */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 border-t border-white/10 p-4 md:p-6 lg:border-l lg:border-t-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600">
              Clip inspector
            </p>
            <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 font-mono text-[11px] md:text-xs">
              <span className="uppercase tracking-[0.2em] text-gray-600">Seq</span>
              <motion.span
                key={`t-${selected}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans text-sm md:text-lg font-bold tracking-tight text-white"
              >
                {video.title}
              </motion.span>
              <span className="uppercase tracking-[0.2em] text-gray-600">Year</span>
              <span className="text-gray-300">{video.year}</span>
              <span className="uppercase tracking-[0.2em] text-gray-600">TC</span>
              <span className="text-amber-300 tracking-wider">{video.duration}</span>
              <span className="uppercase tracking-[0.2em] text-gray-600">Crew</span>
              <span className="flex flex-wrap gap-1.5">
                {video.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/90"
                  >
                    {role}
                  </span>
                ))}
              </span>
            </div>
            <motion.p
              key={`d-${selected}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-xs md:text-sm leading-relaxed text-gray-400"
            >
              {video.description}
            </motion.p>
            {video.link && (
              <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-amber-400"
              >
                Watch full cut
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="border-t border-white/10 bg-black/50 px-3 pb-4 pt-3 md:px-4">
          <div className="flex">
            {/* Track heads */}
            <div className="flex w-9 md:w-11 shrink-0 flex-col pr-2 text-right font-mono text-[9px] md:text-[10px] font-bold text-gray-600">
              <div className="mb-1 h-6" aria-hidden />
              <div className="mb-1 flex h-12 md:h-14 items-center justify-end">V1</div>
              <div className="flex h-8 md:h-9 items-center justify-end">A1</div>
            </div>

            {/* Lanes + playhead */}
            <div className="relative min-w-0 flex-1">
              {/* Ruler */}
              <div className="relative mb-1 h-6 border-b border-white/10" aria-hidden>
                {minorTicks.map((s) => (
                  <span
                    key={s}
                    className="absolute bottom-0 h-1.5 w-px bg-white/20"
                    style={{ left: `${(s / totalSeconds) * 100}%` }}
                  />
                ))}
                {labelTicks.map((s) => (
                  <span
                    key={s}
                    className="absolute bottom-1.5 -translate-x-1/2 font-mono text-[8px] md:text-[9px] text-gray-600 first:translate-x-0"
                    style={{ left: `${(s / totalSeconds) * 100}%` }}
                  >
                    {formatTick(s)}
                  </span>
                ))}
              </div>

              {/* V1 — the clips */}
              <div className="mb-1 flex h-12 md:h-14">
                {videos.map((v, i) => (
                  <button
                    key={v.title}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={selected === i}
                    aria-label={`Load ${v.title} into the monitor`}
                    style={{ flexGrow: seconds[i], flexBasis: 0 }}
                    className={`relative min-w-0 overflow-hidden rounded-md border px-2 py-1.5 text-left transition-all duration-300 ${
                      selected === i
                        ? "z-10 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 bg-linear-to-br ${v.gradient} transition-opacity duration-300 ${
                        selected === i ? "opacity-70" : "opacity-35"
                      }`}
                      aria-hidden
                    />
                    <span className="relative flex h-full flex-col justify-between">
                      <span
                        className={`truncate text-[10px] md:text-xs font-bold tracking-tight ${
                          selected === i ? "text-white" : "text-white/70"
                        }`}
                      >
                        {v.title}
                      </span>
                      <span className="font-mono text-[8px] md:text-[9px] tracking-wider text-white/50">
                        {v.duration}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* A1 — matching audio blocks */}
              <div className="flex h-8 md:h-9" aria-hidden>
                {videos.map((v, i) => (
                  <div
                    key={v.title}
                    style={{ flexGrow: seconds[i], flexBasis: 0 }}
                    className={`min-w-0 overflow-hidden rounded-md border transition-colors duration-300 ${
                      selected === i ? "border-amber-400/40 bg-amber-500/[0.06]" : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <AudioWave clip={i} />
                  </div>
                ))}
              </div>

              {/* Playhead — loops across the selected clip */}
              <motion.div
                key={selected}
                initial={{ left: `${startPct}%` }}
                animate={
                  playheadParked
                    ? { left: `${startPct}%` }
                    : { left: [`${startPct}%`, `${endPct}%`] }
                }
                transition={
                  playheadParked
                    ? { duration: 0 }
                    : { duration: seconds[selected] / 20, ease: "linear", repeat: Infinity }
                }
                className="pointer-events-none absolute inset-y-0 z-20 w-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                aria-hidden
              >
                <span className="absolute -top-px left-1/2 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-red-500" />
              </motion.div>
            </div>
          </div>

          <p className="mt-3 text-right font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-700">
            sequence · {formatTick(totalSeconds)} total — click a clip to load it
          </p>
        </div>
      </motion.div>
    </section>
  );
}
