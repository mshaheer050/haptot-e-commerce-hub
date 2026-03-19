import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug || "");
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link to="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">Back to Products</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {product.category === "babycare" ? "Baby Care" : product.category === "stationery" ? "Stationery" : "Toys"} · {product.ageGroup}
              </p>
              <h1 className="font-display font-900 text-3xl md:text-4xl text-foreground">{product.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display font-900 text-3xl text-foreground">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Specs */}
            <div className="border border-border rounded-2xl overflow-hidden">
              {product.specs.map((spec, i) => (
                <div key={i} className={`flex justify-between px-5 py-3 text-sm ${i !== product.specs.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground font-medium">{spec.label}</span>
                  <span className="font-semibold text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={added}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added to Cart</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "Safe & Certified" },
                { icon: RotateCcw, text: "Easy Returns" },
              ].map((t) => (
                <div key={t.text} className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/50">
                  <t.icon className="w-4 h-4 text-primary mb-1.5" />
                  <span className="text-[10px] font-semibold text-muted-foreground">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
