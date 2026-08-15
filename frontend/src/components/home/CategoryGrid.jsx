import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/api";

export default function CategoryGrid() {
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCats).catch(() => {});
  }, []);

  return (
    <section data-testid="category-section" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">Browse by service</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
            What are you looking for?
          </h2>
          <p className="mt-5 text-lg text-charcoal/65">Explore services for every celebration.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {cats.map((c, i) => (
            <motion.button
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(`/vendors?category=${c.slug}`)}
              data-testid={`category-tile-${c.slug}`}
              className={`group relative overflow-hidden rounded-t-[2.5rem] rounded-b-2xl ${
                i % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[4/5]"
              } text-left`}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-plum/90 via-royal-plum/25 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl text-warm-ivory leading-tight">{c.name}</h3>
                    <p className="text-xs text-warm-ivory/70 mt-0.5">{c.vendor_count} vendors</p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-warm-ivory/90 text-royal-plum opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
          <button
            onClick={() => navigate("/vendors")}
            data-testid="category-view-all"
            className="group flex flex-col items-center justify-center rounded-t-[2.5rem] rounded-b-2xl border-2 border-dashed border-soft-gold/50 aspect-[4/5] text-royal-plum hover:bg-royal-plum hover:text-warm-ivory transition-all"
          >
            <span className="font-serif text-2xl">View All</span>
            <ArrowUpRight className="mt-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
