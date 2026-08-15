import Marquee from "react-fast-marquee";

const WORDS = ["Find", "Plan", "Celebrate", "Discover", "Compare", "Choose", "Rejoice"];

export default function EditorialMarquee() {
  return (
    <section data-testid="marquee-section" className="relative bg-royal-plum py-8 md:py-10 overflow-hidden grain-overlay">
      <Marquee speed={40} gradient={false} autoFill>
        {WORDS.map((w, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8">
            <span className="font-serif italic text-4xl md:text-6xl text-warm-ivory/90">{w}</span>
            <span className="h-2.5 w-2.5 rounded-full bg-marigold" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
