import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

const badgeColors: Record<string, string> = {
  trending: "bg-secondary text-secondary-foreground",
  new: "bg-accent text-accent-foreground",
  bestseller: "bg-primary text-primary-foreground",
};

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const categoryLabel = product.category_name ?? "Uncategorized";

  return (
    <div className="group bg-card rounded-3xl shadow-soft overflow-hidden card-hover flex flex-col">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColors[product.badge] ?? "bg-muted text-muted-foreground"}`}>
            {product.badge}
          </span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {categoryLabel}{product.age_group ? ` · ${product.age_group}` : ""}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display font-700 text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-2">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          <span className="text-xs font-bold text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.review_count})</span>
        </div>
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <span className="font-display font-800 text-lg text-foreground">₹{product.price}</span>
            {product.original_price && (
              <span className="text-xs text-muted-foreground line-through ml-2">₹{product.original_price}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
