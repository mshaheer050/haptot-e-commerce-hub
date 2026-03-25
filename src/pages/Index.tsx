import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

const SkeletonRow = () => (
  <div className="container mx-auto py-8">
    <div className="h-5 w-32 bg-muted rounded-card mb-4 animate-pulse" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="min-w-[220px] rounded-card bg-muted animate-pulse h-72" />
      ))}
    </div>
  </div>
);

const Index = () => {
  const { data: featured = [],    isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: newArrivals = [], isLoading: loadingNew }      = useNewArrivals();

  return (
    <main className="bg-cream">

      <HeroBanner />

      {/* ── Trust Bar ───────────────────────────────── */}
      <section className="py-6 border-b border-border bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="flex items-center gap-3 p-3 rounded-card hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 bg-pastel-green">
                <Truck className="w-5 h-5 text-mint" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-foreground block">Free Pan-India Delivery</span>
                <span className="text-[11px] text-muted-foreground">Orders above ₹499</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-card hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 bg-pastel-blue">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-foreground block">100% Genuine Products</span>
                <span className="text-[11px] text-muted-foreground">Non-toxic, certified toys</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-card hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 bg-pastel-orange">
                <RotateCcw className="w-5 h-5 text-coral" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-foreground block">Easy 7-Day Returns</span>
                <span className="text-[11px] text-muted-foreground">Hassle-free process</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-card hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-card flex items-center justify-center flex-shrink-0 bg-pastel-purple">
                <Headphones className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-foreground block">WhatsApp Support</span>
                <span className="text-[11px] text-muted-foreground">Mon–Sat, 9am–7pm</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────── */}
      <section className="py-5 bg-charcoal">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-extrabold">10,000+</span>
              <span className="text-xs opacity-70">Happy Families</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-extrabold">500+</span>
              <span className="text-xs opacity-70">Toys in Stock</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-extrabold">4.9★</span>
              <span className="text-xs opacity-70">Avg Rating</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-extrabold">All India</span>
              <span className="text-xs opacity-70">Free Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Grid ────────────────────────────── */}
      <CategoryGrid />

      {/* ── Featured Products ────────────────────────── */}
      {loadingFeatured ? (
        <SkeletonRow />
      ) : featured.length > 0 ? (
        <ProductScroller
          title="Trending Toys ✨"
          subtitle="Most loved by kids this week"
          products={featured}
        />
      ) : null}

      {/* ── New Arrivals ─────────────────────────────── */}
      {loadingNew ? (
        <SkeletonRow />
      ) : newArrivals.length > 0 ? (
        <ProductScroller
          title="New Arrivals 🚀"
          subtitle="Fresh toys just landed"
          products={newArrivals}
        />
      ) : null}

      {/* ── Customer Reviews ─────────────────────────── */}
      <CustomerReviews />

      {/* ── Newsletter ───────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="bg-coral/5 border border-coral/15 rounded-card p-8 md:p-12 text-center">
            <span className="inline-block bg-coral/10 text-coral text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Join the Haptot Family
            </span>
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-foreground mt-1">
              Get Toy Deals & Parenting Tips in Your Inbox
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Join 10,000+ parents getting early access to new arrivals and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-btn bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
              />
              <button className="px-6 py-2.5 rounded-btn bg-coral text-white font-bold text-sm hover:bg-coral/90 active:scale-[0.97] transition-all">
                Subscribe →
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              No spam. Unsubscribe anytime. 🧡
            </p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Index;
