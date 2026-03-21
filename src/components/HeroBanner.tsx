import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge_text: string;
  btn_text: string;
  btn_link: string;
  btn_style: string;
  text_color: string;
  overlay: boolean;
  is_active: boolean;
  position: number;
};

const INTERVAL = 5000;

const HeroBanner = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("position");
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

  // Reset index when banners change
  useEffect(() => {
    setCurrent(0);
  }, [count]);

  if (isLoading) {
    return (
      <section className="relative w-full h-[420px] md:h-[520px] bg-muted animate-pulse rounded-b-3xl" />
    );
  }

  if (count === 0) return null;

  const banner = banners[current];
  const isLight = banner.text_color === "light";

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-[420px] md:h-[520px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {/* Background image */}
            <img
              src={b.image}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />

            {/* Overlay */}
            {b.overlay && (
              <div className="absolute inset-0 bg-foreground/40" />
            )}

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 container mx-auto h-full flex items-center">
              <div className="max-w-xl space-y-5 animate-fade-in px-4">
                {b.badge_text && (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                    {b.badge_text}
                  </span>
                )}
                <h1 className={`font-display font-900 text-3xl md:text-5xl lg:text-6xl leading-tight ${isLight ? "text-card" : "text-foreground"}`}>
                  {b.title}
                </h1>
                {b.subtitle && (
                  <p className={`text-base md:text-lg leading-relaxed max-w-lg ${isLight ? "text-card/80" : "text-muted-foreground"}`}>
                    {b.subtitle}
                  </p>
                )}
                {b.btn_text && (
                  <Link
                    to={b.btn_link || "/products"}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:gap-3 ${
                      b.btn_style === "secondary"
                        ? "bg-secondary text-secondary-foreground hover:opacity-90"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {b.btn_text} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors shadow-soft"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors shadow-soft"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-card/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
