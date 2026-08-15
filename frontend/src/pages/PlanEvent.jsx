import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { getEventTypes, getCategories, createEvent } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STEPS = ["Your Event", "Requirements", "Review"];

export default function PlanEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState([]);
  const [cats, setCats] = useState([]);
  const [created, setCreated] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "", event_type: "", date: "", city: "", guest_count: "", budget: "",
  });
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getEventTypes().then(setEvents).catch(() => {});
    getCategories().then(setCats).catch(() => {});
  }, []);

  const toggleCat = (c) => {
    setSelected((prev) =>
      prev.find((x) => x.slug === c.slug)
        ? prev.filter((x) => x.slug !== c.slug)
        : [...prev, { slug: c.slug, name: c.name }]
    );
  };

  const next = () => {
    if (step === 0 && (!form.name || !form.event_type)) {
      toast.error("Please name your event and pick an occasion");
      return;
    }
    if (step === 1 && selected.length === 0) {
      toast.error("Select at least one requirement");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: selected.map((s) => ({ category_slug: s.slug, category_name: s.name, notes: "" })),
      };
      const res = await createEvent(payload);
      setCreated(res);
      toast.success("Your event is ready!");
    } catch {
      toast.error("Could not create event. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const eventName = events.find((e) => e.slug === form.event_type)?.name;
  const progress = ((step + 1) / STEPS.length) * 100;

  if (created) {
    return (
      <main data-testid="plan-success" className="min-h-screen pt-32 pb-24 grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-lg text-center px-5"
        >
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-marigold/20 text-saffron">
            <PartyPopper size={36} strokeWidth={1.5} />
          </div>
          <h1 className="mt-8 font-serif text-4xl md:text-5xl text-royal-plum tracking-tight">
            "{created.name}" is planned!
          </h1>
          <p className="mt-4 text-charcoal/70">
            We've saved your {selected.length} requirement{selected.length !== 1 ? "s" : ""}. Explore matching vendors and start choosing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate(`/vendors?event=${form.event_type}`)}
              data-testid="success-explore-vendors"
              className="inline-flex items-center gap-2 rounded-full bg-royal-plum px-8 py-4 text-warm-ivory font-medium hover:bg-deep-wine transition-all"
            >
              Explore Vendors <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-royal-plum/25 px-8 py-4 text-royal-plum font-medium hover:bg-royal-plum/5 transition-all"
            >
              Back Home
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main data-testid="plan-event-page" className="min-h-screen pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-marigold font-medium mb-3 inline-flex items-center gap-2 justify-center">
            <Sparkles size={14} /> Plan My Event
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-royal-plum tracking-tight">
            Let's organize your celebration
          </h1>
        </div>

        {/* Progress / tracing beam */}
        <div className="mb-12">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-sm font-medium transition-colors ${i <= step ? "text-royal-plum" : "text-charcoal/35"}`}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-soft-gold/20 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-marigold to-saffron" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-5">
              <Field label="What are you calling this event?">
                <Input data-testid="event-name" placeholder="e.g. Riya's Wedding" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border-soft-gold/40 bg-white h-12" />
              </Field>
              <Field label="What are you celebrating?">
                <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                  <SelectTrigger data-testid="event-type-select" className="rounded-xl border-soft-gold/40 bg-white h-12"><SelectValue placeholder="Choose occasion" /></SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (<SelectItem key={e.slug} value={e.slug}>{e.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Date (optional)">
                  <Input data-testid="event-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl border-soft-gold/40 bg-white h-12" />
                </Field>
                <Field label="City (optional)">
                  <Input data-testid="event-city" placeholder="e.g. Jodhpur" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border-soft-gold/40 bg-white h-12" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Guests (optional)">
                  <Input data-testid="event-guests" placeholder="e.g. 250" value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: e.target.value })} className="rounded-xl border-soft-gold/40 bg-white h-12" />
                </Field>
                <Field label="Budget (optional)">
                  <Input data-testid="event-budget" placeholder="e.g. ₹5,00,000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="rounded-xl border-soft-gold/40 bg-white h-12" />
                </Field>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
              <p className="text-charcoal/70 mb-6">What do you need for {eventName || "your event"}? Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cats.map((c) => {
                  const on = selected.find((x) => x.slug === c.slug);
                  return (
                    <button
                      key={c.slug}
                      data-testid={`req-${c.slug}`}
                      onClick={() => toggleCat(c)}
                      className={`relative rounded-2xl border p-4 text-left transition-all ${on ? "border-royal-plum bg-royal-plum text-warm-ivory shadow-lg" : "border-soft-gold/40 bg-white text-royal-plum hover:border-royal-plum/40"}`}
                    >
                      <span className="font-serif text-lg leading-tight block pr-6">{c.name}</span>
                      <span className={`absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full transition-all ${on ? "bg-marigold text-royal-plum" : "bg-soft-gold/15 text-transparent"}`}>
                        <Check size={14} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-6">
              <div className="rounded-3xl bg-white border border-soft-gold/30 p-7">
                <h3 className="font-serif text-2xl text-royal-plum">{form.name}</h3>
                <p className="text-saffron text-sm font-medium mt-1">{eventName}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  {form.date && <Detail label="Date" value={form.date} />}
                  {form.city && <Detail label="City" value={form.city} />}
                  {form.guest_count && <Detail label="Guests" value={form.guest_count} />}
                  {form.budget && <Detail label="Budget" value={form.budget} />}
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-charcoal/45 mb-2">Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.map((s) => (
                      <span key={s.slug} className="rounded-full bg-marigold/15 text-royal-plum px-3 py-1 text-sm">{s.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            data-testid="wizard-back"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-royal-plum transition-colors disabled:opacity-0"
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} data-testid="wizard-next" className="group inline-flex items-center gap-2 rounded-full bg-royal-plum px-8 py-4 text-warm-ivory font-medium hover:bg-deep-wine transition-all shadow-[0_15px_30px_-12px_rgba(74,23,72,0.6)]">
              Continue <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button onClick={submit} disabled={saving} data-testid="wizard-submit" className="inline-flex items-center gap-2 rounded-full bg-marigold px-8 py-4 text-royal-plum font-medium hover:bg-saffron hover:text-warm-ivory transition-all disabled:opacity-60">
              {saving ? "Creating..." : "Create My Event"} <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal/70 mb-2">{label}</label>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-widest text-charcoal/45">{label}</p>
    <p className="text-royal-plum font-medium">{value}</p>
  </div>
);
