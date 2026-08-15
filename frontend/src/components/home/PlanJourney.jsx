import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const JOURNEY = [
  { n: "01", title: "Tell us your event", desc: "Share your occasion, date and city." },
  { n: "02", title: "Add your requirements", desc: "Pick the services you'll need." },
  { n: "03", title: "Explore suitable services", desc: "We surface vendors that fit your event." },
  { n: "04", title: "Choose your vendors", desc: "Compare, shortlist and select." },
  { n: "05", title: "Manage everything in one place", desc: "Track bookings and progress together." },
];

export default function PlanJourney() {
  const navigate = useNavigate();
  return (
    <section data-testid="plan-journey-section" className="relative overflow-hidden bg-royal-plum text-warm-ivory py-24 md:py-32 grain-overlay">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-marigold/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-5">Plan My Event</p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.02]">
              Planning Something <span className="italic text-marigold">Special?</span>
            </h2>
            <p className="mt-6 text-lg text-warm-ivory/75 max-w-md leading-relaxed">
              Tell us what you're celebrating. We'll help you organize everything, step by step.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/plan")}
                data-testid="journey-start-cta"
                className="group inline-flex items-center gap-2 rounded-full bg-marigold px-8 py-4 font-medium text-royal-plum hover:bg-saffron hover:text-warm-ivory transition-all shadow-[0_15px_35px_-12px_rgba(244,166,35,0.6)] hover:-translate-y-0.5"
              >
                Start Planning My Event
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => { const el = document.getElementById("how-it-works"); el?.scrollIntoView({ behavior: "smooth" }); }}
                data-testid="journey-how-it-works"
                className="rounded-full border border-warm-ivory/30 px-8 py-4 font-medium text-warm-ivory hover:bg-warm-ivory/10 transition-all"
              >
                How It Works →
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-marigold via-soft-gold/40 to-transparent" />
            <div className="space-y-3">
              {JOURNEY.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-6 rounded-2xl p-5 transition-colors hover:bg-warm-ivory/[0.06]"
                >
                  <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-marigold/40 bg-royal-plum font-serif text-xl text-marigold">
                    {s.n}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-serif text-2xl text-warm-ivory">{s.title}</h3>
                    <p className="mt-1 text-warm-ivory/65">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
