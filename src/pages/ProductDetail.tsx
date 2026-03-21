import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
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
    return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link to="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">Back to Products</Link>
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
    <main className="py-6 md:py-10">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
              <img
                src={product.images[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              {product.category_name && (
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  {product.category_name}
                </p>
              )}
              <h1 className="font-display font-900 text-2xl md:text-3xl text-foreground">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-900 text-3xl text-foreground">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.original_price}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[hsl(var(--badge-sale))]/10 text-[hsl(var(--badge-sale))] text-xs font-bold">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-bold text-sm border-x border-border">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                }`}
              >
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>

            <button className="w-full py-3 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all">
              Buy Now
            </button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "Safe & Certified" },
                { icon: RotateCcw, text: "Easy Returns" },
              ].map((t) => (
                <div key={t.text} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50 border border-border">
                  <t.icon className="w-4 h-4 text-primary mb-1" />
                  <span className="text-[10px] font-semibold text-muted-foreground">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-border">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === 0 && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{product.description || "No description available."}</p>
            )}
            {activeTab === 1 && (
              <div className="max-w-lg">
                {product.specs.length > 0 ? product.specs.map((spec, i) => (
                  <div key={i} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-muted/50" : ""} rounded-lg`}>
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold text-foreground">{spec.value}</span>
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
          <div className="mt-8">
            <h2 className="font-display font-800 text-xl text-foreground mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
