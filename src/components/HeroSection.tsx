import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pastel-blue via-background to-pastel-orange">
      <div className="container mx-auto py-16 md:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Collection 2026</span>
            </div>
            <h1 className="font-display font-900 text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
              Quality Care for{" "}
              <span className="text-gradient">Little Ones</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover thoughtfully designed toys, school essentials & baby care products that spark joy and nurture growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all hover:gap-3"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=toys"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-card text-foreground font-bold text-sm shadow-soft hover:shadow-card transition-all border border-border"
              >
                Explore Toys
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-pastel-pink border-2 border-card" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Loved by 10,000+ parents</p>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-8 -right-8 w-72 h-72 rounded-full bg-pastel-orange/50 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-pastel-blue/50 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80" alt="Colorful wooden toys" className="rounded-3xl shadow-card w-full h-48 object-cover animate-float" />
                <img src="https://images.unsplash.com/photo-1590005354167-6da97870c757?w=400&q=80" alt="Baby care products" className="rounded-3xl shadow-card w-full h-32 object-cover" style={{ animationDelay: "1s" }} />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80" alt="Art supplies for kids" className="rounded-3xl shadow-card w-full h-32 object-cover" />
                <img src="https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&q=80" alt="Building blocks" className="rounded-3xl shadow-card w-full h-48 object-cover animate-float" style={{ animationDelay: "1.5s" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
