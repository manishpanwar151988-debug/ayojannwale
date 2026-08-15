import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Check, ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { getVendor, createLead } from "@/lib/api";
import { inr } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VendorProfile() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getVendor(id).then(setVendor).catch(() => {});
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please add your name and phone number");
      return;
    }
    setSending(true);
    try {
      await createLead({ vendor_id: id, ...form });
      toast.success("Request sent! The vendor will reach out to you shortly.");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
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

        {/* Header */}
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
            <p className="mt-4 flex items-center gap-2 text-charcoal/60">
              <MapPin size={16} /> {vendor.city}
            </p>
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

        {/* Packages + Enquiry */}
        <div className="mt-16 grid lg:grid-cols-[1.3fr_1fr] gap-10">
          <div>
            <h2 className="font-serif text-3xl text-royal-plum mb-6">Packages</h2>
            <div className="space-y-5">
              {vendor.packages.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-3xl bg-white border border-soft-gold/30 p-7 shadow-[0_20px_40px_-30px_rgba(74,23,72,0.3)]"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl text-royal-plum">{p.name}</h3>
                    <p className="font-serif text-2xl text-deep-wine whitespace-nowrap">₹{inr(p.price)}</p>
                  </div>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal/70">
                        <Check size={16} className="text-leaf-green shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enquiry form */}
          <div className="lg:sticky lg:top-28 h-fit">
            <form
              onSubmit={submit}
              data-testid="enquiry-form"
              className="rounded-3xl bg-royal-plum text-warm-ivory p-8 shadow-[0_30px_60px_-30px_rgba(74,23,72,0.7)] grain-overlay relative overflow-hidden"
            >
              <div className="relative">
                <h3 className="font-serif text-3xl">Send a request</h3>
                <p className="text-warm-ivory/70 text-sm mt-2">Share your details and {vendor.name} will get in touch.</p>
                <div className="mt-6 space-y-4">
                  <Input data-testid="enquiry-name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl" />
                  <Input data-testid="enquiry-phone" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl" />
                  <Textarea data-testid="enquiry-message" placeholder="Tell them about your event (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-warm-ivory/10 border-warm-ivory/25 text-warm-ivory placeholder:text-warm-ivory/50 rounded-xl min-h-24" />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="enquiry-submit"
                  className="mt-6 w-full rounded-full bg-marigold py-4 font-medium text-royal-plum hover:bg-saffron hover:text-warm-ivory transition-all disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Request"}
                </button>
                <button type="button" className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full border border-warm-ivory/25 py-3 text-sm text-warm-ivory/85 hover:bg-warm-ivory/10 transition-colors">
                  <Heart size={16} /> Save to shortlist
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
