"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Aperture, Video, Sun, Mic } from "lucide-react";

// Edit these to match the real bag. `spec` reads like the label on the gear itself.
const gear = [
  { name: "Sony A7 III", spec: "Full-frame · 24MP", icon: Camera },
  { name: "35mm f/1.8", spec: "Street & everyday", icon: Aperture },
  { name: "85mm f/1.8", spec: "Portraits", icon: Aperture },
  { name: "DJI Gimbal", spec: "Stabilized movement", icon: Video },
  { name: "Key Light", spec: "Studio lighting", icon: Sun },
  { name: "Shotgun Mic", spec: "On-camera audio", icon: Mic },
];

// Post-production tools rendered as app tiles — no brand icon dependencies.
const post = [
  { abbr: "Lr", name: "Lightroom", use: "RAW editing & color", tile: "bg-[#001e36] text-[#31a8ff]" },
  { abbr: "Ps", name: "Photoshop", use: "Retouching & composites", tile: "bg-[#001e36] text-[#31a8ff]" },
  { abbr: "Pr", name: "Premiere Pro", use: "Video editing", tile: "bg-[#00005b] text-[#9999ff]" },
  { abbr: "Ae", name: "After Effects", use: "Motion graphics", tile: "bg-[#00005b] text-[#9999ff]" },
  { abbr: "Rs", name: "DaVinci Resolve", use: "Color grading", tile: "bg-[#233a51] text-[#ff9e2c]" },
];

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

      <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* In the bag */}
        <div className="flex-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">In the bag</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {gear.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 p-4 md:p-5 flex flex-col gap-3 transition-colors duration-500"
              >
                {/* Aperture icons rotate like blades stopping down */}
                <item.icon
                  size={22}
                  className={`text-gray-400 group-hover:text-amber-400 transition-all duration-500 ${
                    item.icon === Aperture ? "group-hover:rotate-[120deg]" : ""
                  }`}
                />
                <div>
                  <p className="text-white text-sm md:text-base font-bold tracking-tight">{item.name}</p>
                  <p className="text-gray-500 text-[11px] md:text-xs font-mono mt-0.5">{item.spec}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Post-production */}
        <div className="flex-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">Post-production</p>
          <div className="flex flex-col gap-3 md:gap-4">
            {post.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="group flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 p-3 md:p-4 transition-colors duration-500"
              >
                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${tool.tile} flex items-center justify-center font-bold text-lg md:text-xl tracking-tight border border-white/10 group-hover:scale-105 transition-transform duration-300 shrink-0`}>
                  {tool.abbr}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm md:text-base font-bold tracking-tight">{tool.name}</p>
                  <p className="text-gray-500 text-[11px] md:text-xs mt-0.5">{tool.use}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
