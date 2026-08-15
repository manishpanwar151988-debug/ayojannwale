import { Link } from "react-router-dom";
import { Logo } from "@/components/Header";

const COLS = [
  { title: "Explore", links: ["Find Vendors", "Categories", "Event Types", "Plan My Event", "My Bookings"] },
  { title: "Company", links: ["About Us", "How It Works", "Contact"] },
  { title: "For Vendors", links: ["Join as a Vendor", "Vendor Login"] },
  { title: "Support", links: ["Help Centre", "Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative bg-charcoal text-warm-ivory/80 pt-24 pb-32 lg:pb-24 overflow-hidden grain-overlay">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-12">
          <div className="max-w-xs">
            <div className="mb-4">
              <span className="font-serif text-3xl font-semibold text-warm-ivory">Ayojan</span>
              <span className="font-serif text-3xl italic text-marigold ml-1">Wale</span>
            </div>
            <p className="font-serif text-2xl leading-tight text-warm-ivory/90 italic">
              Plan beautifully.<br />Celebrate freely.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-marigold mb-5">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      to={l === "Find Vendors" ? "/vendors" : l === "Plan My Event" ? "/plan" : l === "My Bookings" ? "/bookings" : "/"}
                      data-testid={`footer-link-${l.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="text-sm text-warm-ivory/70 hover:text-marigold transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-8 border-t border-warm-ivory/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-warm-ivory/50">
          <p>© {new Date().getFullYear()} Ayojan Wale. Made with warmth in India.</p>
          <p className="font-serif italic text-marigold/80 text-sm">Find • Plan • Celebrate</p>
        </div>
      </div>
    </footer>
  );
}
