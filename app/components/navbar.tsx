"use client";

import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Camera, Clapperboard, Aperture, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Section links live on the home page — hrefs are rooted ("/#photos") so the
// navbar still works from /photos/* pages, where a bare "#photos" anchor
// would silently go nowhere.
const SECTION_LINKS = [
  { id: "photos", label: "Photos", icon: Camera },
  { id: "videos", label: "Videos", icon: Clapperboard },
  { id: "kit", label: "Kit", icon: Aperture },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: FaEnvelope },
] as const;

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";

  const scrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only hijack on the home page — elsewhere the link navigates to /#contact.
    if (!onHome) return;
    e.preventDefault();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      ticking = false;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = window.scrollY;
        const progress = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      // Scroll-spy (home page only): light up the link whose section is
      // closest to the viewport centre, same rule the floating pill uses.
      if (!onHome) {
        setActiveId(null);
        return;
      }
      const viewportCenter = window.innerHeight / 2;
      let current: string | null = null;
      let minDistance = Infinity;
      SECTION_LINKS.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          current = id;
        }
      });
      // Above the photos section the hero owns the screen — no link lights up.
      const photosEl = document.getElementById("photos");
      if (photosEl && photosEl.getBoundingClientRect().top > viewportCenter) {
        current = null;
      }
      setActiveId(current);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress(); // Check initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onHome]);

  return (
    <div
      className="fixed bottom-6 md:bottom-auto left-1/2 md:left-6 md:top-1/2 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-50 rounded-full p-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
      style={{
        background: `conic-gradient(from 0deg, rgba(245, 158, 11, 0.8) ${scrollProgress}%, rgba(255, 255, 255, 0.1) ${scrollProgress}%)`,
      }}
    >
      <nav className="flex flex-row md:flex-col items-center gap-3.5 sm:gap-5 md:gap-10 px-5 sm:px-6 py-3 md:py-8 bg-[#080807]/90 backdrop-blur-xl rounded-full h-full">
        {/* Logo - Hidden on tiny screens, shown on md+ */}
        <div className="hidden md:flex w-full justify-center">
          <Link
            href="/#home"
            className="text-white text-2xl font-bold tracking-tighter flex flex-col items-center leading-none"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            MG
            <span className="text-[8px] font-bold tracking-[0.35em] text-amber-500 mt-1 mr-[-0.35em]">STUDIO</span>
          </Link>
        </div>

        {/* Primary Links */}
        <div className="flex flex-row md:flex-col gap-4 sm:gap-6 md:gap-8 items-center text-gray-300">
          {SECTION_LINKS.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              href={`/#${id}`}
              onClick={id === "contact" ? scrollToBottom : undefined}
              className={`transition-colors duration-300 tracking-widest text-xs md:text-sm font-medium uppercase md:capitalize writing-v-rl ${
                activeId === id ? "text-amber-400" : "hover:text-white"
              }`}
              title={label}
              aria-current={activeId === id ? "location" : undefined}
            >
              <span className="md:hidden"><Icon size={20} /></span>
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* Separator - Mobile only */}
        <div className="w-px h-6 bg-white/10 md:hidden mx-1"></div>

        {/* Social Icons */}
        <div className="flex flex-row md:flex-col gap-3 sm:gap-4 items-center text-gray-400">
          <a href="https://www.instagram.com/qwzynx/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors duration-300">
            <FaInstagram size={18} className="md:w-5 md:h-5 w-4.5 h-4.5" />
          </a>
          <a href="https://www.linkedin.com/in/mahan-ghafarian-b02ba0298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors duration-300">
            <FaLinkedin size={18} className="md:w-5 md:h-5 w-4.5 h-4.5" />
          </a>
          <a href="https://github.com/qwzynx" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors duration-300">
            <FaGithub size={18} className="md:w-5 md:h-5 w-4.5 h-4.5" />
          </a>
        </div>
      </nav>
    </div>
  );
}
