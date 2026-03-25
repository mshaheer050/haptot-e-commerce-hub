import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

const ProductScroller = ({
  title,
  subtitle,
  products,
  viewAllLink = "/products",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-xl md:text-3xl text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Link to={viewAllLink} className="text-sm font-bold text-primary hover:underline mr-1 hidden md:inline-flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-2xl border border-border bg-card flex items-center justify-center hover:bg-muted hover:shadow-soft transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll(1)} className="w-10 h-10 rounded-2xl border border-border bg-card flex items-center justify-center hover:bg-muted hover:shadow-soft transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={ref} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-2 px-2">
          {products.map((p) => (
            <div key={p.id} className="min-w-[230px] max-w-[250px] snap-start flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductScroller;
