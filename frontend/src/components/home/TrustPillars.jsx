import { motion } from "framer-motion";
import { BadgeCheck, Wallet, Heart, ClipboardList } from "lucide-react";

const PILLARS = [
  { icon: BadgeCheck, title: "Verified Profiles", desc: "Build trust through genuine vendor information." },
  { icon: Wallet, title: "Clear Packages", desc: "Know what each vendor offers before you choose." },
  { icon: Heart, title: "Save Your Favourites", desc: "Shortlist vendors and compare them later." },
  { icon: ClipboardList, title: "Keep Everything Organized", desc: "Manage your event and requirements in one place." },
];

export default function TrustPillars() {
  return (
    <section data-testid="trust-section" className="py-24 md:py-32 bg-[#FBEFDD]/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">Peace of mind</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
            Plan With Confidence
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-white border border-soft-gold/25 p-8 text-center shadow-[0_20px_40px_-30px_rgba(74,23,72,0.3)] hover:shadow-[0_28px_50px_-25px_rgba(74,23,72,0.35)] hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-soft-gold/40 text-saffron">
                <p.icon strokeWidth={1.25} size={32} />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-royal-plum leading-tight">{p.title}</h3>
              <p className="mt-3 text-sm text-charcoal/65 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
