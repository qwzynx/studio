"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Aperture, Video } from "lucide-react";

// The kit is presented as a flight case lying open: the base half holds the
// gear pressed into pick-and-pluck foam (hovering lifts a piece out of its
// cutout), and the lid half is a rack — the post-production apps mounted as
// 1U outboard units in signal-path order, card in at the top, delivery out
// at the bottom. Hovering a unit powers it up: the meter fills and the
// standby lamp goes green.
//
// Edit these to match the real bag. `label` reads like the strip of gaffer
// tape stuck under each cutout.
const gear = [
  { name: "Canon EOS R10", label: "APS-C · 24MP", icon: Camera, wide: true },
  { name: "EF 18-55mm f/3.5-5.6", label: "Everyday zoom", icon: Aperture },
  { name: "EF 50mm f/1.8", label: "Portraits & low light", icon: Aperture },
  { name: "EF 75-300mm f/4-5.6", label: "Telephoto reach", icon: Aperture },
  { name: "RF 18-45mm f/4.5-6.3", label: "Compact walkaround", icon: Aperture },
  { name: "DJI RS 3 Mini", label: "Stabilized movement", icon: Video },
  { name: "DJI Osmo Action 4", label: "Action cam · 4K", icon: Camera },
];

// Rack units, in the order the footage actually flows through them.
// No brand icon dependencies — the little front-panel screen approximates
// each app's colors.
const rack = [
  { abbr: "Lr", name: "Lightroom", use: "RAW develop & colour", screen: "bg-[#001e36] text-[#31a8ff]", glow: "rgba(49,168,255,0.35)" },
  { abbr: "Ps", name: "Photoshop", use: "Retouch & composite", screen: "bg-[#001e36] text-[#31a8ff]", glow: "rgba(49,168,255,0.35)" },
  { abbr: "Pr", name: "Premiere Pro", use: "The cut", screen: "bg-[#00005b] text-[#9999ff]", glow: "rgba(153,153,255,0.35)" },
  { abbr: "Ae", name: "After Effects", use: "Motion & VFX", screen: "bg-[#00005b] text-[#9999ff]", glow: "rgba(153,153,255,0.35)" },
  { abbr: "Rs", name: "DaVinci Resolve", use: "The grade", screen: "bg-[#233a51] text-[#ff9e2c]", glow: "rgba(255,158,44,0.35)" },
];

// Molded ribs of the case shell, as a subtle repeating stripe.
const ribbed = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 9px)",
};

function Rivets() {
  return (
    <>
      {["left-2.5 top-2.5", "right-2.5 top-2.5", "left-2.5 bottom-2.5", "right-2.5 bottom-2.5"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-1.5 w-1.5 rounded-full bg-white/15 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] ${pos}`}
        />
      ))}
    </>
  );
}

// Vertical rack rail with its column of mounting holes.
function RackRail() {
  return (
    <div
      aria-hidden
      className="w-2.5 flex-none rounded-sm bg-white/[0.05]"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1.2px, transparent 1.8px)",
        backgroundSize: "100% 18px",
        backgroundPosition: "center 9px",
      }}
    />
  );
}

// LED bridge meter: green into amber into red, fills left to right on power-up.
const SEGMENTS = 12;
const segmentColor = (i: number) =>
  i < 7 ? "bg-emerald-400" : i < 10 ? "bg-amber-400" : "bg-red-500";

function RackUnit({ unit, index }: { unit: (typeof rack)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative flex items-center gap-3 rounded-md border border-white/10 bg-neutral-900 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:border-white/25 md:gap-4 md:px-4 lg:flex-1"
    >
      {/* Faceplate screws */}
      {["left-1 top-1", "right-1 top-1", "left-1 bottom-1", "right-1 bottom-1"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-1 w-1 rounded-full bg-white/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)] ${pos}`}
        />
      ))}

      <span className="hidden font-mono text-[8px] font-bold tracking-widest text-gray-600 sm:block">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Front-panel screen with the app mark */}
      <span
        className={`flex h-9 w-11 flex-none items-center justify-center rounded ${unit.screen} border border-white/10 text-base font-bold tracking-tight shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-shadow duration-300 md:h-10 md:w-12 md:text-lg`}
        style={{ ["--unit-glow" as string]: unit.glow }}
      >
        <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--unit-glow)]">
          {unit.abbr}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold tracking-tight text-white md:text-sm">{unit.name}</p>
        <p className="truncate font-mono text-[8px] uppercase tracking-[0.2em] text-gray-500 md:text-[9px]">
          {unit.use}
        </p>
      </div>

      {/* Meter — dark until the unit is hovered, then fills like a power-up.
          Hidden on phones: its ~75px would truncate every unit name */}
      <div className="hidden items-center gap-[3px] sm:flex" aria-hidden>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-[3px] rounded-[1px] ${segmentColor(i)} opacity-[0.13] transition-opacity duration-150 group-hover:opacity-100`}
            style={{ transitionDelay: `${i * 35}ms` }}
          />
        ))}
      </div>

      {/* Standby lamp: red at rest, green when the unit powers up */}
      <div className="flex flex-col items-center gap-0.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-red-500/50 transition-all duration-300 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        <span className="font-mono text-[6px] font-bold uppercase tracking-widest text-gray-600">pwr</span>
      </div>
    </motion.div>
  );
}

// A blank vented 1U filling out the rack.
function VentPanel() {
  return (
    <div
      aria-hidden
      className="relative h-6 flex-none rounded-md border border-white/[0.07] bg-neutral-900/70"
    >
      <div
        className="absolute inset-x-8 inset-y-1.5 rounded-sm"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 3px, transparent 3px 9px)",
        }}
      />
    </div>
  );
}

export default function Kit({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section id="kit" className="w-full flex flex-col items-start z-10 relative">
      {/* Keep a crawlable heading when the floating pill owns the visual title */}
      {hideTitle ? (
        <h2 className="sr-only">Kit — what&apos;s in the bag</h2>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start mb-10"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
            KIT
          </h2>
          <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">What&apos;s in the bag</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.7 }}
        className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* Carry handle on the seam */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 z-20 hidden h-24 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-neutral-900 shadow-lg lg:block"
        />

        <div className="flex flex-col lg:flex-row lg:divide-x divide-y lg:divide-y-0 divide-white/10">
          {/* Base half — foam insert with the gear */}
          <div className="relative flex-1 p-4 md:p-6 lg:order-2" style={ribbed}>
            <Rivets />
            <p className="mb-3 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-gray-600">
              Base · in the bag
            </p>

            {/* The foam block */}
            <div className="rounded-2xl bg-[#0b0b0a] p-3 md:p-4 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),inset_0_-1px_2px_rgba(255,255,255,0.03)]">
              <div className="grid grid-cols-2 gap-2.5 md:gap-3 sm:grid-cols-3">
                {gear.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`group relative rounded-xl border border-black bg-black/60 p-3 md:p-4 shadow-[inset_0_3px_10px_rgba(0,0,0,0.9),inset_0_-1px_2px_rgba(255,255,255,0.04)] ${
                      item.wide ? "col-span-2" : ""
                    }`}
                  >
                    {/* The piece of gear — lifts out of the foam on hover */}
                    <div className="flex flex-col gap-2 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:drop-shadow-[0_8px_10px_rgba(0,0,0,0.9)]">
                      <item.icon
                        size={20}
                        className={`text-gray-400 transition-all duration-500 group-hover:text-amber-400 ${
                          item.icon === Aperture ? "group-hover:rotate-[120deg]" : ""
                        }`}
                      />
                      <p className="text-xs md:text-sm font-bold tracking-tight text-white">{item.name}</p>
                      {/* Gaffer-tape label */}
                      <p className="w-fit -rotate-1 bg-stone-300 px-1.5 py-0.5 font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-neutral-900 shadow-sm transition-transform duration-300 group-hover:rotate-0">
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* One cutout kept empty, as every foam insert should be */}
                <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/30 p-3">
                  <p className="text-center font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] leading-relaxed text-white/25">
                    reserved for
                    <br />
                    the next lens
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lid half — the post-production rack */}
          <div className="relative flex flex-1 flex-col p-4 md:p-6 lg:order-1" style={ribbed}>
            <Rivets />
            <p className="mb-3 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-gray-600">
              Lid · post-production rack
            </p>

            {/* The rack cavity */}
            <div className="flex flex-1 gap-2 rounded-2xl bg-[#0b0b0a] p-3 md:p-4 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),inset_0_-1px_2px_rgba(255,255,255,0.03)]">
              <RackRail />
              <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-2.5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/30 md:text-[9px]">
                  ▾ card in
                </p>
                {rack.map((unit, index) => (
                  <RackUnit key={unit.name} unit={unit} index={index} />
                ))}
                <VentPanel />
                <p className="text-right font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-white/30 md:text-[9px]">
                  delivery out ▾
                </p>
              </div>
              <RackRail />
            </div>

            <p className="mt-2.5 text-center font-mono text-[8px] uppercase tracking-[0.25em] text-gray-700 md:text-[9px]">
              signal path · hover a unit to power it up
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
