"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Photos from "./photos";
import Films from "./films";
import Kit from "./kit";
import Experience from "./experience";
import Contact from "./contact";
import FocusText from "./focus-text";

const SECTIONS = [
  { id: "photos", title: "PHOTOS", subtitle: "Stills worth a thousand frames" },
  { id: "films", title: "FILMS", subtitle: "Moving pictures, moving people" },
  { id: "kit", title: "KIT", subtitle: "What's in the bag" },
  { id: "experience", title: "EXPERIENCE", subtitle: "The reel so far" },
  { id: "contact", title: "CONTACT", subtitle: "Book a shoot" },
];

export default function MainContent() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [hasShownHeader, setHasShownHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently most centered in the viewport
      const viewportCenter = window.innerHeight / 2;

      let currentActive = SECTIONS[0];
      let minDistance = Infinity;

      SECTIONS.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Distance from the vertical center of the viewport to the vertical center of the section
          const sectionMid = (rect.top + rect.bottom) / 2;
          const distance = Math.abs(sectionMid - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            currentActive = section;
          }
        }
      });

      if (currentActive.id !== activeSection.id) {
        setActiveSection(currentActive);
      }

      // Check if header should be visible (appears sooner, when photos section is approaching the top)
      const photosElement = document.getElementById("photos");
      if (photosElement) {
        const rect = photosElement.getBoundingClientRect();
        // Trigger earlier (when top of photos is 400px from top)
        const visible = rect.top <= 400;
        setIsHeaderVisible(visible);
        if (visible && !hasShownHeader) {
          setHasShownHeader(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection.id, hasShownHeader]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 relative">
      {/*
        The "Navbar" Title Section
        - Fixed to the top
        - Offset by md:pl-20 to account for side navbar
      */}
      <div className="fixed top-0 left-0 md:left-20 right-0 z-40 pointer-events-none flex justify-center pt-6 px-6">
        <AnimatePresence>
          {isHeaderVisible && (
            <motion.div
              initial={hasShownHeader ? { opacity: 1, y: 0 } : { y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto bg-[#080807]/90 backdrop-blur-xl border border-white/10 rounded-full px-8 md:px-12 py-3 md:py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-row items-center gap-6 md:gap-10"
            >
              <FocusText
                text={activeSection.title}
                className="font-heading text-2xl md:text-4xl font-black tracking-tight text-white uppercase"
              />

              {/* Vertical Separator */}
              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-amber-400 text-[10px] md:text-xs italic font-bold tracking-[0.3em] uppercase whitespace-nowrap hidden sm:block"
              >
                {activeSection.subtitle}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*
        The Scrollable Content Section
      */}
      <div className="w-full flex flex-col pt-20 sm:pt-24 pb-0 overflow-visible">
        <div className="flex flex-col gap-20 sm:gap-28 md:gap-36">
          <Photos hideTitle />
          <div className="pt-4 sm:pt-6 md:pt-8">
            <Films hideTitle />
          </div>
          <div className="pt-4 sm:pt-6 md:pt-8">
            <Kit hideTitle />
          </div>
          <div className="pt-4 sm:pt-6 md:pt-8">
            <Experience hideTitle />
          </div>
          <div className="-mt-12 sm:-mt-16 md:-mt-20">
            <Contact hideTitle />
          </div>
        </div>
      </div>
    </div>
  );
}
