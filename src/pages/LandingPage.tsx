import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/Button";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      hero.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, shouldReduceMotion]);

  const staticVisible = { opacity: 1, y: 0 };
  const staticHidden = { opacity: 1, y: 0 };

  return (
    <div className="relative min-h-screen bg-background selection:bg-gold/30">
      <div className="fixed inset-0 z-50 bg-grain pointer-events-none" />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      >
        {/* Ambient light */}
        <div
          className={`absolute inset-0 pointer-events-none z-0 ${
            shouldReduceMotion
              ? "ambient-static"
              : isMobile
              ? "animate-pulse-slow"
              : "ambient-glow"
          }`}
          style={
            isMobile && !shouldReduceMotion
              ? {
                  background:
                    "radial-gradient(100vw circle at 50% 30%, rgba(212,168,83,0.15) 0%, transparent 60%)",
                }
              : undefined
          }
        />

        <div className="container mx-auto px-6 md:px-12 z-10 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Photo */}
            <motion.div
              initial={shouldReduceMotion ? staticHidden : { opacity: 0, scale: 0.96 }}
              animate={shouldReduceMotion ? staticVisible : { opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="w-full max-w-[280px] md:max-w-none lg:w-[45%] order-1 md:order-2 flex justify-center md:justify-end"
              style={shouldReduceMotion ? {} : undefined}
            >
              <div className="relative w-full max-w-[480px] aspect-[3/4] overflow-hidden rounded-3xl">
                <img
                  src="/panji-profile.jpg"
                  alt="Panji Firmansyah — GTM Consultant & Creator"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(14,11,8,0.35) 0%, transparent 25%, transparent 60%, rgba(14,11,8,0.85) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(14,11,8,0.6) 0%, transparent 30%)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(14,11,8,0.4) 0%, transparent 25%)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "rgba(180,120,30,0.07)",
                    mixBlendMode: "overlay",
                  }}
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={shouldReduceMotion ? staticHidden : { opacity: 0, x: -30 }}
              animate={shouldReduceMotion ? staticVisible : { opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="w-full lg:w-[55%] flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1"
            >
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] font-display text-text-primary tracking-wide mb-6">
                PANJI <br className="hidden md:block" />
                <span className="text-gold">FIRMANSYAH</span>
              </h1>

              <p className="text-[clamp(1.1rem,2.5vw,1.5rem)] text-text-primary/90 font-sans leading-relaxed mb-8 max-w-xl">
                I help B2B founders get consistent leads without relying on their network.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 mb-10 text-xs md:text-sm text-text-muted uppercase tracking-[0.18em] font-medium">
                <span className="whitespace-nowrap">GTM Consultant</span>
                <span className="text-gold/60">·</span>
                <span className="whitespace-nowrap">Content Creator</span>
                <span className="text-gold/60">·</span>
                <span className="whitespace-nowrap">100K+ Followers</span>
              </div>

              <Button href="mailto:hello@panjifirmansyah.com" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Let's Talk
              </Button>
            </motion.div>
          </div>
        </div>

      </section>
    </div>
  );
}
