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

/* Floating background dots — uses drift-up keyframe from globals.css */
const FloatingDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
    {[
      { size: 10, left: "8%",  top: "70%", delay: "0s",    dur: "6s"  },
      { size: 6,  left: "18%", top: "80%", delay: "1.2s",  dur: "7s"  },
      { size: 14, left: "30%", top: "75%", delay: "0.5s",  dur: "8s"  },
      { size: 8,  left: "45%", top: "85%", delay: "2s",    dur: "6.5s"},
      { size: 5,  left: "58%", top: "72%", delay: "0.8s",  dur: "7.5s"},
      { size: 12, left: "70%", top: "78%", delay: "1.8s",  dur: "6s"  },
      { size: 7,  left: "82%", top: "82%", delay: "0.3s",  dur: "8.5s"},
      { size: 9,  left: "92%", top: "68%", delay: "1.5s",  dur: "7s"  },
      { size: 4,  left: "25%", top: "60%", delay: "2.5s",  dur: "9s"  },
      { size: 11, left: "75%", top: "65%", delay: "0.6s",  dur: "6.8s"},
    ].map((dot, i) => (
      <span
        key={i}
        style={{
          position: "absolute",
          left: dot.left,
          top: dot.top,
          width: dot.size,
          height: dot.size,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          animation: `drift-up ${dot.dur} ease-in-out infinite`,
          animationDelay: dot.delay,
        }}
      />
    ))}
  </div>
);

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
  const [paused,  setPaused]  = useState(false);
  const count = banners.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, count, next]);

  useEffect(() => { setCurrent(0); }, [count]);

  /* ── Loading skeleton ───────────────────────── */
  if (isLoading) {
    return (
      <section
        className="w-full h-[400px] md:h-[520px] animate-pulse"
        style={{ background: "linear-gradient(135deg,#2D1B69 0%,#6B3FA0 100%)" }}
      />
    );
  }

  /* ── Fallback hero when no banners in Supabase ─ */
  const FallbackHero = () => (
    <div className="container mx-auto h-full flex items-center relative z-10">
      <div className="grid md:grid-cols-2 gap-8 items-center w-full">
        <div className="space-y-5 px-2 md:px-0 animate-fade-in">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: "#FF6B35", color: "#fff" }}
          >
            🇮🇳 Made for Indian Families
          </span>
          <h1
            className="font-display font-black leading-tight"
            style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "#fff" }}
          >
            India's Favourite<br />
            <span style={{ color: "#FFD93D" }}>Kids' Store</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.7 }}>
            Toys · Stationery · Baby Care
          </p>
          <p
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff", width: "fit-content" }}
          >
            🚚 Free delivery across India on orders above ₹499
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-bold text-sm transition-all active:scale-95 hover:opacity-90"
              style={{
                background: "#FF6B35",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "50px",
              }}
            >
              Explore Toys 🚗
            </Link>
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-white/20"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.55)",
                padding: "12px 28px",
                borderRadius: "50px",
                backdropFilter: "blur(6px)",
              }}
            >
              View Bestsellers
            </Link>
          </div>
        </div>

        {/* Right side — decorative shapes when no banner image */}
        <div className="hidden md:flex justify-center items-center h-full relative">
          <div
            className="w-64 h-64 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <span style={{ fontSize: "5rem" }}>🧸</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (count === 0) {
    return (
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#2D1B69 0%,#6B3FA0 100%)",
          minHeight: "clamp(360px,55vw,520px)",
        }}
      >
        <FloatingDots />
        <FallbackHero />
      </section>
    );
  }

  /* ── Live banners from Supabase ─────────────── */
  const banner = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#2D1B69 0%,#6B3FA0 100%)",
        minHeight: "clamp(360px,55vw,520px)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FloatingDots />

      <div className="relative h-[400px] md:h-[520px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <div className="container mx-auto h-full flex items-center relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">

                {/* ── Text side ───────────────────── */}
                <div className="space-y-5 px-2 md:px-0 animate-fade-in">
                  {b.badge_text && (
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
                      style={{ background: "#FF6B35", color: "#fff" }}
                    >
                      {b.badge_text}
                    </span>
                  )}

                  <h1
                    className="font-display font-black leading-tight"
                    style={{
                      fontSize: "clamp(1.75rem,4.5vw,3.25rem)",
                      color: b.text_color === "dark" ? "#1A1A2E" : "#fff",
                    }}
                  >
                    {b.title}
                  </h1>

                  {b.subtitle && (
                    <p style={{
                      color: b.text_color === "dark"
                        ? "rgba(26,26,46,0.72)"
                        : "rgba(255,255,255,0.82)",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      maxWidth: "30rem",
                    }}>
                      {b.subtitle}
                    </p>
                  )}

                  {/* Free delivery pill — always shown */}
                  <p
                    className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      width: "fit-content",
                    }}
                  >
                    🚚 Free delivery across India on orders above ₹499
                  </p>

                  {/* CTA buttons */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      to={b.btn_link || "/products"}
                      className="inline-flex items-center gap-2 font-bold text-sm transition-all active:scale-95 hover:opacity-90"
                      style={{
                        background: "#FF6B35",
                        color: "#fff",
                        padding: "12px 28px",
                        borderRadius: "50px",
                      }}
                    >
                      {b.btn_text || "Explore Toys 🚗"}
                    </Link>
                    <Link
                      to="/products?sort=popular"
                      className="inline-flex items-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-white/20"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        border: "1.5px solid rgba(255,255,255,0.55)",
                        padding: "12px 28px",
                        borderRadius: "50px",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      View Bestsellers
                    </Link>
                  </div>
                </div>

                {/* ── Image side ──────────────────── */}
                <div className="hidden md:flex justify-center items-center h-full">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="max-h-[420px] w-auto object-contain"
                      style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div
                      className="w-64 h-64 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="w-44 h-44 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <span style={{ fontSize: "5rem" }}>🧸</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigation arrows ───────────────────── */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
            }}
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
            }}
            aria-label="Next banner"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}

      {/* ── Slide dots ──────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width:  i === current ? "24px" : "8px",
                height: "8px",
                background: i === current
                  ? "#FF6B35"
                  : "rgba(255,255,255,0.35)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default HeroBanner;
