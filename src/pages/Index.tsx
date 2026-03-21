import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

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

  return (
    <main>
      <HeroBanner />

      {/* Trust badges — hardcoded classes, no dynamic Tailwind */}
      <section className="py-6 border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-50">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="font-display font-700 text-sm text-foreground block">Free Home Delivery</span>
                <span className="text-[11px] text-muted-foreground">All India · No minimum order</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="font-display font-700 text-sm text-foreground block">100% Safe & Genuine</span>
                <span className="text-[11px] text-muted-foreground">Non-toxic, certified toys</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-50">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <span className="font-display font-700 text-sm text-foreground block">7-Day Returns</span>
                <span className="text-[11px] text-muted-foreground">After team verification</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="font-display font-700 text-sm text-foreground block">Premium Quality</span>
                <span className="text-[11px] text-muted-foreground">Carefully curated toys</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats strip — inline style, no Tailwind variable */}
      <section style={{ background: "hsl(194, 72%, 22%)" }} className="py-5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-bold">10,000+</span>
              <span className="text-xs opacity-70">Happy Families</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-bold">500+</span>
              <span className="text-xs opacity-70">Toys in Stock</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-bold">4.9★</span>
              <span className="text-xs opacity-70">Avg Rating</span>
            </div>
            <div className="flex flex-col items-center md:items-start px-4">
              <span className="font-display text-lg font-bold">All India</span>
              <span className="text-xs opacity-70">Free Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      {loadingFeatured ? (
        <SkeletonRow />
      ) : featured.length > 0 ? (
        <ProductScroller title="Trending Toys" subtitle="Most loved by kids this week" products={featured} />
      ) : null}

      {loadingNew ? (
        <SkeletonRow />
      ) : newArrivals.length > 0 ? (
        <ProductScroller title="New Arrivals" subtitle="Fresh toys just landed" products={newArrivals} />
      ) : null}

      <CustomerReviews />

      {/* Newsletter */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display font-800 text-xl md:text-2xl text-foreground">
              Get New Toys & Exclusive Deals First
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Join 10,000+ parents getting early access to new toy arrivals and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                Subscribe →
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
