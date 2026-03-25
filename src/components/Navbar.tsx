import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User, ChevronDown, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "./CartDrawer";

const navLinks = [
  {
    label: "Categories",
    children: [
      { label: "🚗  Die-cast Cars", href: "/products?category=diecast" },
      { label: "🪀  Action Toys", href: "/products?category=action" },
      { label: "🧩  Puzzles & Games", href: "/products?category=puzzles" },
      { label: "🪵  Wooden Toys", href: "/products?category=wooden" },
    ],
  },
  { label: "All Toys", href: "/products" },
  { label: "New Arrivals", href: "/products?filter=new" },
  { label: "Deals", href: "/products?filter=sale" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-[68px]">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-2xl hover:bg-muted transition-colors md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-2xl hover:bg-pastel-purple">
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === link.label ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen === link.label && (
                    <div className="absolute top-full left-0 w-60 bg-card border border-border rounded-3xl shadow-card py-2.5 animate-fade-in z-50 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center px-5 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-pastel-purple/50 transition-all rounded-2xl mx-1.5"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href!}
                  className="px-4 py-2.5 text-sm font-semibold text-foreground hover:text-primary hover:bg-pastel-purple transition-all rounded-2xl"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Centre logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-display font-black text-lg">H</span>
            </div>
            <span className="font-display font-black text-xl text-foreground hidden sm:block">Haptot</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 rounded-2xl transition-all ${searchOpen ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* ✅ FIXED: Changed from /haptot-admin to /auth for customer login */}
            <Link
              to="/auth"
              className="p-2.5 rounded-2xl hover:bg-muted transition-colors hidden md:flex text-foreground"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 pl-3 pr-4 py-2.5 rounded-2xl btn-gradient text-xs ml-1"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center shadow-soft">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border/50 bg-card animate-fade-in">
            <div className="container mx-auto py-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search die-cast cars, wooden toys, puzzles..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    autoFocus
                  />
                </div>
                <button type="submit" className="px-6 py-3 rounded-2xl btn-gradient text-sm">
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-3 rounded-2xl hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card animate-fade-in">
            <div className="container mx-auto py-5 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  link.children.map((child) => (
                    <Link key={child.label} to={child.href} onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-2xl hover:bg-pastel-purple text-sm font-semibold flex items-center gap-2 transition-all">
                      {child.label}
                    </Link>
                  ))
                ) : (
                  <Link key={link.label} to={link.href!} onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-2xl hover:bg-pastel-purple text-sm font-semibold transition-all">
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
