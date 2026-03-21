import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="py-10 md:py-14">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-800 text-xl md:text-2xl text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Link to={viewAllLink} className="text-sm font-semibold text-primary hover:underline mr-2 hidden md:block">
              View All
            </Link>
            <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll(1)} className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-1.5 px-1.5">
          {products.map((p) => (
            <div key={p.id} className="min-w-[220px] max-w-[240px] snap-start flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductScroller;
