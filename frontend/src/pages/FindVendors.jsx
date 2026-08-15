import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { getVendors, getCategories, getEventTypes, getCities } from "@/lib/api";
import VendorCard from "@/components/VendorCard";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const HERO = "https://images.unsplash.com/photo-1607512566084-a20ed291d623?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

export default function FindVendors() {
  const [params, setParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [cats, setCats] = useState([]);
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const category = params.get("category") || "";
  const event = params.get("event") || "";
  const city = params.get("city") || "";

  useEffect(() => {
    getCategories().then(setCats).catch(() => {});
    getEventTypes().then(setEvents).catch(() => {});
    getCities().then((c) => setCities(c.sort())).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getVendors({
      category: category || undefined,
      event_type: event || undefined,
      city: city || undefined,
      q: q || undefined,
    })
      .then(setVendors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, event, city, q]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next);
  };

  const activeCatName = useMemo(
    () => cats.find((c) => c.slug === category)?.name,
    [cats, category]
  );
  const activeEventName = useMemo(
    () => events.find((e) => e.slug === event)?.name,
    [events, event]
  );

  const hasFilters = category || event || city || q;

  return (
    <main data-testid="find-vendors-page" className="min-h-screen">
      {/* compact banner */}
      <div className="relative pt-28 pb-14 md:pt-36 md:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-royal-plum/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 text-warm-ivory">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-3">Marketplace</p>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-none">
            {activeEventName ? `Vendors for your ${activeEventName}` : activeCatName || "Explore Vendors"}
          </h1>
          <p className="mt-4 text-warm-ivory/75 max-w-lg">
            Explore services for every celebration. Filter by category, occasion and city.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center mb-10">
          <div className="flex items-center gap-2 text-royal-plum font-medium">
            <SlidersHorizontal size={18} /> Filters
          </div>
          <div className="flex flex-wrap gap-3 flex-1">
            <Input
              data-testid="vendor-search"
              placeholder="Search vendors..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-[220px] rounded-full border-soft-gold/40 bg-white"
            />
            <Select value={category || "all"} onValueChange={(v) => setParam("category", v === "all" ? "" : v)}>
              <SelectTrigger data-testid="filter-category" className="w-[170px] rounded-full border-soft-gold/40 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {cats.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={event || "all"} onValueChange={(v) => setParam("event", v === "all" ? "" : v)}>
              <SelectTrigger data-testid="filter-event" className="w-[170px] rounded-full border-soft-gold/40 bg-white">
                <SelectValue placeholder="Occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All occasions</SelectItem>
                {events.map((e) => (
                  <SelectItem key={e.slug} value={e.slug}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city || "all"} onValueChange={(v) => setParam("city", v === "all" ? "" : v)}>
              <SelectTrigger data-testid="filter-city" className="w-[150px] rounded-full border-soft-gold/40 bg-white">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <button
                data-testid="clear-filters"
                onClick={() => { setParams(new URLSearchParams()); setQ(""); }}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm text-coral hover:bg-coral/10 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
          <p data-testid="vendor-count" className="text-sm text-charcoal/55 whitespace-nowrap">
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-white/60 animate-pulse border border-soft-gold/20" />
            ))}
          </div>
        ) : vendors.length ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((v, i) => (
              <VendorCard key={v.id} vendor={v} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl text-royal-plum">No vendors found</p>
            <p className="mt-2 text-charcoal/60">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}
