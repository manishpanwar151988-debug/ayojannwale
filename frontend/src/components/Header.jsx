import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Search, Heart, ClipboardList, User } from "lucide-react";

const NAV = [
  { label: "Find Vendors", to: "/vendors" },
  { label: "Plan My Event", to: "/plan" },
  { label: "My Bookings", to: "/bookings" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Ideas", to: "/#ideas" },
];

export const Logo = ({ dark = false }) => (
  <Link to="/" data-testid="logo-link" className="flex items-baseline gap-0.5 group">
    <span
      className="font-serif text-2xl md:text-3xl font-semibold tracking-tight"
      style={{ color: dark ? "#FFF9F1" : "#4A1748" }}
    >
      Ayojan
    </span>
    <span
      className="font-serif text-2xl md:text-3xl italic font-medium"
      style={{ color: "#F4A623" }}
    >
      Wale
    </span>
    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#E87817] translate-y-[-2px] transition-transform group-hover:scale-150" />
  </Link>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  const go = (to) => {
    if (to.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(to.slice(1));
        el?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else navigate(to);
  };

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm-ivory/85 backdrop-blur-xl border-b border-soft-gold/25 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <button
                key={n.label}
                data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                onClick={() => go(n.to)}
                className="relative text-sm font-medium text-charcoal/75 hover:text-royal-plum transition-colors group"
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-marigold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              data-testid="login-btn"
              className="text-sm font-medium text-charcoal/70 hover:text-royal-plum transition-colors"
            >
              Login
            </button>
            <Link
              to="/plan"
              data-testid="header-plan-cta"
              className="rounded-full px-6 py-2.5 bg-royal-plum text-warm-ivory text-sm font-medium hover:bg-deep-wine transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(74,23,72,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(74,23,72,0.6)] hover:-translate-y-0.5"
            >
              Plan Your Event
            </Link>
          </div>

          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-2 text-royal-plum"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-warm-ivory/95 backdrop-blur-xl border-t border-soft-gold/20 mt-3"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {NAV.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => go(n.to)}
                    className="text-left text-lg font-serif text-royal-plum"
                  >
                    {n.label}
                  </button>
                ))}
                <Link
                  to="/plan"
                  className="mt-2 rounded-full px-6 py-3 bg-royal-plum text-warm-ivory text-center font-medium"
                >
                  Plan Your Event
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile sticky bottom bar */}
      <nav
        data-testid="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-warm-ivory/95 backdrop-blur-xl border-t border-soft-gold/25 px-6 py-2 flex items-center justify-between"
      >
        {[
          { icon: Home, label: "Home", to: "/" },
          { icon: Search, label: "Explore", to: "/vendors" },
          { icon: Heart, label: "Saved", to: "/vendors" },
          { icon: ClipboardList, label: "My Event", to: "/plan" },
          { icon: User, label: "Account", to: "/" },
        ].map((i) => (
          <button
            key={i.label}
            onClick={() => go(i.to)}
            className="flex flex-col items-center gap-0.5 text-[10px] text-charcoal/70 hover:text-royal-plum transition-colors"
          >
            <i.icon size={20} strokeWidth={1.5} />
            {i.label}
          </button>
        ))}
      </nav>
    </>
  );
}
