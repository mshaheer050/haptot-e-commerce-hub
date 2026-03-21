import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const trustBadges = [
  { icon: Truck,     label: "Free Home Delivery", desc: "All India · No minimum order", bg: "bg-green-50",  text: "text-green-600"  },
  { icon: Shield,    label: "100% Safe & Genuine", desc: "Non-toxic, certified toys",   bg: "bg-blue-50",   text: "text-blue-600"   },
  { icon: RotateCcw, label: "7-Day Returns",        desc: "After team verification",     bg: "bg-orange-50", text: "text-orange-600" },
  { icon: Award,     label: "Premium Quality",      desc: "Carefully curated toys",      bg: "bg-purple-50", text: "text-purple-600" },
];

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

      {/* Trust badges */}
      <section className="py-6 border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
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
