import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

type Banner = {
  id: string; title: string; subtitle: string; image: string;
  badge_text: string; btn_text: string; btn_link: string;
  btn_style: string; text_color: string; overlay: boolean;
  is_active: boolean; position: number;
};

const INTERVAL = 5000;

const HeroBanner = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners").select("*").eq("is_active", true).order("position");
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, count, next]);

  useEffect(() => { setCurrent(0); }, [count]);

  if (isLoading) {
    return <section className="w-full h-[420px] md:h-[560px] gradient-hero animate-pulse" />;
  }

  const FallbackHero = () => (
    <div className="container mx-auto h-full flex items-center relative z-10">
      <div className="grid md:grid-cols-2 gap-10 items-center w-full">
        <div className="space-y-6 px-2 md:px-0 animate-fade-in">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            India's Premium Kids Store
          </span>
          <h1 className="font-display font-black leading-[1.1] text-primary-foreground" style={{ fontSize: "clamp(2.25rem,5.5vw,3.75rem)" }}>
            Where Play Meets
            <span className="block text-secondary">Premium Quality</span>
          </h1>
          <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-lg">
            Discover curated collections of safe, non-toxic toys that spark creativity and bring joy to every child.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-bold text-sm btn-gradient-warm px-8 py-3.5 rounded-full"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/25 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all"
            >
              View Bestsellers
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center">
          <div className="relative">
            <div className="w-72 h-72 rounded-full bg-primary-foreground/5 animate-blob flex items-center justify-center">
              <div className="w-52 h-52 rounded-full bg-primary-foreground/8 flex items-center justify-center">
                <span className="text-8xl">🧸</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-secondary/90 flex items-center justify-center shadow-card animate-float">
              <span className="text-2xl">🚗</span>
            </div>
            <div className="absolute -bottom-2 -left-6 w-14 h-14 rounded-2xl bg-accent/90 flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="text-2xl">🧩</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (count === 0) {
    return (
      <section className="relative w-full overflow-hidden gradient-hero" style={{ minHeight: "clamp(400px, 60vw, 560px)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(340 75% 65% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(24 95% 64% / 0.3) 0%, transparent 50%)" }} />
        <FallbackHero />
      </section>
    );
  }

  const banner = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden gradient-hero"
      style={{ minHeight: "clamp(400px, 60vw, 560px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(340 75% 65% / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(24 95% 64% / 0.3) 0%, transparent 50%)" }} />

      <div className="relative h-[420px] md:h-[560px]">
        {banners.map((b, i) => (
          <div key={b.id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
            <div className="container mx-auto h-full flex items-center relative z-10">
              <div className="grid md:grid-cols-2 gap-10 items-center w-full">
                <div className="space-y-6 px-2 md:px-0 animate-fade-in">
                  {b.badge_text && (
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm">
                      <Sparkles className="w-3.5 h-3.5" /> {b.badge_text}
                    </span>
                  )}
                  <h1 className="font-display font-black leading-[1.1]" style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)", color: b.text_color === "dark" ? "hsl(240 20% 16%)" : "#fff" }}>
                    {b.title}
                  </h1>
                  {b.subtitle && (
                    <p className="text-base leading-relaxed max-w-lg" style={{ color: b.text_color === "dark" ? "hsl(240 20% 16% / 0.7)" : "rgba(255,255,255,0.8)" }}>
                      {b.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link to={b.btn_link || "/products"} className="inline-flex items-center gap-2 font-bold text-sm btn-gradient-warm px-8 py-3.5 rounded-full">
                      {b.btn_text || "Shop Now"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center">
                  {b.image ? (
                    <img src={b.image} alt={b.title} className="max-h-[440px] w-auto object-contain drop-shadow-2xl" loading={i === 0 ? "eager" : "lazy"} />
                  ) : (
                    <div className="w-72 h-72 rounded-full bg-primary-foreground/5 animate-blob flex items-center justify-center">
                      <span className="text-8xl">🧸</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all" aria-label="Previous">
            <ChevronLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all" aria-label="Next">
            <ChevronRight className="w-5 h-5 text-primary-foreground" />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="transition-all duration-300 rounded-full" style={{ width: i === current ? "28px" : "10px", height: "10px", background: i === current ? "hsl(24 95% 64%)" : "rgba(255,255,255,0.35)" }} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
