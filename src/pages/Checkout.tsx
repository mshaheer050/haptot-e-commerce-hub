import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, CreditCard, Truck, ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [step, setStep] = useState(1);

  if (items.length === 0) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h1 className="font-display font-800 text-2xl text-foreground">Your cart is empty</h1>
        <Link to="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">Continue Shopping</Link>
      </main>
    );
  }

  const shipping = totalPrice() >= 499 ? 0 : 49;

  return (
    <main className="py-6 md:py-10">
      <div className="container mx-auto">
        <h1 className="font-display font-900 text-2xl md:text-3xl text-foreground mb-6">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Cart", "Shipping", "Payment"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i + 1)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
              <span className={`text-sm font-semibold hidden sm:block ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < 2 && <div className={`w-8 md:w-16 h-px ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 rounded-xl bg-background border border-border">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-display font-700 text-sm text-foreground">{item.product.name}</h3>
                      <p className="text-primary font-bold mt-1 text-sm">₹{item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 mt-4">
                  Continue to Shipping
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display font-700 text-lg text-foreground">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input placeholder="First Name" className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="Last Name" className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="Email" className="sm:col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="Phone" className="sm:col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="Address Line 1" className="sm:col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="City" className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="PIN Code" className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input placeholder="State" className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-border font-semibold text-sm hover:bg-muted">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display font-700 text-lg text-foreground">Payment</h2>
                <div className="space-y-3">
                  {[
                    { label: "Credit / Debit Card", icon: CreditCard },
                    { label: "UPI / Net Banking", icon: ShieldCheck },
                    { label: "Cash on Delivery", icon: Truck },
                  ].map((opt) => (
                    <label key={opt.label} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors">
                      <input type="radio" name="payment" className="accent-[hsl(var(--primary))]" />
                      <opt.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-border font-semibold text-sm hover:bg-muted">
                    Back
                  </button>
                  <button className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90">
                    Place Order — ₹{totalPrice() + shipping}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-muted/50 rounded-xl border border-border p-5 h-fit sticky top-24 space-y-4">
            <h2 className="font-display font-700 text-sm text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate mr-2">{item.product.name} × {item.quantity}</span>
                  <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{totalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-primary">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-display font-700 text-sm">Total</span>
              <span className="font-display font-900 text-xl text-foreground">₹{totalPrice() + shipping}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
