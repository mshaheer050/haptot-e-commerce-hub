import { Link } from "react-router-dom";
import { Baby, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Baby className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-900 text-lg">Haptot</span>
          </Link>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Quality care for little ones. Thoughtfully designed products for every stage of your child's growth.
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-700 text-sm uppercase tracking-wider mb-4">Shop</h3>
          <div className="space-y-2.5">
            <Link to="/products?category=toys" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Toys</Link>
            <Link to="/products?category=stationery" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">School Stationery</Link>
            <Link to="/products?category=babycare" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Baby Care</Link>
            <Link to="/products" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">All Products</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-display font-700 text-sm uppercase tracking-wider mb-4">Support</h3>
          <div className="space-y-2.5">
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Shipping Policy</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Returns & Exchanges</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">FAQ</a>
            <a href="#" className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-700 text-sm uppercase tracking-wider mb-4">Contact</h3>
          <div className="space-y-3">
            <a href="mailto:hello@haptot.com" className="flex items-center gap-2.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Mail className="w-4 h-4" /> hello@haptot.com
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-2.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Phone className="w-4 h-4" /> +91 123 456 7890
            </a>
            <p className="flex items-start gap-2.5 text-sm text-primary-foreground/60">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Mumbai, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} Haptot. All rights reserved. Quality Care for Little Ones.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
