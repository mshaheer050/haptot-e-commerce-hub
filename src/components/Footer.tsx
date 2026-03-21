import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// 📢 SOCIAL LINKS — update when your pages are ready
// ─────────────────────────────────────────────────────────────────
const socials = [
  { icon: Instagram, href: "https://www.instagram.com/haptot.in", label: "Instagram" },
  { icon: Facebook,  href: "#",                                    label: "Facebook"  },
  { icon: Youtube,   href: "#",                                    label: "YouTube"   },
  { icon: Twitter,   href: "#",                                    label: "Twitter"   },
];

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

        {/* ── Brand ── */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Haptot"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Premium toys for every little dream. Carefully curated and delivered across India.
          </p>
          <div className="flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <s.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Shop — Toys only for now ── */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">
            Shop
          </h3>
          <div className="space-y-2.5">
            <Link to="/products?category=diecast" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Die-cast Cars</Link>
            <Link to="/products?category=action"  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Action Toys</Link>
            <Link to="/products?category=wooden"  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Wooden Toys</Link>
            <Link to="/products?category=puzzles" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Puzzles & Games</Link>
            <Link to="/products?filter=new"       className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">New Arrivals</Link>
            <Link to="/products?filter=sale"      className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Deals</Link>
            {/* ── Uncomment when ready to launch ──
            <Link to="/products?category=babycare"    className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Baby Care</Link>
            <Link to="/products?category=stationery"  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">School Stationery</Link>
            */}
          </div>
        </div>

        {/* ── Support ── */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">
            Support
          </h3>
          <div className="space-y-2.5">
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Shipping Policy</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Returns & Exchanges</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">FAQ</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* ── Contact — real Haptot info ── */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">
            Contact
          </h3>
          <div className="space-y-3">
            <a
              href="mailto:haptot.store@gmail.com"
              className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              haptot.store@gmail.com
            </a>
            <a
              href="tel:+919497809094"
              className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              +91 94978 09094
            </a>
            <p className="flex items-start gap-2 text-sm text-primary-foreground/60">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Tirur, Kerala, India
            </p>
          </div>

          {/* Delivery reminder */}
          <div className="mt-5 p-3 rounded-xl bg-primary/20 border border-primary/30">
            <p className="text-xs text-primary-foreground/80 font-semibold">🚚 Free home delivery</p>
            <p className="text-[11px] text-primary-foreground/50 mt-0.5">All across India · No minimum order</p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Haptot. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-primary-foreground/40">
          <a href="#" className="hover:text-primary-foreground/70 transition-colors">Terms</a>
          <a href="#" className="hover:text-primary-foreground/70 transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-foreground/70 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
