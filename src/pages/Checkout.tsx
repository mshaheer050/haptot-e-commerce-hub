import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

const Checkout = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h1 className="font-display font-800 text-3xl text-foreground">Your cart is empty</h1>
        <Link to="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto">
        <h1 className="font-display font-900 text-3xl md:text-4xl text-foreground mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 rounded-3xl bg-card shadow-soft">
                <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-display font-700 text-sm text-foreground">{item.product.name}</h3>
                  <p className="text-primary font-bold mt-1">₹{item.product.price}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.product.id)} className="ml-auto p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-card rounded-3xl shadow-soft p-6 h-fit space-y-4 sticky top-24">
            <h2 className="font-display font-800 text-lg text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{totalPrice()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold text-accent">{totalPrice() >= 499 ? "Free" : "₹49"}</span></div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-display font-700">Total</span>
              <span className="font-display font-900 text-2xl text-foreground">₹{totalPrice() + (totalPrice() >= 499 ? 0 : 49)}</span>
            </div>
            <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              Place Order
            </button>
            <p className="text-[10px] text-center text-muted-foreground">Secure payment powered by Razorpay</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
