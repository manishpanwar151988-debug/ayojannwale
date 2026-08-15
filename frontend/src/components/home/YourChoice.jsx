import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Scale, LayoutList } from "lucide-react";

const POINTS = [
  { icon: Compass, title: "Browse yourself", desc: "Explore vendors and choose exactly who you want." },
  { icon: Scale, title: "Compare options", desc: "Review services, packages and prices before deciding." },
  { icon: LayoutList, title: "Plan everything together", desc: "Create your event and gradually organize all your requirements." },
];

const IMG = "https://images.unsplash.com/photo-1684868682581-4cac3af5b8d4?crop=entropy&cs=srgb&fm=jpg&q=85&w=900";

export default function YourChoice() {
  const navigate = useNavigate();
  return (
    <section data-testid="your-choice-section" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-t-[9rem] rounded-b-3xl aspect-[4/5] shadow-[0_40px_80px_-40px_rgba(74,23,72,0.5)]">
            <img src={IMG} alt="Celebration planning" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-4 md:-right-8 rounded-2xl bg-warm-ivory border border-soft-gold/40 px-6 py-4 shadow-xl">
            <p className="font-serif text-3xl text-royal-plum leading-none">100%</p>
            <p className="text-xs text-charcoal/60 mt-1">in your control</p>
          </div>
        </motion.div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">Your event, your rules</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
            Your Event.<br /><span className="italic text-saffron">Your Choice.</span>
          </h2>
          <div className="mt-10 space-y-6">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marigold/15 text-saffron">
                  <p.icon strokeWidth={1.5} size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-royal-plum">{p.title}</h3>
                  <p className="text-charcoal/70 mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => navigate("/vendors")}
            data-testid="choice-explore-cta"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-royal-plum px-8 py-4 text-warm-ivory font-medium hover:bg-deep-wine transition-all shadow-[0_15px_30px_-12px_rgba(74,23,72,0.6)] hover:-translate-y-0.5"
          >
            Start Exploring
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
