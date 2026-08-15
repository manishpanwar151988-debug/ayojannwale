import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { inr } from "@/lib/theme";

export default function VendorCard({ vendor, index = 0 }) {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
      data-testid={`vendor-card-${vendor.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-soft-gold/25 shadow-[0_20px_40px_-25px_rgba(74,23,72,0.25)] hover:shadow-[0_30px_55px_-25px_rgba(74,23,72,0.4)] transition-all duration-500 hover:-translate-y-1.5"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-plum/40 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-warm-ivory/95 backdrop-blur px-3 py-1 text-sm font-semibold text-royal-plum shadow">
          <Star size={14} className="fill-marigold text-marigold" /> {vendor.rating}
        </div>
        <button
          data-testid={`vendor-save-${vendor.id}`}
          onClick={() => setSaved((v) => !v)}
          className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-warm-ivory/95 backdrop-blur text-royal-plum shadow hover:scale-110 transition-transform"
        >
          <Heart size={16} className={saved ? "fill-coral text-coral" : ""} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-2xl leading-tight text-royal-plum">{vendor.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal/60">
          {vendor.category_name}
          <span className="h-1 w-1 rounded-full bg-charcoal/30" />
          <MapPin size={13} /> {vendor.city}
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-charcoal/45">Starting from</p>
            <p className="font-serif text-2xl text-deep-wine">₹{inr(vendor.starting_price)}</p>
          </div>
          <Link
            to={`/vendors/${vendor.id}`}
            data-testid={`vendor-view-${vendor.id}`}
            className="rounded-full border border-royal-plum/25 px-5 py-2 text-sm font-medium text-royal-plum hover:bg-royal-plum hover:text-warm-ivory transition-all"
          >
            View Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
