import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Scale, Heart, ArrowRight } from "lucide-react";

const STEPS = [
  { n: "01", icon: Search, title: "Explore", desc: "Browse vendors by category, city and event type." },
  { n: "02", icon: Scale, title: "Compare", desc: "Compare profiles, services, pricing and packages." },
  { n: "03", icon: Heart, title: "Choose", desc: "Shortlist the vendors you like and send your request." },
];

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <section id="how-it-works" data-testid="how-it-works-section" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">The marketplace way</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
            Find the Right Vendor, Your Way
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-10"
            >
              <span className="pointer-events-none absolute -top-6 left-0 font-serif text-[9rem] leading-none text-charcoal/[0.05] select-none">
                {s.n}
              </span>
              <div className="relative">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-royal-plum text-marigold">
                  <s.icon strokeWidth={1.5} size={28} />
                </div>
                <h3 className="mt-7 font-serif text-3xl text-royal-plum">{s.title}</h3>
                <p className="mt-3 text-charcoal/70 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => navigate("/vendors")}
          data-testid="how-explore-all"
          className="group mt-14 inline-flex items-center gap-2 rounded-full bg-royal-plum px-8 py-4 text-warm-ivory font-medium hover:bg-deep-wine transition-all shadow-[0_15px_30px_-12px_rgba(74,23,72,0.6)] hover:-translate-y-0.5"
        >
          Explore All Vendors
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>
    </section>
  );
}
