import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

const CartDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-800 text-base">Shopping Cart ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium text-sm">Your cart is empty</p>
              <button onClick={onClose} className="text-primary font-semibold text-sm hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 rounded-xl border border-border">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                    <p className="text-primary font-bold text-sm mt-0.5">₹{item.product.price}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="self-start p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="font-display font-800 text-lg">₹{totalPrice()}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full py-3 rounded-lg bg-primary text-primary-foreground text-center font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>
            <button onClick={onClose} className="block w-full py-2.5 rounded-lg border border-border text-center font-semibold text-sm hover:bg-muted transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
