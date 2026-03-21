import { Link } from "react-router-dom";
import { Baby, Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Baby className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-900 text-lg">Haptot</span>
          </Link>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Quality care for little ones. Thoughtfully designed products for every stage of growth.
          </p>
          <div className="flex gap-2.5">
            {[
              { icon: Instagram, href: "#" },
              { icon: Facebook, href: "#" },
              { icon: Youtube, href: "#" },
              { icon: Twitter, href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <s.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">Shop</h3>
          <div className="space-y-2">
            <Link to="/products?category=toys" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Toys</Link>
            <Link to="/products?category=stationery" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">School Stationery</Link>
            <Link to="/products?category=babycare" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Baby Care</Link>
            <Link to="/products" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">All Products</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">Support</h3>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Shipping Policy</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Returns & Exchanges</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">FAQ</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-700 text-xs uppercase tracking-wider mb-4 text-primary-foreground/80">Contact</h3>
          <div className="space-y-2.5">
            <a href="mailto:hello@haptot.com" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Mail className="w-3.5 h-3.5" /> hello@haptot.com
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Phone className="w-3.5 h-3.5" /> +91 123 456 7890
            </a>
            <p className="flex items-start gap-2 text-sm text-primary-foreground/60">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Mumbai, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} Haptot. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-primary-foreground/40">
          <a href="#" className="hover:text-primary-foreground/70">Terms</a>
          <a href="#" className="hover:text-primary-foreground/70">Privacy</a>
          <a href="#" className="hover:text-primary-foreground/70">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
