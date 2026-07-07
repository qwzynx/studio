import Hero from "./components/hero";
import MainContent from "./components/main-content";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="w-full flex flex-col relative">
      {/* Snap Point 1: The Hero */}
      <div className="snap-start w-full">
        <Hero />
      </div>

      {/* Snap Point 2: The Start of Content */}
      <div className="snap-start w-full pt-4 md:pt-6">
        <MainContent />
      </div>

      {/* On md+ the footer overlays the empty bottom of the full-height contact
          section, so the centered contact content stays centered at max scroll */}
      <div className="md:absolute md:bottom-0 md:left-0 md:right-0 md:z-20">
        <Footer />
      </div>
    </div>
  );
}
