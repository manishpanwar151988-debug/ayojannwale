// Shared motion variants + per-event accent themes

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const maskReveal = {
  hidden: { y: "110%" },
  show: (i = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 * i },
  }),
};

// Accent colours per event category (selective, not all at once)
export const EVENT_THEMES = {
  wedding: { accent: "#D8A84E", text: "#4A1748", chip: "rgba(216,168,78,0.15)" },
  birthday: { accent: "#E85D5D", text: "#6B1F3A", chip: "rgba(232,93,93,0.14)" },
  baby: { accent: "#4F7B5B", text: "#4A1748", chip: "rgba(79,123,91,0.14)" },
  religious: { accent: "#E87817", text: "#6B1F3A", chip: "rgba(232,120,23,0.14)" },
  corporate: { accent: "#6B7280", text: "#4A1748", chip: "rgba(107,114,128,0.14)" },
  default: { accent: "#F4A623", text: "#4A1748", chip: "rgba(244,166,35,0.15)" },
};

export const themeFor = (t) => EVENT_THEMES[t] || EVENT_THEMES.default;

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
