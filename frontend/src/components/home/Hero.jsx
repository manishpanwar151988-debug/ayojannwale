import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { maskReveal } from "@/lib/theme";

const SLIDES = [
  { img: "https://images.unsplash.com/photo-1665960213508-48f07086d49c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Weddings", accent: "#D8A84E" },
  { img: "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Haldi & Mehndi", accent: "#F4A623" },
  { img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Birthdays", accent: "#E85D5D" },
  { img: "https://images.unsplash.com/photo-1684868265714-fd2300637c23?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Bridal Glam", accent: "#E85D5D" },
  { img: "https://images.unsplash.com/photo-1577083753695-e010191bacb5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Pujas & Rituals", accent: "#E87817" },
  { img: "https://images.unsplash.com/photo-1712314947761-a8d718bd8c32?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", label: "Grand Venues", accent: "#D8A84E" },
];

const LINES = ["Every Celebration", "Deserves to", "Feel Special."];

export default function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[idx];

  return (
    <section data-testid="hero-section" className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-marigold/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Headline + Slideshow */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-saffron mb-6"
            >
              India's warm way to plan celebrations
            </motion.p>

            <h1 className="font-serif text-royal-plum tracking-tighter leading-[0.95] text-5xl sm:text-6xl md:text-7xl">
              {LINES.map((line, i) => (
                <span key={i} className="mask-line">
                  <motion.span variants={maskReveal} initial="hidden" animate="show" custom={i} className="inline-block">
                    {i === 2 ? (
                      <>Feel <span className="italic text-saffron">Special.</span></>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-8 max-w-lg text-lg text-charcoal/70 leading-relaxed"
            >
              Find trusted vendors, compare options and plan every detail of your celebration — your way.
            </motion.p>
          </div>

          {/* Auto-rotating event slideshow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-t-[12rem] rounded-b-[2.5rem] border border-soft-gold/30" />
            <div className="relative h-[440px] md:h-[540px] overflow-hidden rounded-t-[11rem] rounded-b-[2rem] shadow-[0_40px_80px_-35px_rgba(74,23,72,0.55)]">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={idx}
                  src={slide.img}
                  alt={slide.label}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-royal-plum/70 via-royal-plum/5 to-transparent" />

              {/* caption */}
              <div className="absolute inset-x-0 bottom-0 p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: slide.accent }} />
                    <span className="font-serif text-3xl text-warm-ivory italic">{slide.label}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  data-testid={`hero-slide-dot-${i}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Show ${s.label}`}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === idx ? 28 : 8,
                    background: i === idx ? "#4A1748" : "rgba(74,23,72,0.25)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Two-path experience */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/vendors"
              data-testid="hero-find-vendors"
              className="group relative block h-full overflow-hidden rounded-[2rem] border border-soft-gold/30 bg-white p-9 shadow-[0_25px_50px_-30px_rgba(74,23,72,0.35)] transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-marigold/15 text-saffron">
                <Search strokeWidth={1.5} size={26} />
              </div>
              <h2 className="mt-7 font-serif text-3xl text-royal-plum">Find Vendors</h2>
              <p className="mt-1 text-sm font-medium text-charcoal/50">Know what you need?</p>
              <p className="mt-4 text-charcoal/70 leading-relaxed max-w-xs">
                Explore photographers, decorators, caterers, makeup artists, DJs and more.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 font-medium text-royal-plum">
                Explore Vendors
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/plan"
              data-testid="hero-plan-event"
              className="group relative block h-full overflow-hidden rounded-[2rem] bg-royal-plum p-9 text-warm-ivory shadow-[0_30px_60px_-25px_rgba(74,23,72,0.7)] transition-all duration-500 hover:-translate-y-1.5 grain-overlay"
            >
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-marigold/20 blur-2xl" />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-marigold/20 text-marigold">
                  <Sparkles strokeWidth={1.5} size={26} />
                </div>
                <h2 className="mt-7 font-serif text-3xl">Plan My Event</h2>
                <p className="mt-1 text-sm font-medium text-warm-ivory/55">Not sure where to begin?</p>
                <p className="mt-4 text-warm-ivory/80 leading-relaxed max-w-xs">
                  Tell us about your celebration and start planning everything in one place.
                </p>
                <span className="mt-7 inline-flex items-center gap-2 font-medium text-marigold">
                  Start Planning
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
