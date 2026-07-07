"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FocusTextProps {
  text: string;
  className?: string;
}

/* Racks the text into focus like a lens pull — the studio's answer to the dev site's glitch effect */
export default function FocusText({ text, className }: FocusTextProps) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={text}
          initial={{ filter: "blur(8px)", opacity: 0.3, letterSpacing: "0.08em" }}
          animate={{ filter: "blur(0px)", opacity: 1, letterSpacing: "0em" }}
          exit={{ filter: "blur(8px)", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
