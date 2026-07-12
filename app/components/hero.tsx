"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

function Typewriter({ words, running }: { words: string[]; running: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!running) return;
    const word = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText === word) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 40 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, running]);

  return (
    <span className="text-amber-400 inline-block min-w-[120px] sm:min-w-[200px]">
      {currentText}
      <span className="animate-pulse text-white">|</span>
    </span>
  );
}

/* Running 24fps timecode, like a camera that started rolling when the page
   loaded. Pauses while the hero is scrolled out of view — a 24Hz interval is
   pointless main-thread churn once the HUD can't be seen. */
function Timecode({ running }: { running: boolean }) {
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setFrames((f) => f + 1), 1000 / 24);
    return () => clearInterval(interval);
  }, [running]);

  const ff = frames % 24;
  const totalSeconds = Math.floor(frames / 24);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="font-mono tabular-nums tracking-wider">
      {pad(hh)}:{pad(mm)}:{pad(ss)}:{pad(ff)}
    </span>
  );
}

/* Corner brackets that make the hero read as a viewfinder */
function ViewfinderCorner({ position }: { position: string }) {
  return (
    <div
      className={`absolute w-8 h-8 md:w-12 md:h-12 border-white/25 pointer-events-none ${position}`}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.05 });

  const scrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full min-h-[95dvh] flex items-center justify-center px-6 md:px-12 py-16"
    >
      {/* Viewfinder HUD frame */}
      <div className="absolute inset-6 md:inset-12 z-10 pointer-events-none text-[10px] md:text-xs text-gray-400 uppercase select-none">
        <ViewfinderCorner position="top-0 left-0 border-t-2 border-l-2" />
        <ViewfinderCorner position="top-0 right-0 border-t-2 border-r-2" />
        <ViewfinderCorner position="bottom-0 left-0 border-b-2 border-l-2" />
        <ViewfinderCorner position="bottom-0 right-0 border-b-2 border-r-2" />

        {/* Top-left: REC + timecode */}
        <div className="absolute top-4 left-6 md:top-6 md:left-8 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-rec-blink shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <span className="text-red-400 font-bold tracking-[0.2em]">REC</span>
          <span className="text-gray-300 ml-2"><Timecode running={inView} /></span>
        </div>

        {/* Top-right: exposure readout */}
        <div className="hidden sm:flex absolute top-4 right-6 md:top-6 md:right-8 items-center gap-4 font-mono tracking-wider text-gray-400">
          <span>ISO 400</span>
          <span className="text-amber-400">f/1.8</span>
          <span>1/250</span>
        </div>

        {/* Bottom-left: format */}
        <div className="hidden sm:block absolute bottom-4 left-6 md:bottom-6 md:left-8 font-mono tracking-wider">
          4K · 24FPS · LOG
        </div>

        {/* Bottom-right: battery-ish */}
        <div className="hidden sm:flex absolute bottom-4 right-6 md:bottom-6 md:right-8 items-center gap-2 font-mono tracking-wider">
          <span>AWB</span>
          <span className="text-amber-400">[■■■□]</span>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left side: Text & Description */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-start z-10 max-w-2xl w-full"
        >
          <p className="text-lg md:text-xl text-amber-400 font-medium tracking-wide mb-2 uppercase">Through the lens of</p>
          <h1 className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white via-amber-100 to-gray-400 leading-[1.05] py-2 pr-4 drop-shadow-sm">
            MAHAN<br />GHAFARIAN
          </h1>

          <div className="text-xl md:text-3xl font-medium text-gray-300 mt-2 mb-6">
            I&apos;m a <Typewriter words={["Photographer.", "Videographer.", "Visual Storyteller."]} running={inView} />
          </div>

          <p className="text-gray-400 max-w-lg leading-relaxed text-base md:text-lg">
            I chase light and cut moments into stories — from stills that hold a single
            frame of feeling to films shot, edited, and graded end to end.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="#photos"
              className="px-7 py-3 rounded-full bg-linear-to-r from-amber-600 to-amber-500 text-black text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.7)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              View Work
            </a>
            <a
              href="#contact"
              onClick={scrollToBottom}
              className="px-7 py-3 rounded-full border border-white/15 text-gray-200 text-xs sm:text-sm font-bold uppercase tracking-wider hover:border-amber-400/50 hover:text-amber-400 hover:-translate-y-1 transition-all duration-300"
            >
              Book a Shoot
            </a>
          </div>
        </motion.div>

        {/* Right side: field monitor with rule-of-thirds grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-xs justify-center items-center z-10 hidden sm:flex"
        >
          <div className="relative group w-full animate-float-subtle">
            {/* Warm glow behind */}
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-amber-600 to-red-600 opacity-15 blur-3xl group-hover:opacity-30 transition-opacity duration-700"></div>

            {/* Monitor frame */}
            <div className="relative w-full aspect-[3/4] rounded-xl p-[2px] bg-linear-to-bl from-amber-400/60 via-white/10 to-red-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all duration-700">
              <div className="w-full h-full rounded-[10px] bg-[#080807] overflow-hidden relative">
                <Image
                  src="/portrait.jpg"
                  alt="Mahan Ghafarian"
                  fill
                  preload
                  sizes="320px"
                  className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700"
                />
                {/* Rule-of-thirds grid, revealed on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/25" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/25" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/25" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/25" />
                </div>
                {/* Focus box */}
                <div className="absolute left-[52%] top-[23.5%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-amber-400/0 group-hover:border-amber-400/80 rounded-sm transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#photos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors duration-300 z-10"
        aria-label="Scroll to content"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Roll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
