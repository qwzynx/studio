import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frame Not Found | Mahan Ghafarian Studio",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[95dvh] w-full flex-col items-center justify-center px-6 py-16 text-center">
      {/* Viewfinder corners, echoing the hero HUD */}
      <div className="pointer-events-none absolute inset-6 md:inset-12" aria-hidden>
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white/25 md:h-12 md:w-12" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white/25 md:h-12 md:w-12" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/25 md:h-12 md:w-12" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white/25 md:h-12 md:w-12" />
      </div>

      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 md:text-xs">
        no signal
      </p>
      <h1 className="mt-4 font-heading font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
        404
      </h1>
      <p className="mt-2 text-lg font-bold tracking-tight text-white md:text-2xl">
        Frame not found
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400 md:text-base">
        This roll never made it back from the lab — the page you&apos;re after
        doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-linear-to-r from-amber-600 to-amber-500 px-7 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.7)] sm:text-sm"
      >
        Back to the studio
      </Link>
    </div>
  );
}
