import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw, Award, Package, Users, Star, MapPin } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// 🛡️ TRUST BADGES — policies must match exactly what you offer
// ─────────────────────────────────────────────────────────────────
const trustBadges = [
  {
    icon: Truck,
    label: "Free Home Delivery",
    desc: "All India · No minimum order",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    icon: Shield,
    label: "100% Safe & Genuine",
    desc: "Non-toxic, certified toys",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: RotateCcw,
    label: "7-Day Returns",
    desc: "After team verification",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    icon: Award,
    label: "Premium Quality",
    desc: "Carefully curated toys",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
];

// ─────────────────────────────────────────────────────────────────
// 📊 STATS STRIP
// ─────────────────────────────────────────────────────────────────
const stats = [
  { icon: Users,   value: "10,000+",   label: "Happy Families" },
  { icon: Package, value: "500+",      label: "Toys in Stock"  },
  { icon: Star,    value: "4.9★",      label: "Avg Rating"     },
  { icon: MapPin,  value: "All India", label: "Free Delivery"  },
];

// ─────────────────────────────────────────────────────────────────
// 💡 TO ADD A NEW CATEGORY (Baby Care / Stationery) IN FUTURE:
// Step 1 — Add hook in useProducts.ts e.g. useBabyCareProducts()
// Step 2 — Import it here
// Step 3 — Uncomment the matching ProductScroller block below
// ─────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="container mx-auto py-8">
    <div className="h-5 w-32 bg-muted rounded-lg mb-4 animate-pulse" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="min-w-[220px] rounded-2xl bg-muted animate-pulse h-72" />
      ))}
    </div>
  </div>
);

const Index = () => {
  const { data: featured = [],    isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: newArrivals = [], isLoading: loadingNew }      = useNewArrivals();

  // ── Future category hooks (uncomment when ready) ──
  // const { data: babyCare = [],   isLoading: loadingBaby }    = useBabyCareProducts();
  // const { data: stationery = [], isLoading: loadingStation } = useStationeryProducts();

  return (
    <main>
      <HeroBanner />

      {/* ── Trust badges ── */}
      <section className="py-6 border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${b.bg}`}>
                  <b.icon className={`w-5 h-5 ${b.text}`} />
                </div>
                <div>
                  <span className="font-display font-700 text-sm text-foreground block">{b.label}</span>
                  <span className="text-[11px] text-muted-foreground">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background: "hsl(var(--stats-bg))" }} className="py-5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-display font-800 text-base text-white">{s.value}</div>
                  <div className="text-[11px] text-white/70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ── */}
      <CategoryGrid />

      {/* ── Trending toys ── */}
      {loadingFeatured ? (
        <SkeletonRow />
      ) : featured.length > 0 ? (
        <ProductScroller
          title="Trending Toys"
          subtitle="Most loved by kids this week"
          products={featured}
        />
      ) : null}

      {/* ── New toy arrivals ── */}
      {loadingNew ? (
        <SkeletonRow />
      ) : newArrivals.length > 0 ? (
        <ProductScroller
          title="New Arrivals"
          subtitle="Fresh toys just landed"
          products={newArrivals}
        />
      ) : null}

      {/* ── FUTURE CATEGORY SCROLLERS ──────────────────────────────
      {loadingBaby ? <SkeletonRow /> : babyCare.length > 0 ? (
        <ProductScroller title="Baby Care" subtitle="Gentle & safe for your little one" products={babyCare} />
      ) : null}
      {loadingStation ? <SkeletonRow /> : stationery.length > 0 ? (
        <ProductScroller title="School Stationery" subtitle="Fun supplies for school & creativity" products={stationery} />
      ) : null}
      ─────────────────────────────────────────────────────────── */}

      {/* ── Customer reviews ── */}
      <CustomerReviews />

      {/* ── Newsletter ── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 text-center overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, hsl(194, 72%, 22%) 0%, hsl(194, 72%, 32%) 100%)" }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                Stay in the loop
              </span>
              <h2 className="font-display font-800 text-xl md:text-2xl text-white mb-2">
                Get New Toys & Exclusive Deals First
              </h2>
              <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
                Join 10,000+ parents getting early access to new toy arrivals and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="px-7 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 shadow-card">
                  Subscribe →
                </button>
              </div>
              <p className="text-[11px] text-white/40 mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
