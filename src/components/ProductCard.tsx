import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-background rounded-2xl border border-border overflow-hidden card-hover flex flex-col">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-[hsl(var(--badge-sale))] text-[hsl(0,0%,100%)] text-[10px] font-bold">
            -{discount}%
          </span>
        )}
        {/* Quick add overlay */}
        <button
          onClick={(e) => { e.preventDefault(); addItem(product); }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-card"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`}
            />
          ))}
          {product.review_count > 0 && (
            <span className="text-[10px] text-muted-foreground ml-1">({product.review_count})</span>
          )}
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-700 text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-display font-800 text-base text-foreground">₹{product.price}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.original_price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
