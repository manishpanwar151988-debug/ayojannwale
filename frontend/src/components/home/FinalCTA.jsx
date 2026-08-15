import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section data-testid="final-cta-section" className="relative overflow-hidden py-28 md:py-40 bg-gradient-to-b from-warm-ivory via-[#FDECCF] to-[#F9DFB0]">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-marigold/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-coral/15 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-5 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-saffron font-medium mb-6"
        >
          Your celebration begins here
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-royal-plum leading-[0.95]"
        >
          Ready to Start <span className="italic text-saffron">Planning?</span>
        </motion.h2>
        <p className="mt-7 text-lg text-charcoal/70 max-w-xl mx-auto">
          Whether you know exactly what you need or are just getting started, your celebration begins here.
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/vendors")}
            data-testid="final-find-vendors"
            className="group inline-flex items-center gap-2.5 rounded-full bg-royal-plum px-9 py-4.5 py-4 text-warm-ivory font-medium hover:bg-deep-wine transition-all shadow-[0_20px_40px_-15px_rgba(74,23,72,0.6)] hover:-translate-y-1"
          >
            <Search size={18} /> Find Vendors
          </button>
          <button
            onClick={() => navigate("/plan")}
            data-testid="final-plan-event"
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-royal-plum px-9 py-4 text-royal-plum font-medium hover:bg-royal-plum hover:text-warm-ivory transition-all hover:-translate-y-1"
          >
            <Sparkles size={18} /> Plan My Event
          </button>
        </div>
      </div>
    </section>
  );
}
