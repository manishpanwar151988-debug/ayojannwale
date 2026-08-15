import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { getVendors, getCities } from "@/lib/api";
import VendorCard from "@/components/VendorCard";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function FeaturedVendors() {
  const [vendors, setVendors] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("Jodhpur");
  const navigate = useNavigate();

  useEffect(() => {
    getCities().then((c) => setCities(c.sort())).catch(() => {});
  }, []);

  useEffect(() => {
    getVendors({ city }).then((v) => setVendors(v.slice(0, 6))).catch(() => {});
  }, [city]);

  return (
    <section data-testid="featured-vendors-section" className="py-24 md:py-32 bg-[#FBEFDD]/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-4">Featured</p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">
              Popular Vendors Near You
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-soft-gold/40 bg-white px-5 py-2.5 shadow-sm">
            <MapPin size={18} className="text-saffron" />
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger data-testid="location-selector" className="border-0 shadow-none h-auto p-0 font-medium text-royal-plum focus:ring-0 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c} data-testid={`city-option-${c}`}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((v, i) => (
            <VendorCard key={v.id} vendor={v} index={i} />
          ))}
          {vendors.length === 0 && (
            <p className="col-span-full text-charcoal/50">No vendors found in {city}. Try another city.</p>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onClick={() => navigate("/vendors")}
          data-testid="featured-view-all"
          className="group mt-14 inline-flex items-center gap-2 rounded-full border border-royal-plum/30 px-8 py-4 text-royal-plum font-medium hover:bg-royal-plum hover:text-warm-ivory transition-all"
        >
          View All Vendors
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
        </motion.button>
      </div>
    </section>
  );
}
