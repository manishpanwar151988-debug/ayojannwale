import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { maskReveal } from "@/lib/theme";

const HERO_IMG = "https://images.unsplash.com/photo-1591203281954-23fa2ff8ef18?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const HERO_IMG2 = "https://images.unsplash.com/photo-1607512566084-a20ed291d623?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

const LINES = ["Every Celebration", "Deserves to", "Feel Special."];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      {/* soft ambient shapes */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-marigold/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-saffron mb-6"
        >
          India's warm way to plan celebrations
        </motion.p>

        <h1 className="font-serif text-royal-plum tracking-tighter leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-4xl">
          {LINES.map((line, i) => (
            <span key={i} className="mask-line">
              <motion.span variants={maskReveal} initial="hidden" animate="show" custom={i} className="inline-block">
                {i === 2 ? (
                  <>
                    Feel <span className="italic text-saffron">Special.</span>
                  </>
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
          className="mt-8 max-w-xl text-lg text-charcoal/70 leading-relaxed"
        >
          Find trusted vendors, compare options and plan every detail of your celebration — your way.
        </motion.p>

        {/* Two-path experience */}
        <div className="mt-14 grid md:grid-cols-2 gap-6 relative">
          <motion.div style={{ y: y1 }} className="pointer-events-none absolute -right-10 -top-28 hidden lg:block h-48 w-40 rounded-t-[999px] overflow-hidden opacity-90 rotate-6 shadow-2xl">
            <img src={HERO_IMG2} alt="marigold" className="h-full w-full object-cover" />
          </motion.div>

          {/* Find Vendors */}
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

          {/* Plan My Event */}
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
