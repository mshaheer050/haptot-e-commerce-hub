import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, CreditCard, Truck, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const Checkout = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [step, setStep] = useState(1);

  // ── Form fields ──────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: "",
  });

  // ── Pincode autofill state ───────────────────────────
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pincodeMessage, setPincodeMessage] = useState("");

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Pincode lookup ───────────────────────────────────
  const handlePincodeChange = async (value: string) => {
    // Only allow numbers, max 6 digits
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    handleFormChange("pincode", cleaned);

    // Clear city/district/state if pincode is cleared or incomplete
    if (cleaned.length < 6) {
      handleFormChange("city", "");
      handleFormChange("district", "");
      handleFormChange("state", "");
      setPincodeStatus("idle");
      setPincodeMessage("");
      return;
    }

    // Fetch when exactly 6 digits entered
    setPincodeStatus("loading");
    setPincodeMessage("Looking up your location...");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`);
      const data = await res.json();

      if (
        data &&
        data[0]?.Status === "Success" &&
        data[0]?.PostOffice?.length > 0
      ) {
        const po = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          pincode: cleaned,
          city: po.Division || po.Block || po.Name || "",
          district: po.District || "",
          state: po.State || "",
        }));
        setPincodeStatus("success");
        setPincodeMessage("Location found — verify if needed");
      } else {
        setForm((prev) => ({
          ...prev,
          pincode: cleaned,
          city: "",
          district: "",
          state: "",
        }));
        setPincodeStatus("error");
        setPincodeMessage("Invalid pincode, please check");
      }
    } catch {
      setPincodeStatus("error");
      setPincodeMessage("Could not fetch location. Please fill manually.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h1 className="font-display font-800 text-2xl text-foreground">Your cart is empty</h1>
        <Link to="/products" className="text-primary font-semibold mt-4 inline-block hover:underline">
          Continue Shopping
        </Link>
      </main>
    );
  }

  const shipping = totalPrice() >= 499 ? 0 : 49;

  // ── Shared input class ───────────────────────────────
  const inputClass =
    "px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full";

  return (
    <main className="py-6 md:py-10">
      <div className="container mx-auto">
        <h1 className="font-display font-900 text-2xl md:text-3xl text-foreground mb-6">Checkout</h1>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Cart", "Shipping", "Payment"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i + 1)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  step >= i + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
              <span
                className={`text-sm font-semibold hidden sm:block ${
                  step >= i + 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div className={`w-8 md:w-16 h-px ${step > i + 1 ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── STEP 1: Cart review ───────────────────── */}
            {step === 1 && (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl bg-background border border-border"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-display font-700 text-sm text-foreground">
                        {item.product.name}
                      </h3>
                      <p className="text-primary font-bold mt-1 text-sm">₹{item.product.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 mt-4"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* ── STEP 2: Shipping address ──────────────── */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display font-700 text-lg text-foreground">Shipping Address</h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <input
                    placeholder="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <input
                    placeholder="Address Line 1"
                    value={form.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className={`${inputClass} sm:col-span-2`}
                  />

                  {/* ── PIN Code with autofill ── */}
                  <div className="sm:col-span-2 space-y-1">
                    <div className="relative">
                      <input
                        placeholder="PIN Code (6 digits)"
                        value={form.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        maxLength={6}
                        className={`${inputClass} pr-10`}
                      />
                      {/* Status icon inside input */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pincodeStatus === "loading" && (
                          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                        )}
                        {pincodeStatus === "success" && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {pincodeStatus === "error" && (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </div>

                    {/* Status message below pincode */}
                    {pincodeMessage && (
                      <p
                        className={`text-xs font-medium flex items-center gap-1 ${
                          pincodeStatus === "success"
                            ? "text-green-600"
                            : pincodeStatus === "error"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {pincodeMessage}
                      </p>
                    )}
                  </div>

                  {/* City — auto-filled but editable */}
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className={inputClass}
                  />

                  {/* District — auto-filled but editable */}
                  <input
                    placeholder="District"
                    value={form.district}
                    onChange={(e) => handleFormChange("district", e.target.value)}
                    className={inputClass}
                  />

                  {/* State — auto-filled but editable */}
                  <input
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className={`${inputClass} sm:col-span-2`}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg border border-border font-semibold text-sm hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Payment ───────────────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display font-700 text-lg text-foreground">Payment</h2>
                <div className="space-y-3">
                  {[
                    { label: "UPI / Net Banking", icon: ShieldCheck },
                    { label: "Credit / Debit Card", icon: CreditCard },
                    { label: "Cash on Delivery", icon: Truck },
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors"
                    >
                      <input type="radio" name="payment" className="accent-[hsl(var(--primary))]" />
                      <opt.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Secure Payment", "Free Returns", "100% Genuine"].map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-semibold border border-green-100"
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-lg border border-border font-semibold text-sm hover:bg-muted"
                  >
                    Back
                  </button>
                  <button className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90">
                    Place Order — ₹{totalPrice() + shipping}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ─────────────────── */}
          <div className="bg-muted/50 rounded-xl border border-border p-5 h-fit sticky top-24 space-y-4">
            <h2 className="font-display font-700 text-sm text-foreground">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
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
                <span className="font-semibold text-primary">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-display font-700 text-sm">Total</span>
              <span className="font-display font-900 text-xl text-foreground">
                ₹{totalPrice() + shipping}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
