import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-card border border-border overflow-hidden card-hover flex flex-col">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-soft">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-primary-foreground shadow-soft" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(340 75% 55%))" }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-foreground" />
        </button>

        {/* Quick add */}
        <button
          onClick={(e) => { e.preventDefault(); addItem(product); }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full btn-gradient text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i <= Math.round(product.rating) ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`}
            />
          ))}
          {product.review_count > 0 && (
            <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">({product.review_count})</span>
          )}
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-bold text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2 mb-3">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-baseline gap-2.5">
          <span className="font-display font-black text-lg text-foreground">₹{product.price}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.original_price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
