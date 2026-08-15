import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search, Ticket } from "lucide-react";
import { listBookings, getRememberedBookings } from "@/lib/api";
import { inr } from "@/lib/theme";
import { STATUS_META, formatDate } from "@/lib/booking";
import { Input } from "@/components/ui/input";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");

  const loadLocal = () => {
    const ids = getRememberedBookings();
    if (!ids.length) { setBookings([]); setLoading(false); return; }
    listBookings({ ids: ids.join(",") })
      .then((d) => setBookings(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLocal(); }, []);

  const searchPhone = (e) => {
    e.preventDefault();
    if (!phone) return loadLocal();
    setLoading(true);
    listBookings({ phone }).then(setBookings).catch(() => {}).finally(() => setLoading(false));
  };

  return (
    <main data-testid="my-bookings-page" className="min-h-screen pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-3">Your bookings</p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-royal-plum leading-none">My Bookings</h1>
        <p className="mt-4 text-charcoal/65 max-w-lg">Track every vendor you've booked, from request to celebration day.</p>

        <form onSubmit={searchPhone} className="mt-8 flex gap-3 max-w-md">
          <Input
            data-testid="phone-lookup"
            placeholder="Find bookings by phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-full border-soft-gold/40 bg-white"
          />
          <button data-testid="phone-lookup-btn" className="rounded-full bg-royal-plum px-6 text-warm-ivory font-medium hover:bg-deep-wine transition-all inline-flex items-center gap-2">
            <Search size={16} /> Find
          </button>
        </form>

        <div className="mt-10">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {[...Array(2)].map((_, i) => <div key={i} className="h-40 rounded-3xl bg-white/60 border border-soft-gold/20 animate-pulse" />)}
            </div>
          ) : bookings.length ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {bookings.map((b, i) => {
                const m = STATUS_META[b.status];
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                  >
                    <Link
                      to={`/bookings/${b.id}`}
                      data-testid={`booking-card-${b.id}`}
                      className="group flex gap-4 rounded-3xl bg-white border border-soft-gold/25 p-4 shadow-[0_20px_40px_-30px_rgba(74,23,72,0.3)] hover:shadow-[0_28px_50px_-25px_rgba(74,23,72,0.4)] hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                        <img src={b.vendor_image} alt={b.vendor_name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-charcoal/40">{b.ref}</span>
                          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: m.bg, color: m.color }}>{m.label}</span>
                        </div>
                        <h3 className="font-serif text-xl text-royal-plum leading-tight mt-1 truncate">{b.vendor_name}</h3>
                        <p className="text-xs text-charcoal/55 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {b.city} · {b.category_name}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-royal-plum flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(b.event_date)}</span>
                          <span className="font-serif text-lg text-deep-wine">₹{inr(b.package_price)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-soft-gold/50 py-20 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-marigold/15 text-saffron"><Ticket size={28} strokeWidth={1.5} /></span>
              <p className="mt-6 font-serif text-3xl text-royal-plum">No bookings yet</p>
              <p className="mt-2 text-charcoal/60">Explore vendors and request your first booking.</p>
              <Link to="/vendors" data-testid="empty-explore" className="mt-6 inline-block rounded-full bg-royal-plum px-8 py-3.5 text-warm-ivory font-medium hover:bg-deep-wine transition-all">
                Explore Vendors
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
