import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Check, Truck, Shield, RotateCcw, Minus, Plus, Heart, Share2 } from "lucide-react";
import { useProductBySlug, useFeaturedProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/ProductCard";

const tabs = ["Description", "Specifications", "Reviews"];

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProductBySlug(slug || "");
  const { data: related = [] } = useFeaturedProducts();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-card bg-muted animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-muted rounded-full animate-pulse" />
            <div className="h-8 w-3/4 bg-muted rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link to="/products" className="text-primary font-bold mt-4 inline-block hover:underline">Back to Products</Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-border">›</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span className="text-border">›</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-card overflow-hidden bg-muted border border-border shadow-card">
              <img
                src={product.images[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      i === selectedImage ? "border-primary shadow-soft scale-105" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              {product.category_name && (
                <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-3">
                  {product.category_name}
                </span>
              )}
              <h1 className="font-display font-black text-2xl md:text-4xl text-foreground leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 p-5 rounded-card bg-muted/50 border border-border">
              <span className="font-display font-black text-4xl text-foreground">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.original_price}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(340 75% 55%))" }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-2xl bg-card">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors rounded-l-2xl">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-11 flex items-center justify-center font-bold text-sm border-x border-border">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors rounded-r-2xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added ? "bg-primary/10 text-primary" : "btn-gradient"
                }`}
              >
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
              <button className="w-11 h-11 rounded-2xl border border-border flex items-center justify-center hover:bg-pastel-pink hover:border-accent transition-all">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <button className="w-full py-3.5 rounded-2xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Buy Now
            </button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: "Free Shipping", surface: "bg-pastel-green" },
                { icon: Shield, text: "Safe & Certified", surface: "bg-pastel-blue" },
                { icon: RotateCcw, text: "Easy Returns", surface: "bg-pastel-orange" },
              ].map((t) => (
                <div key={t.text} className={`flex flex-col items-center text-center p-4 rounded-2xl ${t.surface} border border-border`}>
                  <t.icon className="w-5 h-5 text-primary mb-2" />
                  <span className="text-[10px] font-bold text-foreground">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex gap-1 bg-muted rounded-2xl p-1 w-fit">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === i ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab === 0 && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{product.description || "No description available."}</p>
            )}
            {activeTab === 1 && (
              <div className="max-w-lg">
                {product.specs.length > 0 ? product.specs.map((spec, i) => (
                  <div key={i} className={`flex justify-between px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-muted/50 rounded-xl" : ""}`}>
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-bold text-foreground">{spec.value}</span>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No specifications available.</p>}
              </div>
            )}
            {activeTab === 2 && (
              <p className="text-sm text-muted-foreground">Reviews coming soon.</p>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-black text-xl md:text-2xl text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
