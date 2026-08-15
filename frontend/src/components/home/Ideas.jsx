import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getIdeas } from "@/lib/api";

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  useEffect(() => {
    getIdeas().then(setIdeas).catch(() => {});
  }, []);

  return (
    <section id="ideas" data-testid="ideas-section" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">Inspiration</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
            Ideas for Your Next Celebration
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ideas.map((it, i) => (
            <motion.a
              key={it.slug}
              href="#ideas"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`idea-card-${it.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5]">
                <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-warm-ivory/90 px-3 py-1 text-xs font-medium text-royal-plum">{it.category}</span>
                <span className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-marigold text-royal-plum opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-royal-plum leading-tight group-hover:text-saffron transition-colors">{it.title}</h3>
              <p className="mt-2 text-sm text-charcoal/60 leading-relaxed">{it.excerpt}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-charcoal/40">{it.read}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
