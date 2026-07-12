"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Aperture, Video } from "lucide-react";

// The kit is presented as a flight case lying open: the base half holds the
// gear pressed into pick-and-pluck foam (hovering lifts a piece out of its
// cutout), and the lid is plastered with the post-production apps as slap
// stickers — the way edit software actually ends up on a working case.
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

// Lid stickers — no brand icon dependencies, tile colors approximate the apps.
// `tilt` is each sticker's resting rotation; hover peels it flat.
const stickers = [
  { abbr: "Lr", name: "Lightroom", use: "RAW editing & color", tile: "bg-[#001e36] text-[#31a8ff]", tilt: "-rotate-6" },
  { abbr: "Ps", name: "Photoshop", use: "Retouching & composites", tile: "bg-[#001e36] text-[#31a8ff]", tilt: "rotate-3" },
  { abbr: "Pr", name: "Premiere Pro", use: "Video editing", tile: "bg-[#00005b] text-[#9999ff]", tilt: "-rotate-2" },
  { abbr: "Ae", name: "After Effects", use: "Motion graphics", tile: "bg-[#00005b] text-[#9999ff]", tilt: "rotate-6" },
  { abbr: "Rs", name: "DaVinci Resolve", use: "Color grading", tile: "bg-[#233a51] text-[#ff9e2c]", tilt: "-rotate-3" },
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

export default function Kit({ hideTitle = false }: { hideTitle?: boolean }) {
  return (
    <section id="kit" className="w-full flex flex-col items-start z-10 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col items-start mb-10 ${hideTitle ? "hidden" : ""}`}
      >
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
          KIT
        </h2>
        <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">What&apos;s in the bag</p>
      </motion.div>

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

          {/* Lid half — stickers */}
          <div className="relative flex-1 p-4 md:p-6 lg:order-1" style={ribbed}>
            <Rivets />
            <p className="mb-3 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.35em] text-gray-600">
              Lid · post-production
            </p>

            <div className="relative flex min-h-48 flex-wrap content-center items-center justify-center gap-4 md:gap-6 rounded-2xl border border-white/[0.06] p-6 md:p-10 lg:min-h-[calc(100%-2.25rem)]">
              {/* Stencilled owner mark under the stickers */}
              <p
                aria-hidden
                className="pointer-events-none absolute inset-0 flex -rotate-6 select-none items-center justify-center font-heading text-6xl md:text-7xl font-black uppercase tracking-tighter text-white/[0.04]"
              >
                MG&nbsp;Studio
              </p>
              <p
                aria-hidden
                className="pointer-events-none absolute bottom-3 right-4 select-none font-mono text-[8px] uppercase tracking-[0.3em] text-white/15"
              >
                this side up ↑
              </p>

              {stickers.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className={`group relative ${tool.tilt} transition-transform duration-300 ease-out hover:z-10 hover:rotate-0 hover:scale-110`}
                >
                  {/* Die-cut white edge */}
                  <div className={`flex w-28 md:w-32 flex-col items-center gap-1 rounded-2xl ${tool.tile} border-[3px] border-white/90 px-3 py-3.5 shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-shadow duration-300 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.8)]`}>
                    <span className="text-2xl md:text-3xl font-bold tracking-tight">{tool.abbr}</span>
                    <span className="text-center text-[10px] md:text-[11px] font-bold tracking-tight text-white">
                      {tool.name}
                    </span>
                    <span className="text-center text-[8px] md:text-[9px] leading-tight text-white/60">
                      {tool.use}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Round QC sticker for flavor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: stickers.length * 0.07 }}
                className="group rotate-12 transition-transform duration-300 ease-out hover:rotate-0 hover:scale-110"
              >
                <div className="flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-full border-[3px] border-white/90 bg-amber-500 text-black shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
                  <span className="font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em]">graded</span>
                  <span className="text-lg md:text-xl font-black leading-none">QC ✓</span>
                  <span className="font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em]">by hand</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
