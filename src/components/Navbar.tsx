import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Baby } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Baby className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-900 text-xl tracking-tight text-foreground">Haptot</span>
              <p className="text-[10px] text-muted-foreground leading-none -mt-0.5 hidden sm:block">Quality Care for Little Ones</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products?category=toys" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Toys</Link>
            <Link to="/products?category=stationery" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Stationery</Link>
            <Link to="/products?category=babycare" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Baby Care</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-2xl hover:bg-muted transition-colors" aria-label="Search">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button onClick={() => setCartOpen(true)} className="p-2.5 rounded-2xl hover:bg-muted transition-colors relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 rounded-2xl hover:bg-muted transition-colors md:hidden" aria-label="Menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border p-4 animate-fade-in">
            <div className="container mx-auto">
              <input
                type="text"
                placeholder="Search toys, stationery, baby care..."
                className="w-full rounded-2xl border border-input bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in">
            <div className="container mx-auto py-4 flex flex-col gap-3">
              <Link to="/products?category=toys" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-2xl hover:bg-muted font-semibold text-sm">Toys</Link>
              <Link to="/products?category=stationery" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-2xl hover:bg-muted font-semibold text-sm">Stationery</Link>
              <Link to="/products?category=babycare" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-2xl hover:bg-muted font-semibold text-sm">Baby Care</Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
