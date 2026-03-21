import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Truck, User, ChevronDown, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "./CartDrawer";

// ─────────────────────────────────────────────────────────────────
// 🔗 NAV LINKS
// Currently: Toys only.
// To add Baby Care or Stationery in future, just uncomment
// the relevant lines inside the "children" array below.
// ─────────────────────────────────────────────────────────────────
const navLinks = [
  {
    label: "Categories",
    children: [
      { label: "🚗  Die-cast Cars",  href: "/products?category=diecast"    },
      { label: "🪀  Action Toys",    href: "/products?category=action"      },
      { label: "🧩  Puzzles & Games",href: "/products?category=puzzles"     },
      { label: "🪵  Wooden Toys",    href: "/products?category=wooden"      },
      // ── Uncomment when ready ──
      // { label: "🍼  Baby Care",      href: "/products?category=babycare"   },
      // { label: "✏️  Stationery",     href: "/products?category=stationery" },
    ],
  },
  { label: "All Toys",     href: "/products"             },
  { label: "New Arrivals", href: "/products?filter=new"  },
  { label: "Deals",        href: "/products?filter=sale" },
];

// ─────────────────────────────────────────────────────────────────
// 📢 ANNOUNCEMENT BAR
// Change the message below anytime — sales, offers, events etc.
// ─────────────────────────────────────────────────────────────────
const ANNOUNCEMENT = "🚚  Free shipping on orders above ₹499 · All India delivery · 7-day easy returns";

const Navbar = () => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [dropdownOpen,setDropdownOpen]= useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const navigate   = useNavigate();

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
      {/* ── Announcement bar ── */}
      <div
        className="w-full py-2 text-center text-[11px] font-semibold tracking-wide overflow-hidden"
        style={{ background: "hsl(var(--announcement-bg))", color: "hsl(var(--announcement-fg))" }}
      >
        <div className="animate-marquee whitespace-nowrap inline-block">
          {ANNOUNCEMENT}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{ANNOUNCEMENT}
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-soft">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[68px]">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-muted transition-colors md:hidden"
            aria-label="Menu"
          >
            {menuOpen
              ? <X    className="w-5 h-5 text-foreground" />
              : <Menu className="w-5 h-5 text-foreground" />
            }
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
                  <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted">
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === link.label ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen === link.label && (
                    <div className="absolute top-full left-0 w-56 bg-background border border-border rounded-2xl shadow-hover py-2 animate-fade-in z-50 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg mx-1"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                      {/* ── "Coming soon" teaser — remove when categories launch ── */}
                      <div className="mx-1 mt-1 pt-2 border-t border-border px-4 pb-1">
                        <p className="text-[10px] text-muted-foreground font-medium">Coming soon</p>
                        <p className="text-[11px] text-muted-foreground/70">Baby Care · Stationery</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href!}
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-muted transition-colors rounded-lg"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Centre logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
              <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-900 text-xl tracking-tight text-foreground">
                Hap<span className="text-primary">tot</span>
              </span>
              <p className="text-[9px] text-muted-foreground leading-none -mt-0.5 hidden sm:block">
                Premium Toys · All India
              </p>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 rounded-xl transition-colors ${searchOpen ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Admin — hidden on mobile */}
            <Link
              to="/haptot-admin"
              className="p-2.5 rounded-xl hover:bg-muted transition-colors hidden md:flex text-foreground"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-soft ml-1"
              aria-label="Cart"
            >
              <ShoppingCart className="w-[16px] h-[16px]" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        {searchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search die-cast cars, wooden toys, puzzles..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto py-4 flex flex-col gap-1">

              {/* Mobile nav section label */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 pb-1">
                Shop Toys
              </p>
              <Link to="/products?category=diecast"  onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold flex items-center gap-2">🚗 Die-cast Cars</Link>
              <Link to="/products?category=action"   onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold flex items-center gap-2">🪀 Action Toys</Link>
              <Link to="/products?category=puzzles"  onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold flex items-center gap-2">🧩 Puzzles & Games</Link>
              <Link to="/products?category=wooden"   onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold flex items-center gap-2">🪵 Wooden Toys</Link>

              <div className="h-px bg-border my-2" />

              <Link to="/products"            onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold">All Toys</Link>
              <Link to="/products?filter=new" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold">New Arrivals</Link>
              <Link to="/products?filter=sale"onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-semibold">Deals 🔥</Link>

              <div className="h-px bg-border my-2" />

              {/* Coming soon teaser in mobile too */}
              <div className="px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Coming Soon</p>
                <p className="text-xs text-muted-foreground/70">Baby Care · School Stationery</p>
              </div>

              <div className="h-px bg-border my-2" />

              {/* Free shipping reminder in mobile */}
              <div className="mx-4 mt-1 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs text-primary font-semibold">Free shipping above ₹499</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
