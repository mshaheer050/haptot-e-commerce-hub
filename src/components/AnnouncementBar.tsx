import { Facebook, Instagram, Youtube, Twitter, MapPin } from "lucide-react";

const messages = [
  "🎉 While Saving Big With Our Limited-Time Offers.",
  "🚚 Free Shipping on Orders Over ₹499!",
  "⭐ Unlock Exclusive Deals And Special Offers On Our Top-Rated Toys!",
];

const AnnouncementBar = () => (
  <div className="bg-[hsl(var(--announcement-bg))] text-[hsl(var(--announcement-fg))]">
    <div className="container mx-auto flex items-center justify-between h-9">
      {/* Social icons */}
      <div className="hidden md:flex items-center gap-3">
        {[
          { icon: Facebook, href: "#" },
          { icon: Instagram, href: "#" },
          { icon: Youtube, href: "#" },
          { icon: Twitter, href: "#" },
          { icon: MapPin, href: "#" },
        ].map((s, i) => (
          <a key={i} href={s.href} className="text-[hsl(var(--announcement-fg))]/70 hover:text-[hsl(var(--announcement-fg))] transition-colors">
            <s.icon className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden mx-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...messages, ...messages].map((msg, i) => (
            <span key={i} className="text-[11px] font-medium mx-8">{msg}</span>
          ))}
        </div>
      </div>

      {/* Locale */}
      <div className="hidden md:flex items-center gap-3 text-[11px] font-medium">
        <span>English</span>
        <span className="opacity-40">|</span>
        <span>🇮🇳 India (₹)</span>
      </div>
    </div>
  </div>
);

export default AnnouncementBar;
