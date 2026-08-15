import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Check, ArrowLeft, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { getVendor, getAvailability, createBooking, rememberBooking } from "@/lib/api";
import { inr } from "@/lib/theme";
import { formatDate } from "@/lib/booking";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [unavailable, setUnavailable] = useState([]);
  const [pkgIdx, setPkgIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getVendor(id).then(setVendor).catch(() => {});
    getAvailability(id).then((d) => setUnavailable(d.unavailable_dates)).catch(() => {});
  }, [id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const unavailableSet = new Set(unavailable);
  const isUnavailable = (day) => {
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, "0");
    const d = String(day.getDate()).padStart(2, "0");
    return unavailableSet.has(`${y}-${m}-${d}`);
  };
  const toISO = (day) => {
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, "0");
    const d = String(day.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Please add your name and phone number");
    if (!selectedDate) return toast.error("Please pick an event date");
    setSending(true);
    try {
      const pkg = vendor.packages[pkgIdx];
      const booking = await createBooking({
        vendor_id: id,
        package_name: pkg.name,
        package_price: pkg.price,
        event_date: toISO(selectedDate),
        customer_name: form.name,
        customer_phone: form.phone,
        event_type: vendor.event_types?.[0] || "",
        notes: form.notes,
      });
      rememberBooking(booking.id);
      toast.success("Booking requested! Track its status anytime.");
      navigate(`/bookings/${booking.id}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
      toast.error(msg);
      if (err?.response?.status === 409) {
        getAvailability(id).then((d) => setUnavailable(d.unavailable_dates)).catch(() => {});
        setSelectedDate(undefined);
      }
    } finally {
      setSending(false);
    }
  };

  if (!vendor) {
    return (
      <div className="min-h-screen grid place-items-center pt-24">
        <div className="h-10 w-10 rounded-full border-2 border-royal-plum/20 border-t-royal-plum animate-spin" />
      </div>
    );
  }

  return (
    <main data-testid="vendor-profile-page" className="min-h-screen pt-28 md:pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Link to="/vendors" data-testid="back-to-vendors" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-royal-plum transition-colors mb-8">
          <ArrowLeft size={16} /> Back to vendors
        </Link>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-t-[4rem] rounded-b-3xl aspect-[16/10] lg:aspect-auto"
          >
            <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-royal-plum/60 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-warm-ivory">
              <span className="flex items-center gap-1.5 rounded-full bg-warm-ivory/95 px-4 py-1.5 text-royal-plum font-semibold">
                <Star size={16} className="fill-marigold text-marigold" /> {vendor.rating}
              </span>
              <span className="text-sm text-warm-ivory/80">{vendor.reviews} reviews</span>
            </div>
          </motion.div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-saffron font-medium mb-3">{vendor.category_name}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-royal-plum tracking-tight leading-none">{vendor.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-charcoal/60"><MapPin size={16} /> {vendor.city}</p>
            <p className="mt-5 text-lg text-charcoal/75 leading-relaxed">{vendor.tagline}</p>
            <div className="mt-6 rounded-2xl bg-[#FBEFDD]/60 border border-soft-gold/30 p-5">
              <p className="text-xs uppercase tracking-widest text-charcoal/45">Starting from</p>
              <p className="font-serif text-4xl text-deep-wine">₹{inr(vendor.starting_price)}</p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl text-royal-plum mb-6">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vendor.gallery.map((g, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 md:col-span-1 aspect-[4/3]" : "aspect-[4/3]"}`}>
                <img src={g} alt={`${vendor.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Packages + Booking */}
        <div className="mt-16 grid lg:grid-cols-[1.25fr_1fr] gap-10">
          <div>
            <h2 className="font-serif text-3xl text-royal-plum mb-6">Choose a package</h2>
            <div className="space-y-5">
              {vendor.packages.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  data-testid={`package-${i}`}
                  onClick={() => setPkgIdx(i)}
                  className={`w-full text-left rounded-3xl border p-7 transition-all ${pkgIdx === i ? "border-royal-plum bg-white shadow-[0_25px_45px_-30px_rgba(74,23,72,0.4)] ring-1 ring-royal-plum" : "border-soft-gold/30 bg-white hover:border-royal-plum/40"}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl text-royal-plum flex items-center gap-3">
                      <span className={`grid h-6 w-6 place-items-center rounded-full border ${pkgIdx === i ? "bg-marigold border-marigold text-royal-plum" : "border-charcoal/25 text-transparent"}`}><Check size={13} /></span>
                      {p.name}
                    </h3>
                    <p className="font-serif text-2xl text-deep-wine whitespace-nowrap">₹{inr(p.price)}</p>
                  </div>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2 pl-9">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal/70">
                        <Check size={16} className="text-leaf-green shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Booking form */}
          <div className="lg:sticky lg:top-28 h-fit">
            <form
              onSubmit={submit}
              data-testid="booking-form"
              className="rounded-3xl bg-royal-plum text-warm-ivory p-8 shadow-[0_30px_60px_-30px_rgba(74,23,72,0.7)] grain-overlay relative overflow-hidden"
            >
              <div className="relative">
                <h3 className="font-serif text-3xl">Book {vendor.name.split(" ")[0]}</h3>
                <p className="text-warm-ivory/70 text-sm mt-2 flex items-center gap-2">
                  <CalendarDays size={15} /> Pick an available date & confirm your details.
                </p>

                <div className="mt-5 rounded-2xl bg-warm-ivory p-2 flex justify-center">
                  <Calendar
                    mode="single"
                    data-testid="availability-calendar"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={[{ before: today }, isUnavailable]}
                    className="text-charcoal"
                  />
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-warm-ivory/60">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-marigold" /> Selected</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warm-ivory/25" /> Booked / unavailable</span>
                </div>

                {selectedDate && (
                  <p data-testid="selected-date" className="mt-4 rounded-xl bg-marigold/15 px-4 py-2.5 text-sm text-warm-ivory">
                    {vendor.packages[pkgIdx].name} · <span className="text-marigold font-medium">{formatDate(toISO(selectedDate))}</span> · ₹{inr(vendor.packages[pkgIdx].price)}
                  </p>
                )}

                <div className="mt-4 space-y-4">
                  <Input data-testid="booking-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl" />
                  <Input data-testid="booking-phone" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl" />
                  <Textarea data-testid="booking-notes" placeholder="Anything the vendor should know? (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl min-h-20" />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="booking-submit"
                  className="mt-6 w-full rounded-full bg-marigold py-4 font-medium text-royal-plum hover:bg-saffron hover:text-warm-ivory transition-all disabled:opacity-60"
                >
                  {sending ? "Requesting..." : "Request Booking"}
                </button>
                <Link to="/bookings" data-testid="view-my-bookings" className="mt-3 block text-center text-sm text-warm-ivory/70 hover:text-marigold transition-colors">
                  View my bookings →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
