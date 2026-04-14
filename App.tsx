import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import PhilosophySection from './sections/PhilosophySection';
import LivingRoomSection from './sections/LivingRoomSection';
import KitchenSection from './sections/KitchenSection';
import BedroomSection from './sections/BedroomSection';
import DiningSection from './sections/DiningSection';
import BathroomSection from './sections/BathroomSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const snapTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    // Wait for all section ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      // Build ranges and snap targets from actual pinned sections
      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      snapTriggerRef.current = ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            // If not in pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
      }
    };
  }, []);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const scrollToPhilosophy = () => {
    const element = document.getElementById('philosophy');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Section 1: Hero */}
        <div id="hero">
          <HeroSection onEnterClick={scrollToPhilosophy} />
        </div>

        {/* Section 2: Philosophy */}
        <div id="philosophy">
          <PhilosophySection />
        </div>

        {/* Section 3: Living Room */}
        <div id="portfolio">
          <LivingRoomSection />
        </div>

        {/* Section 4: Kitchen */}
        <div id="kitchen">
          <KitchenSection />
        </div>

        {/* Section 5: Bedroom */}
        <div id="bedroom">
          <BedroomSection />
        </div>

        {/* Section 6: Dining */}
        <div id="dining">
          <DiningSection />
        </div>

        {/* Section 7: Bathroom */}
        <div id="about">
          <BathroomSection onContactClick={scrollToContact} />
        </div>

        {/* Section 8: Contact */}
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </>
  );
}

export default App;
