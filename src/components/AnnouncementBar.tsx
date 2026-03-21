import { Instagram, Youtube, Facebook, Truck } from "lucide-react";

const AnnouncementBar = () => (
  <div
    className="w-full"
    style={{ background: "hsl(var(--announcement-bg))", color: "hsl(var(--announcement-fg))" }}
  >
    <div className="container mx-auto h-9 flex items-center justify-between gap-4">

      {/* Left — social icons hardcoded */}
      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/haptot.in"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <Instagram className="w-3.5 h-3.5" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <Facebook className="w-3.5 h-3.5" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <Youtube className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Centre — clean trust message */}
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
