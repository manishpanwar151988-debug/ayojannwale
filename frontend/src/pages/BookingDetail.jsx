import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CalendarDays, Check, X, Phone } from "lucide-react";
import { toast } from "sonner";
import { getBooking, updateBookingStatus } from "@/lib/api";
import { inr } from "@/lib/theme";
import { STATUS_FLOW, STATUS_META, formatDate, isActive } from "@/lib/booking";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => getBooking(id).then(setBooking).catch(() => setBooking(false));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const cancel = async () => {
    setBusy(true);
    try {
      const updated = await updateBookingStatus(id, { status: "cancelled", note: "Cancelled by customer" });
      setBooking(updated);
      toast.success("Booking cancelled");
    } catch {
      toast.error("Could not cancel. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (booking === false) {
    return (
      <main className="min-h-screen pt-32 pb-24 grid place-items-center text-center px-5">
        <div>
          <h1 className="font-serif text-4xl text-royal-plum">Booking not found</h1>
          <Link to="/bookings" className="mt-6 inline-block rounded-full bg-royal-plum px-8 py-3 text-warm-ivory">My Bookings</Link>
        </div>
      </main>
    );
  }
  if (!booking) {
    return (
      <div className="min-h-screen grid place-items-center pt-24">
        <div className="h-10 w-10 rounded-full border-2 border-royal-plum/20 border-t-royal-plum animate-spin" />
      </div>
    );
  }

  const cancelled = booking.status === "cancelled";
  const currentIdx = STATUS_FLOW.indexOf(booking.status);
  const meta = STATUS_META[booking.status];

  return (
    <main data-testid="booking-detail-page" className="min-h-screen pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Link to="/bookings" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-royal-plum transition-colors mb-8">
          <ArrowLeft size={16} /> My bookings
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Booking {booking.ref}</span>
          <span data-testid="booking-status-badge" className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
        </div>

        {/* Vendor summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-soft-gold/30 overflow-hidden shadow-[0_25px_50px_-35px_rgba(74,23,72,0.4)]"
        >
          <div className="grid sm:grid-cols-[240px_1fr]">
            <div className="h-48 sm:h-full overflow-hidden">
              <img src={booking.vendor_image} alt={booking.vendor_name} className="h-full w-full object-cover" />
            </div>
            <div className="p-7">
              <p className="text-xs uppercase tracking-widest text-saffron">{booking.category_name}</p>
              <Link to={`/vendors/${booking.vendor_id}`} className="font-serif text-3xl text-royal-plum hover:text-saffron transition-colors">{booking.vendor_name}</Link>
              <p className="mt-2 flex items-center gap-2 text-sm text-charcoal/60"><MapPin size={14} /> {booking.city}</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-charcoal/45">Event date</p>
                  <p className="font-medium text-royal-plum flex items-center gap-1.5"><CalendarDays size={15} /> {formatDate(booking.event_date)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-charcoal/45">Package</p>
                  <p className="font-medium text-royal-plum">{booking.package_name} · ₹{inr(booking.package_price)}</p>
                </div>
              </div>
              {booking.notes && <p className="mt-4 text-sm text-charcoal/60 italic">"{booking.notes}"</p>}
            </div>
          </div>
        </motion.div>

        {/* Status tracker */}
        <div className="mt-10">
          <h2 className="font-serif text-3xl text-royal-plum mb-6">Status tracking</h2>
          {cancelled ? (
            <div className="rounded-2xl border border-coral/30 bg-coral/5 p-6 flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-coral/15 text-coral"><X size={20} /></span>
              <div>
                <p className="font-medium text-royal-plum">This booking was cancelled</p>
                <p className="text-sm text-charcoal/60">The date has been released and is available again.</p>
              </div>
            </div>
          ) : (
            <div className="relative pl-2">
              <div className="absolute left-[27px] top-3 bottom-3 w-px bg-soft-gold/40" />
              <div className="space-y-2">
                {STATUS_FLOW.map((s, i) => {
                  const m = STATUS_META[s];
                  const done = i <= currentIdx;
                  const current = i === currentIdx;
                  const hist = booking.status_history.find((h) => h.status === s);
                  return (
                    <div key={s} data-testid={`timeline-${s}`} className={`relative flex gap-5 rounded-2xl p-4 transition-colors ${current ? "bg-[#FBEFDD]/70" : ""}`}>
                      <span
                        className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 transition-all"
                        style={{
                          borderColor: done ? m.color : "rgba(36,30,28,0.15)",
                          background: done ? m.color : "#fff",
                          color: done ? "#fff" : "rgba(36,30,28,0.3)",
                        }}
                      >
                        {done ? <Check size={20} /> : <span className="font-serif">{i + 1}</span>}
                      </span>
                      <div className="pt-1.5">
                        <p className={`font-serif text-xl ${done ? "text-royal-plum" : "text-charcoal/40"}`}>{m.label}</p>
                        <p className="text-sm text-charcoal/55">{hist?.note || m.desc}</p>
                        {hist && <p className="text-xs text-charcoal/35 mt-0.5">{new Date(hist.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isActive(booking.status) && (
            <button
              data-testid="cancel-booking"
              onClick={cancel}
              disabled={busy}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-coral/40 px-7 py-3 text-coral font-medium hover:bg-coral hover:text-white transition-all disabled:opacity-60"
            >
              <X size={16} /> {busy ? "Cancelling..." : "Cancel booking"}
            </button>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-royal-plum/5 border border-royal-plum/10 p-5 flex items-center gap-3 text-sm text-charcoal/70">
          <Phone size={16} className="text-royal-plum" />
          Booked under <span className="font-medium text-royal-plum">{booking.customer_name}</span> · {booking.customer_phone}
        </div>
      </div>
    </main>
  );
}
