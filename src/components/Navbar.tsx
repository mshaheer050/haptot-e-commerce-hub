import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Baby, User, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "./CartDrawer";

const navLinks = [
  {
    label: "Categories",
    children: [
      { label: "Toys", href: "/products?category=toys" },
      { label: "School Stationery", href: "/products?category=stationery" },
      { label: "Baby Care", href: "/products?category=babycare" },
    ],
  },
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/products?filter=new" },
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
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[68px]">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdownOpen === link.label && (
                    <div className="absolute top-full left-0 w-52 bg-background border border-border rounded-xl shadow-card py-2 animate-fade-in z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Center logo */}
          <Link to="/" className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Baby className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-900 text-xl tracking-tight text-foreground">Haptot</span>
              <p className="text-[9px] text-muted-foreground leading-none -mt-0.5 hidden sm:block">Quality Care for Little Ones</p>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] text-foreground" />
            </button>
            <Link to="/haptot-admin" className="p-2.5 rounded-lg hover:bg-muted transition-colors hidden md:flex" aria-label="Account">
              <User className="w-[18px] h-[18px] text-foreground" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-[18px] h-[18px] text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search toys, stationery, baby care..."
                  className="flex-1 rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto py-3 flex flex-col gap-1">
              <Link to="/products?category=toys" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted font-semibold text-sm">Toys</Link>
              <Link to="/products?category=stationery" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted font-semibold text-sm">School Stationery</Link>
              <Link to="/products?category=babycare" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted font-semibold text-sm">Baby Care</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted font-semibold text-sm">All Products</Link>
              <Link to="/haptot-admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-muted font-semibold text-sm">Admin</Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
