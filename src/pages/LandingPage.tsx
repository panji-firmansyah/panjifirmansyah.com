import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Instagram, Linkedin, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/Button";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, 50]);
  const parallaxOpacity = useTransform(scrollY, [0, 300], [1, 0]);

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

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
              style={shouldReduceMotion ? {} : { y: parallaxY, opacity: parallaxOpacity }}
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

        {/* Scroll indicator */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-text-muted/50 hidden md:flex"
          >
            <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* CREDIBILITY STRIP */}
      <section className="relative bg-surface py-24 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <motion.div
            variants={shouldReduceMotion ? undefined : staggerContainer}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16"
          >
            {/* Column 1: Results */}
            <motion.div
              variants={shouldReduceMotion ? undefined : staggerItem}
              className="flex flex-col space-y-8"
            >
              <div>
                <h2 className="text-xs font-sans text-text-muted uppercase tracking-[0.2em] mb-6">Results</h2>
                <div className="space-y-6">
                  <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <div className="relative z-10">
                      <span className="block text-4xl md:text-5xl font-display text-gold mb-2">
                        [X]k+
                      </span>
                      <span className="text-text-primary/80 font-medium">Leads Generated</span>
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <div className="relative z-10">
                      <span className="block text-4xl md:text-5xl font-display text-gold mb-2">
                        [X]+
                      </span>
                      <span className="text-text-primary/80 font-medium">Companies Scaled</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Column 2: Clients */}
            <motion.div
              variants={shouldReduceMotion ? undefined : staggerItem}
              className="flex flex-col space-y-8 md:pt-0 pt-4 border-t border-white/5 md:border-t-0 md:border-l md:pl-8 lg:pl-16"
            >
              <div>
                <h2 className="text-xs font-sans text-text-muted uppercase tracking-[0.2em] mb-6">Trusted By</h2>
                <div className="flex flex-col justify-center h-full">
                  <ul className="space-y-4 mb-8">
                    {["Company A", "Company B", "Company C", "Company D"].map(
                      (client, i) => (
                        <li
                          key={i}
                          className="flex items-center space-x-3 text-lg text-text-primary/90 font-display"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 flex-shrink-0" />
                          <span>{client}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Trusted by B2B companies across Indonesia.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Column 3: Creator */}
            <motion.div
              variants={shouldReduceMotion ? undefined : staggerItem}
              className="flex flex-col space-y-8 md:pt-0 pt-4 border-t border-white/5 md:border-t-0 md:border-l md:pl-8 lg:pl-16"
            >
              <div>
                <h2 className="text-xs font-sans text-text-muted uppercase tracking-[0.2em] mb-6">Creator Profile</h2>
                <div className="bg-background rounded-2xl p-8 border border-white/5 shadow-inner relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
                  <span className="block text-4xl font-display text-gold mb-2">100K+</span>
                  <span className="block text-text-primary font-medium mb-4">
                    Followers Across Platforms
                  </span>
                  <p className="text-sm text-text-muted italic mb-8">
                    Known for the viral{" "}
                    <span className="text-text-primary/80 not-italic font-medium">
                      "Masakin Stranger"
                    </span>{" "}
                    series.
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-primary hover:bg-gold hover:text-background transition-colors duration-300"
                    >
                      <Instagram size={18} />
                    </a>
                    <a
                      href="#"
                      aria-label="TikTok"
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-primary hover:bg-gold hover:text-background transition-colors duration-300"
                    >
                      <TikTokIcon className="w-[18px] h-[18px]" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-6 text-center z-10 relative">
          <motion.div
            initial={shouldReduceMotion ? staticHidden : { opacity: 0, y: 20 }}
            whileInView={staticVisible}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            <h2 className="text-3xl md:text-5xl font-display text-text-primary mb-8 leading-tight">
              Ready to build your <br />
              <span className="text-gold italic">marketing engine?</span>
            </h2>

            <Button
              href="mailto:hello@panjifirmansyah.com"
              size="lg"
              className="px-10 mb-20 shadow-[0_0_30px_rgba(212,168,83,0.15)]"
            >
              Get in Touch
            </Button>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

            <nav aria-label="Social links" className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-sm font-medium tracking-wide uppercase">
              <a
                href="#"
                className="text-text-muted hover:text-gold transition-colors flex items-center gap-2"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-gold transition-colors flex items-center gap-2"
              >
                <Instagram size={14} />
                Instagram
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-gold transition-colors flex items-center gap-2"
              >
                <TikTokIcon className="w-[14px] h-[14px]" />
                TikTok
              </a>
              <a
                href="https://portfolio.panjifirmansyah.com"
                className="text-text-muted hover:text-gold transition-colors flex items-center gap-2"
              >
                <ExternalLink size={14} className="opacity-70" />
                Portfolio
              </a>
            </nav>

            <p className="text-text-muted/50 text-sm font-sans">
              © {new Date().getFullYear()} Panji Firmansyah. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
