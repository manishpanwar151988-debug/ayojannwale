import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEventTypes } from "@/lib/api";
import { themeFor as themeForFn } from "@/lib/theme";

export default function EventTypes() {
  const [events, setEvents] = useState([]);
  const [hovered, setHovered] = useState(null);
  const scroller = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getEventTypes().then(setEvents).catch(() => {});
  }, []);

  const scroll = (dir) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section data-testid="event-types-section" className="py-24 md:py-32 bg-gradient-to-b from-warm-ivory to-[#FBEFDD]/60">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">By occasion</p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
              What are you celebrating?
            </h2>
            <p className="mt-5 text-lg text-charcoal/65">Every event has its own story. Start with yours.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={() => scroll(-1)} data-testid="events-prev" className="grid h-12 w-12 place-items-center rounded-full border border-royal-plum/20 text-royal-plum hover:bg-royal-plum hover:text-warm-ivory transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll(1)} data-testid="events-next" className="grid h-12 w-12 place-items-center rounded-full border border-royal-plum/20 text-royal-plum hover:bg-royal-plum hover:text-warm-ivory transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div ref={scroller} className="no-scrollbar flex gap-5 overflow-x-auto px-5 md:px-8 pb-4 snap-x">
        <div className="shrink-0 w-[max(0px,calc((100vw-80rem)/2))]" />
        {events.map((e, i) => {
          const t = themeForFn(e.theme);
          const active = hovered === e.slug;
          return (
            <motion.button
              key={e.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              onMouseEnter={() => setHovered(e.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/vendors?event=${e.slug}`)}
              data-testid={`event-type-${e.slug}`}
              className="group relative shrink-0 w-64 snap-start overflow-hidden rounded-3xl text-left"
              style={{ boxShadow: active ? `0 25px 45px -25px ${t.accent}` : "0 15px 30px -25px rgba(74,23,72,0.3)" }}
            >
              <div className="relative h-80 overflow-hidden rounded-3xl">
                <img src={e.image} alt={e.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110" />
                <div className="absolute inset-0 transition-colors duration-500" style={{ background: `linear-gradient(to top, ${t.text}E6, transparent 70%)` }} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-2 inline-block h-1 w-10 rounded-full transition-all duration-500 group-hover:w-16" style={{ background: t.accent }} />
                  <h3 className="font-serif text-2xl text-warm-ivory">{e.name}</h3>
                  <p className="text-sm text-warm-ivory/75 mt-1">{e.tagline}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
        <div className="shrink-0 w-4" />
      </div>
    </section>
  );
}
