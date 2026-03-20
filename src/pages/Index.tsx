import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "100% Safe", desc: "Non-toxic & certified" },
  { icon: Truck, label: "Free Shipping", desc: "On orders over ₹499" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day return policy" },
];

const Index = () => {
  const { data: featured = [], isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: newArrivals = [], isLoading: loadingNew } = useNewArrivals();

  return (
    <main>
      <HeroSection />
      <CategoryGrid />

      {/* Trust badges */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center p-4 md:p-6 rounded-3xl bg-card shadow-soft">
                <b.icon className="w-6 h-6 text-primary mb-2" />
                <span className="font-display font-700 text-sm text-foreground">{b.label}</span>
                <span className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!loadingFeatured && featured.length > 0 && (
        <ProductScroller title="Trending Now" subtitle="Most loved by parents this week" products={featured} />
      )}
      {!loadingNew && newArrivals.length > 0 && (
        <ProductScroller title="New Arrivals" subtitle="Fresh picks just for you" products={newArrivals} />
      )}

      {/* Newsletter */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-pastel-blue to-pastel-orange rounded-3xl p-8 md:p-16 text-center">
            <h2 className="font-display font-800 text-3xl md:text-4xl text-foreground">Stay in the Loop</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Get updates on new arrivals, exclusive offers, and parenting tips.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
              <input type="email" placeholder="your@email.com" className="flex-1 px-5 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button className="px-7 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
