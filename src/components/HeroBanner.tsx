import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  useEffect(() => { setCurrent(0); }, [count]);

  if (isLoading) {
    return <section className="w-full h-[360px] md:h-[480px] bg-muted animate-pulse" />;
  }
  if (count === 0) return null;

  const banner = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-[hsl(var(--hero-bg))]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[360px] md:h-[480px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {/* Split layout: text left, image right */}
            <div className="container mx-auto h-full flex items-center">
              <div className="grid md:grid-cols-2 gap-6 items-center w-full">
                {/* Text side */}
                <div className="space-y-4 px-2 md:px-0 animate-fade-in">
                  {b.badge_text && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary">
                      {b.badge_text}
                    </span>
                  )}
                  <h1 className="font-display font-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
                    {b.title}
                  </h1>
                  {b.subtitle && (
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                      {b.subtitle}
                    </p>
                  )}
                  {b.btn_text && (
                    <Link
                      to={b.btn_link || "/products"}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 ${
                        b.btn_style === "secondary"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {b.btn_text}
                    </Link>
                  )}
                </div>

                {/* Image side */}
                <div className="hidden md:flex justify-center items-center h-full">
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="max-h-[400px] w-auto object-contain drop-shadow-lg"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  )}
                </div>
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
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-colors shadow-soft"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-colors shadow-soft"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary scale-125" : "bg-foreground/20"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
