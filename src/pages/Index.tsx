import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductScroller from "@/components/ProductScroller";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Shield, Truck, RotateCcw, Headphones, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SkeletonRow = () => (
  <div className="container mx-auto py-8">
    <div className="h-6 w-40 bg-muted rounded-full mb-5 animate-pulse" />
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="min-w-[230px] rounded-card bg-muted animate-pulse h-80" />
      ))}
    </div>
  </div>
);

const trustItems = [
  { icon: Truck, title: "Free Pan-India Delivery", desc: "Orders above ₹499", surface: "bg-pastel-green" },
  { icon: Shield, title: "100% Genuine Products", desc: "Non-toxic, certified toys", surface: "bg-pastel-blue" },
  { icon: RotateCcw, title: "Easy 7-Day Returns", desc: "Hassle-free process", surface: "bg-pastel-orange" },
  { icon: Headphones, title: "WhatsApp Support", desc: "Mon–Sat, 9am–7pm", surface: "bg-pastel-purple" },
];

const stats = [
  { value: "10,000+", label: "Happy Families" },
  { value: "500+", label: "Toys in Stock" },
  { value: "4.9★", label: "Average Rating" },
  { value: "All India", label: "Free Delivery" },
];

const Index = () => {
  const { data: featured = [], isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: newArrivals = [], isLoading: loadingNew } = useNewArrivals();

  return (
    <main>
      <HeroBanner />

      {/* ── Trust Bar ──────────────────────────────── */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-card hover:shadow-soft transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.surface} shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-foreground block">{item.title}</span>
                  <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ────────────────────────────── */}
      <section className="py-6 gradient-hero">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-primary-foreground">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center md:items-start px-6 py-2">
                <span className="font-display text-xl font-black">{s.value}</span>
                <span className="text-xs opacity-70 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────── */}
      <CategoryGrid />

      {/* ── Featured Products ──────────────────────── */}
      {loadingFeatured ? <SkeletonRow /> : featured.length > 0 ? (
        <ProductScroller title="Trending Toys ✨" subtitle="Most loved by kids this week" products={featured} />
      ) : null}

      {/* ── New Arrivals ───────────────────────────── */}
      {loadingNew ? <SkeletonRow /> : newArrivals.length > 0 ? (
        <ProductScroller title="New Arrivals 🚀" subtitle="Fresh toys just landed" products={newArrivals} />
      ) : null}

      {/* ── Customer Reviews ───────────────────────── */}
      <CustomerReviews />

      {/* ── Newsletter ─────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-card gradient-hero p-10 md:p-16 text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, hsl(340 75% 65% / 0.5) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(24 95% 64% / 0.4) 0%, transparent 50%)" }} />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider border border-primary-foreground/20">
                <Sparkles className="w-3.5 h-3.5" />
                Join the Haptot Family
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl text-primary-foreground mt-2">
                Get Toy Deals & Parenting Tips
              </h2>
              <p className="text-sm text-primary-foreground/70 mt-3 max-w-md mx-auto">
                Join 10,000+ parents getting early access to new arrivals and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/25 text-primary-foreground text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 backdrop-blur-sm"
                />
                <button className="px-8 py-3 rounded-full btn-gradient-warm text-sm font-bold">
                  Subscribe →
                </button>
              </div>
              <p className="text-[11px] text-primary-foreground/50 mt-4">
                No spam. Unsubscribe anytime. 🧡
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
