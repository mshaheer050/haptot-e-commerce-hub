import { Instagram, Youtube, Facebook, Truck } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// 📢 Update your real social media links below
// ─────────────────────────────────────────────────────────────────
const socials = [
  { icon: Instagram, href: "https://www.instagram.com/haptot.in", label: "Instagram" },
  { icon: Facebook,  href: "#",                                    label: "Facebook"  },
  { icon: Youtube,   href: "#",                                    label: "YouTube"   },
];

const AnnouncementBar = () => (
  <div
    className="w-full"
    style={{ background: "hsl(var(--announcement-bg))", color: "hsl(var(--announcement-fg))" }}
  >
    <div className="container mx-auto h-9 flex items-center justify-between gap-4">

      {/* Left — social icons */}
      <div className="flex items-center gap-3">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <s.icon className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>

      {/* Centre — trustworthy message, no returns mention */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
        <Truck className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Free home delivery across India &nbsp;·&nbsp; 100% genuine products &nbsp;·&nbsp; Secure checkout</span>
      </div>

      {/* Right — locale */}
      <div className="hidden md:flex items-center gap-2 text-[11px] font-medium opacity-70">
        <span>🇮🇳 India (₹)</span>
      </div>

    </div>
  </div>
);

export default AnnouncementBar;
