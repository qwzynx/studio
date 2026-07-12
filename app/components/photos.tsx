"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { collections, type Collection } from "../lib/collections";

// Every category is a closed film canister standing back to back on ONE
// shelf row (horizontally scrollable when the viewport is narrower than the
// shelf). Clicking a canister lifts it OFF the shelf — a framer-motion
// layoutId flight carries the roll down into the detail area, leaving a
// dashed recess in its shelf slot so no other roll ever moves — and once it
// lands, the film is pulled out of the canister's slot: the whole printed
// strip slides rightward inside a clipping wrapper, leading edge first.
// Closing runs the same story backwards, strictly in sequence: the film
// rolls back INTO the canister first (the canister stays put while it does),
// then the canister flies home while the detail space collapses. Switching
// rolls chains close-then-open: A rolls its film in and returns to the
// shelf, then B flies down and unrolls. The sequencing is driven by
// animation-complete callbacks, not timers: `target` is the roll the user
// wants open, `current` is the roll actually mounted in the detail area
// (`homing` marks the canister's return leg), and `current` only catches up
// to `target` when the previous phase has finished animating.
//
// NOTE: the layoutId flight only animates when the outgoing canister is a
// live element that unmounts in the SAME commit the incoming one mounts.
// An element inside an exiting AnimatePresence subtree is frozen and yields
// no snapshot — the new canister then teleports. That is why the panel's
// height is animated with a plain `animate` prop (content unmounted
// manually once it finishes) instead of AnimatePresence, and why `homing`
// swaps the detail canister for a spacer rather than relying on an exit.
// Hover effects are fully contained inside each roll's own footprint (lift +
// cover photo through the label window + a small photo-count detail).
// Collection data (photos, titles, descriptions) lives in app/lib/collections.ts.
type RollSize = "sm" | "md" | "lg";

const rollSizes: Record<string, RollSize> = {
  portrait: "lg",
  street: "md",
  landscape: "lg",
  nature: "sm",
  night: "sm",
  studio: "md",
  product: "md",
  architecture: "lg",
  events: "sm",
};

const rollConfig: Record<RollSize, { height: string; width: string; title: string }> = {
  lg: { height: "h-44 md:h-52", width: "w-16 md:w-24", title: "text-lg md:text-2xl" },
  md: { height: "h-36 md:h-44", width: "w-14 md:w-20", title: "text-base md:text-xl" },
  sm: { height: "h-28 md:h-36", width: "w-12 md:w-16", title: "text-sm md:text-lg" },
};

const unrollEase = [0.33, 1, 0.4, 1] as const;

// Gentle no-overshoot spring for the roll's flight between shelf and detail
// area — springs track velocity, so the down/up trips feel far smoother than
// a fixed-duration tween. No bounce: the flight also interpolates the roll's
// size, and overshoot reads as rubbery when scale is involved.
const flightSpring = { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const;

function SprocketRow() {
  return (
    <div className="h-3 flex-none overflow-hidden px-2" aria-hidden>
      <div className="film-transport-x flex w-max gap-2.5 [--sprocket-step-x:1.125rem]">
        {Array.from({ length: 96 }).map((_, i) => (
          <span key={i} className="mt-[3px] h-1.5 w-2 flex-none rounded-full bg-white/25" />
        ))}
      </div>
    </div>
  );
}

// The canister cylinder. Shared between the shelf and the detail area — the
// matching layoutId is what makes the clicked roll fly between the two.
// `overlays` slots extra content into the label window (the shelf adds the
// hover photo reveal there).
function CanisterShell({
  collection,
  titleClass,
  highlight,
  overlays,
}: {
  collection: Collection;
  titleClass: string;
  highlight: boolean;
  overlays?: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`absolute inset-0 rounded-2xl border bg-neutral-900 shadow-lg shadow-black/40 transition-colors duration-500 ${
          highlight ? "border-amber-400/70" : "border-white/10 group-hover:border-amber-400/40"
        }`}
      />
      {/* Slim end caps */}
      <div className="absolute inset-x-2.5 top-1.5 h-px bg-white/15" />
      <div className="absolute inset-x-2.5 bottom-1.5 h-px bg-white/15" />
      {/* Label window */}
      <div
        className={`absolute inset-x-1.5 top-3 bottom-3 overflow-hidden rounded-xl bg-linear-to-b ${collection.gradient} transition-shadow duration-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] ${
          highlight ? "shadow-[0_0_24px_rgba(245,158,11,0.35)]" : ""
        }`}
      >
        {overlays}
        {/* Faint curvature so the label still reads as a cylinder */}
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/25" />
        {/* Process dots */}
        <div className="absolute top-2 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-white/80" />
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span className="h-1 w-1 rounded-full bg-white/30" />
        </div>
        <div className="relative flex h-full items-center justify-center gap-0.5 overflow-hidden px-1 pt-2 pb-4">
          <p
            className={`[writing-mode:vertical-rl] rotate-180 whitespace-nowrap ${titleClass} font-bold tracking-tight text-white drop-shadow-sm`}
          >
            {collection.name}
          </p>
          <p className="hidden max-h-full [writing-mode:vertical-rl] rotate-180 truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70 md:block">
            {collection.tagline}
          </p>
        </div>
      </div>
    </>
  );
}

// Hover reveal shared by every roll wherever it sits (shelf or detail area):
// the cover photo shows through the label window with a small exposure-count
// detail — all inside the roll's own footprint.
function HoverPeek({ collection }: { collection: Collection }) {
  return (
    <>
      <Image
        src={collection.photos[0].src}
        alt=""
        fill
        sizes="120px"
        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      {/* Darkens the photo so the vertical title stays readable */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      {/* Photo-count detail rises in with the photo */}
      <span className="absolute inset-x-0 bottom-1.5 z-10 translate-y-2 text-center font-mono text-[8px] font-bold uppercase tracking-widest text-amber-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:text-[9px]">
        {collection.photos.length} exp
      </span>
    </>
  );
}

function FilmRoll({
  collection,
  index,
  isAway,
  isOpen,
  onToggle,
}: {
  collection: Collection;
  index: number;
  // The canister currently lives in the detail area (or is still rolling its
  // film back in down there) — the shelf slot must NOT render it, otherwise
  // the layoutId flight home fires before the film has rolled in.
  isAway: boolean;
  // The roll the user has open or is opening (drives aria-expanded).
  isOpen: boolean;
  onToggle: () => void;
}) {
  const size = rollSizes[collection.slug] ?? "md";
  const cfg = rollConfig[size];
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="photos-detail"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group relative flex-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 ${cfg.width} ${cfg.height}`}
    >
      {/* Dashed recess left behind while the roll is down in the detail area —
          it keeps the slot's footprint so no other roll ever moves */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] transition-opacity duration-300 ${
          isAway ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
          {collection.name}
        </span>
      </div>

      {/* The roll itself — lifts on hover (a transform never moves
          neighbours); on click it flies down to the detail area via layoutId.
          The hover lift lives on an INNER div: a CSS transform transition on
          the layoutId element itself would fight framer's per-frame flight
          transforms and the canister would teleport instead of flying. */}
      {!isAway && (
        <motion.div
          layoutId={`film-roll-${collection.slug}`}
          transition={reduce ? { duration: 0 } : flightSpring}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
            <CanisterShell
              collection={collection}
              titleClass={cfg.title}
              highlight={false}
              overlays={<HoverPeek collection={collection} />}
            />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

// The detail area beneath the shelf: the landed canister on the left, and
// the film pulled out of it — the strip translates out from behind the
// canister so its content moves with the film. On close it slides back in
// before the space collapses.
function DetailStrip({
  collection,
  open,
  withCanister,
  onClose,
  onRolledIn,
  reduceMotion,
}: {
  collection: Collection;
  // true while this roll should be showing its film; flipping it to false
  // rolls the film back into the canister (which stays put until it's in).
  open: boolean;
  // false during the return leg: the canister unmounts HERE (a live-tree
  // unmount, so its layoutId snapshot survives) and remounts on the shelf,
  // which is what makes the flight home animate. A spacer keeps the strip's
  // spot while the panel collapses.
  withCanister: boolean;
  onClose: () => void;
  // Fired once the film has fully rolled back in — only then may the parent
  // collapse the panel and let the canister fly home.
  onRolledIn: () => void;
  reduceMotion: boolean;
}) {
  // Opening: the unroll waits for the roll to visibly land (the spring
  // flight has mostly settled by ~0.6s after mount) so the film clearly
  // comes out of the canister, not out of thin air. The flight happens
  // exactly once, at mount — after that window any unroll (e.g. re-opening
  // an interrupted close) starts immediately instead of pausing mid-strip.
  // Closing: roll straight back in, no delay.
  const [flightSettled, setFlightSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFlightSettled(true), 600);
    return () => clearTimeout(t);
  }, []);
  const filmTransition = open
    ? { duration: reduceMotion ? 0 : 1, delay: reduceMotion || flightSettled ? 0 : 0.6, ease: [0.25, 1, 0.35, 1] as const }
    : { duration: reduceMotion ? 0 : 0.5, ease: unrollEase };

  return (
    <div className="flex items-stretch">
      {/* The landed canister — same layoutId as its shelf slot, so it flies.
          Clicking it (wherever the roll is) closes the description again. */}
      {withCanister ? (
        <motion.button
          type="button"
          onClick={onClose}
          aria-label={`Close ${collection.name} details`}
          layoutId={`film-roll-${collection.slug}`}
          transition={reduceMotion ? { duration: 0 } : flightSpring}
          className="group relative z-10 h-48 w-16 flex-none cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 md:h-52 md:w-28"
        >
          <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
            <CanisterShell
              collection={collection}
              titleClass="text-lg md:text-2xl"
              highlight
              overlays={<HoverPeek collection={collection} />}
            />
            {/* Slot mouth the film feeds out of */}
            <div className="absolute right-0 inset-y-5 w-1.5 rounded-l bg-black/70 shadow-[inset_1px_0_2px_rgba(0,0,0,0.9)]" aria-hidden />
          </div>
        </motion.button>
      ) : (
        <div className="h-48 w-16 flex-none md:h-52 md:w-28" aria-hidden />
      )}

      {/* The film itself, pulled out from behind the canister: the whole
          printed strip translates out of the slot (leading edge first) inside
          this clipping wrapper — the content travels WITH the film, which is
          what makes it read as physically unrolling rather than a wipe. */}
      <div className="relative -ml-2 min-w-0 flex-1 overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: open ? 0 : "-100%" }}
          transition={filmTransition}
          onAnimationComplete={() => {
            if (!open) onRolledIn();
          }}
          className="group relative flex h-48 flex-col overflow-hidden rounded-r-2xl border border-white/10 bg-neutral-950 shadow-xl shadow-black/50 md:h-52"
        >
          <SprocketRow />

          <div className="flex min-h-0 min-w-0 flex-1 items-center gap-4 pl-4 pr-3 md:gap-6 md:pl-7 md:pr-4">
            {/* Details */}
            <div className="relative min-w-0 flex-1">
              <div className={`absolute -inset-2 rounded-xl bg-linear-to-br ${collection.gradient} opacity-[0.07]`} />
              <p className="relative text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300 md:text-[10px]">
                {collection.tagline}
              </p>
              <h3 className="relative mt-0.5 text-lg font-bold tracking-tight text-white md:text-2xl">
                {collection.name}
              </h3>
              <p className="relative mt-1 line-clamp-2 max-w-prose text-xs leading-relaxed text-gray-300 md:mt-1.5 md:line-clamp-3 md:text-sm">
                {collection.description}
              </p>
              <div className="relative mt-2.5 flex flex-wrap items-center gap-3 md:mt-3.5 md:gap-4">
                <Link
                  href={`/photos/${collection.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-amber-400 md:px-5 md:py-2 md:text-[11px]"
                >
                  Open gallery
                  <ArrowUpRight size={13} />
                </Link>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 md:text-[11px]">
                  {collection.photos.length} photos
                </span>
              </div>
            </div>

            {/* Contact-sheet preview frames — lg+ only: below that the frames
                would crush the text column to nothing */}
            <div className="hidden min-w-0 gap-3 lg:flex">
              {collection.photos.slice(0, 3).map((photo, i) => (
                <div
                  key={photo.src}
                  className={`relative aspect-[4/3] h-32 min-w-0 overflow-hidden rounded-lg border border-white/10 ${
                    i === 2 ? "hidden xl:block" : ""
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                  {/* Light leak sweep on hover */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="light-leak absolute -top-1/4 -bottom-1/4 w-1/2 bg-linear-to-r from-transparent via-amber-200/25 to-transparent" />
                  </div>
                  <span className="absolute bottom-1 right-1.5 font-mono text-[8px] font-bold tracking-widest text-amber-300/80">
                    {String(i + 1).padStart(2, "0")}A
                  </span>
                </div>
              ))}
            </div>
          </div>

          <SprocketRow />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-2 top-4 rounded-full border border-white/10 bg-black/60 p-1.5 text-white/60 transition-colors duration-300 hover:border-amber-400/40 hover:text-amber-300"
          >
            <X size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Photos({ hideTitle = false }: { hideTitle?: boolean }) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Below lg the shelf scrolls, and the scroll gets a film-camera treatment:
  // canisters recede and tilt away from the "gate" (each slot gets its own
  // perspective transform, coverflow-style, anchored to the shelf line via
  // origin-bottom) while the roll IN the gate stands flat, full-bright, and
  // lifted slightly off the shelf; scroll-snap ratchets swipes roll by roll
  // like a film advance, and a counter HUD under the shelf names the gated
  // roll. The gate is scroll PROGRESS mapped across the rolls — not the raw
  // viewport centre — so the first/last rolls are selectable at the ends of
  // the range even though they can never physically reach the centre; tilt,
  // lift, and counter all key off the same gate so they never disagree.
  // Everything (including the lift) is a pure function of scroll position
  // written straight to the DOM in one rAF per scroll event — no CSS
  // transitions that could lag behind a fast fling — and React only
  // re-renders when the gated INDEX changes. Transforms live on a plain
  // wrapper div around each FilmRoll — never on the motion elements, whose
  // inline transforms framer owns. offsetLeft (layout position) is used for
  // the geometry so the transforms we write never feed back into the
  // measurement.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rollWraps = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // Mid-layout (e.g. during a viewport resize) the scroller can measure
      // 0 wide — skip rather than write garbage; the ResizeObserver fires
      // again once it has a real size.
      if (scroller.clientWidth === 0) return;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const canScroll = maxScroll > 8;
      const centers: number[] = [];
      rollWraps.current.forEach((el, i) => {
        if (el) centers[i] = el.offsetLeft + el.offsetWidth / 2;
      });
      if (centers.length < 2) return;
      // The gate in content coordinates (see the comment block above)
      const gate =
        centers[0] +
        (centers[centers.length - 1] - centers[0]) * (canScroll ? scroller.scrollLeft / maxScroll : 0);
      let best = 0;
      let bestDist = Infinity;
      rollWraps.current.forEach((el, i) => {
        if (!el) return;
        const d = centers[i] - gate;
        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d);
          best = i;
        }
        if (!canScroll || reduceMotion) {
          // lg+ (shelf fits) or reduced motion: leave the slots untouched
          if (el.style.transform) {
            el.style.transform = "";
            el.style.opacity = "";
          }
          return;
        }
        const t = Math.max(-1, Math.min(1, d / (scroller.clientWidth * 0.6)));
        // Lift peaks at the gate and dies off within roughly a slot's
        // width, so mid-swipe it hands over smoothly between neighbours
        const near = Math.max(0, 1 - Math.abs(d) / (scroller.clientWidth * 0.22));
        el.style.transform = `perspective(700px) translateY(${(-near * near * 10).toFixed(2)}px) rotateY(${(-t * 18).toFixed(2)}deg) scale(${(1 - Math.abs(t) * 0.12).toFixed(3)})`;
        el.style.opacity = (1 - Math.abs(t) * 0.35).toFixed(3);
      });
      if (canScroll && frameRef.current !== best) {
        frameRef.current = best;
        setFrame(best);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  // Autofocus reticle that trails the cursor across the shelf and locks onto rolls
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reticleX = useSpring(mouseX, { stiffness: 350, damping: 30 });
  const reticleY = useSpring(mouseY, { stiffness: 350, damping: 30 });
  const [reticle, setReticle] = useState({ visible: false, locked: false });

  // `target` is the roll the user wants open; `current` is the roll actually
  // mounted in the detail area; `homing` is the return leg (film already
  // rolled in, canister flying back to the shelf while the panel collapses).
  // Close sequence: film rolls in (current stays) -> homing (canister swaps
  // to the shelf and flies home, panel collapses) -> collapse finishes
  // (current -> null, or straight to the pending switch's roll). Each
  // hand-off is driven by an animation-complete callback, never a timer.
  const [target, setTarget] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [homing, setHoming] = useState(false);
  const shownCollection = collections.find((c) => c.slug === current) ?? null;
  const panelOpen = current !== null && !homing;

  const handleToggle = (slug: string) => {
    if (target === slug) {
      // Close (or cancel a pending open) — the film rolls back in first;
      // the rest of the teardown follows from the animation callbacks.
      setTarget(null);
      return;
    }
    setTarget(slug);
    if (current === null) {
      // Empty detail area: land this roll straight away.
      setCurrent(slug);
    } else if (current === slug) {
      // Re-opening the roll that is mid-close: cancel the return leg (the
      // canister flies back down from wherever it is) and let the strip
      // unroll again. If it was only mid-roll-in, homing is false already.
      setHoming(false);
    }
    // Otherwise a different roll is still closing — `current` catches up to
    // `target` when its collapse completes below.
  };

  // Bring the detail strip into view once it has unrolled (it sits below the
  // shelf, which may be off-screen when a roll is clicked).
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => {
      panelRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }, 380);
    return () => clearTimeout(t);
  }, [current, reduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = shelfRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
    const locked = !!(e.target as HTMLElement).closest("a, button");
    setReticle((r) => (r.visible && r.locked === locked ? r : { visible: true, locked }));
  };

  return (
    <section id="photos" className="w-full flex flex-col items-start z-10 relative">
      {/* When the floating pill carries the visual title, keep a real heading
          in the document for crawlers and screen readers — display:none drops
          it from the outline entirely */}
      {hideTitle ? (
        <h2 className="sr-only">Photos — stills worth a thousand frames</h2>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start mb-10"
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-left leading-none text-transparent bg-clip-text bg-linear-to-t from-white/20 via-white/80 to-white">
            PHOTOS
          </h2>
          <p className="text-amber-400 mt-4 text-sm md:text-base italic font-semibold tracking-widest uppercase text-left">Stills worth a thousand frames</p>
        </motion.div>
      )}

      <div
        ref={shelfRef}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={() => setReticle((r) => ({ ...r, visible: false }))}
        className="relative w-full"
      >
        {/* Shelf — every canister back to back on one row; scrolls sideways
            when the viewport is narrower than the shelf. pt gives the hover
            lift headroom inside the scroll container's clip. */}
        {/* lg+: the shelf fits, so drop the scroll clipping — the roll's
            return flight up to its slot stays fully visible */}
        <div className="relative">
          {/* pt-6 below lg: the scroll clip needs headroom for the gated
              roll's 10px lift plus the 6px hover lift stacked on top of it */}
          <div
            ref={scrollerRef}
            className="w-full snap-x snap-mandatory overflow-x-auto overflow-y-clip overscroll-x-contain pt-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] lg:snap-none lg:overflow-visible lg:pt-3"
          >
            <div className="mx-auto flex w-max items-end gap-1 px-0.5 sm:gap-1.5 md:gap-2">
              {collections.map((collection, i) => (
                <div
                  key={collection.slug}
                  ref={(el) => {
                    rollWraps.current[i] = el;
                  }}
                  className="flex-none snap-center origin-bottom will-change-transform"
                >
                  <FilmRoll
                    collection={collection}
                    index={i}
                    isAway={current === collection.slug && !homing}
                    isOpen={target === collection.slug}
                    onToggle={() => handleToggle(collection.slug)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Edge fades signal there are more rolls off-screen — the shelf
              only scrolls below lg, so they vanish with the scroll clipping */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-[#080807] to-transparent lg:hidden" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-[#080807] to-transparent lg:hidden" aria-hidden />
        </div>
        {/* Shelf line the rolls stand on */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" aria-hidden />
        {/* Frame-counter HUD (scrolling shelves only): sprocket-hole pips
            track scroll progress and the readout names whichever roll sits
            in the gate — it doubles as the swipe/tap hint */}
        <div className="mt-2.5 flex w-full flex-col items-center gap-1.5 lg:hidden" aria-hidden>
          <div className="flex items-center gap-[5px]">
            {collections.map((c, i) => (
              <span
                key={c.slug}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === frame ? "w-4 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "w-2 bg-white/15"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-gray-600">
            <span className="text-amber-400/90">{String(frame + 1).padStart(2, "0")}</span>
            <span className="text-white/25">/{String(collections.length).padStart(2, "0")}</span>
            <span> · {collections[frame]?.name}</span>
            <span className="text-white/25"> · tap to open</span>
          </p>
        </div>

        {/* Detail area the clicked roll drops into and unrolls across.
            Deliberately NOT an AnimatePresence: the height is animated
            directly and the content unmounted by hand once the collapse
            finishes, so the canister always unmounts from a live tree and
            its layoutId flight home actually animates (see file comment). */}
        <div id="photos-detail" ref={panelRef}>
          <motion.div
            initial={false}
            animate={{ height: panelOpen ? "auto" : 0 }}
            // Opening grows over roughly the flight's settle time so the
            // space tracks the roll's descent; the collapse runs while the
            // canister flies home (the film is already rolled in by then).
            transition={
              panelOpen
                ? { duration: reduceMotion ? 0 : 0.55, ease: [0.25, 1, 0.36, 1] }
                : { duration: reduceMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }
            }
            onAnimationComplete={(def) => {
              // Collapse finished: clear the closed roll, or hand straight
              // over to a pending switch (its roll then flies down off the
              // shelf as this content swaps).
              if (typeof def === "object" && def !== null && "height" in def && def.height === 0 && homing) {
                setHoming(false);
                setCurrent(target);
              }
            }}
            // No overflow-hidden here: it would clip the canister mid-flight.
            // The strip clips itself inside its own wrapper, so nothing
            // spills visibly.
          >
            {shownCollection && (
              <div className="pt-6 md:pt-8 pb-2">
                <DetailStrip
                  key={shownCollection.slug}
                  collection={shownCollection}
                  open={target === current && !homing}
                  withCanister={!homing}
                  onClose={() => setTarget(null)}
                  onRolledIn={() => setHoming(true)}
                  reduceMotion={!!reduceMotion}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Focus reticle trailing the cursor; turns amber and shrinks when it locks a roll */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            style={{ x: reticleX, y: reticleY }}
            animate={{ opacity: reticle.visible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 w-0 h-0 z-20 pointer-events-none hidden lg:block"
          >
            <motion.div
              animate={{ scale: reticle.locked ? 0.8 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ x: "-50%", y: "-50%" }}
              className={`relative w-16 h-16 transition-colors duration-200 ${
                reticle.locked ? "text-amber-400" : "text-white/60"
              }`}
            >
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-current" />
              <span
                className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tracking-[0.2em] transition-opacity duration-200 ${
                  reticle.locked ? "opacity-100" : "opacity-0"
                }`}
              >
                AF·LOCK
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
