import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin, Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground relative overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

    <div className="container mx-auto py-14 md:py-18">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-display font-black text-lg">H</span>
            </div>
            <span className="font-display font-black text-xl">Haptot</span>
          </Link>
          <p className="text-sm text-primary-foreground/50 leading-relaxed">
            Premium toys for every little dream. Carefully curated and delivered across India.
          </p>
          <div className="flex gap-2.5">
            {[
              { icon: Instagram, href: "https://www.instagram.com/haptot.in" },
              { icon: Facebook, href: "#" },
              { icon: Youtube, href: "#" },
              { icon: Twitter, href: "#" },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-2xl bg-primary-foreground/8 flex items-center justify-center hover:bg-primary-foreground/15 hover:scale-110 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] mb-5 text-primary-foreground/70">Shop</h3>
          <div className="space-y-3">
            {[
              { label: "Toys", href: "/products?category=toys" },
              { label: "New Arrivals", href: "/products?filter=new" },
              { label: "Deals", href: "/products?filter=sale" },
              { label: "All Products", href: "/products" },
            ].map((l) => (
              <Link key={l.label} to={l.href} className="block text-sm text-primary-foreground/50 hover:text-primary-foreground hover:translate-x-1 transition-all">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] mb-5 text-primary-foreground/70">Support</h3>
          <div className="space-y-3">
            {["Shipping Policy", "Returns & Exchanges", "FAQ", "Privacy Policy"].map((l) => (
              <a key={l} href="#" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground hover:translate-x-1 transition-all">
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] mb-5 text-primary-foreground/70">Contact</h3>
          <div className="space-y-3.5">
            <a href="mailto:haptot.store@gmail.com" className="flex items-center gap-2.5 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              <Mail className="w-4 h-4 flex-shrink-0" /> haptot.store@gmail.com
            </a>
            <a href="tel:+919497809094" className="flex items-center gap-2.5 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              <Phone className="w-4 h-4 flex-shrink-0" /> +91 94978 09094
            </a>
            <p className="flex items-start gap-2.5 text-sm text-primary-foreground/50">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Tirur, Kerala, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-primary-foreground/30">© {new Date().getFullYear()} Haptot. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-primary-foreground/30">
          <a href="#" className="hover:text-primary-foreground/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-primary-foreground/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-foreground/60 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
