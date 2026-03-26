import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User, Package, RotateCcw, LogOut, Loader2, Save,
  ChevronRight, Clock, CheckCircle2, Truck, XCircle, MessageCircle
} from "lucide-react";

type Order = {
  id: string; order_number: string; status: string;
  items: any[]; total: number; shipping_address: any;
  created_at: string;
};
type ReturnRequest = {
  id: string; order_id: string; reason: string;
  request_type: string; status: string; admin_notes: string | null;
  created_at: string;
};
type Profile = { id: string; full_name: string | null; phone: string | null; address: string | null };

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: Clock },
  shipped: { label: "Shipped", color: "bg-amber-100 text-amber-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  returned: { label: "Returned", color: "bg-purple-100 text-purple-700", icon: RotateCcw },
};

const returnStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Approval", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
  waiting_proof: { label: "Waiting for Video Proof", color: "bg-blue-100 text-blue-700" },
};

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "returns" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [returnModal, setReturnModal] = useState<Order | null>(null);
  const [returnForm, setReturnForm] = useState({ reason: "", request_type: "return" });
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      await loadData(session.user.id);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async (userId: string) => {
    const [ordersRes, returnsRes, profileRes] = await Promise.all([
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("return_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("id", userId).single(),
    ]);
    setOrders((ordersRes.data as Order[]) || []);
    setReturns((returnsRes.data as ReturnRequest[]) || []);
    if (profileRes.data) {
      const p = profileRes.data as Profile;
      setProfile(p);
      setProfileForm({ full_name: p.full_name || "", phone: p.phone || "", address: p.address || "" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profileForm.full_name,
      phone: profileForm.phone,
      address: profileForm.address,
    });
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
    setSaving(false);
  };

  const submitReturn = async () => {
    if (!returnModal || !user) return;
    setSubmittingReturn(true);
    const { error } = await supabase.from("return_requests").insert({
      order_id: returnModal.id,
      user_id: user.id,
      reason: returnForm.reason,
      request_type: returnForm.request_type,
    });
    if (error) { toast.error(error.message); setSubmittingReturn(false); return; }
    setReturnSuccess(true);
    setSubmittingReturn(false);
    await loadData(user.id);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const tabs = [
    { key: "orders" as const, label: "My Orders", icon: Package, count: orders.length },
    { key: "returns" as const, label: "Returns", icon: RotateCcw, count: returns.length },
    { key: "profile" as const, label: "Profile", icon: User },
  ];

  const inputCls = "w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl text-foreground">My Account</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-border text-sm font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-2xl p-1 gap-1 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-semibold text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Your orders will appear here</p>
                <button onClick={() => navigate("/products")} className="mt-4 px-6 py-2.5 rounded-2xl btn-gradient text-sm font-semibold">
                  Start Shopping
                </button>
              </div>
            ) : orders.map((order) => {
              const sc = statusConfig[order.status] || statusConfig.processing;
              const StatusIcon = sc.icon;
              const hasReturn = returns.some((r) => r.order_id === order.id);
              return (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-sm text-foreground">Order #{order.order_number}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${sc.color}`}>
                      <StatusIcon className="w-3 h-3" /> {sc.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-3">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="font-display font-bold text-sm">Total: ₹{order.total}</p>
                    {(order.status === "delivered" || order.status === "shipped") && !hasReturn && (
                      <button
                        onClick={() => { setReturnModal(order); setReturnSuccess(false); setReturnForm({ reason: "", request_type: "return" }); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Request Return
                      </button>
                    )}
                    {hasReturn && (
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Return requested
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Returns Tab */}
        {tab === "returns" && (
          <div className="space-y-3">
            {returns.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <RotateCcw className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-semibold text-muted-foreground">No return requests</p>
              </div>
            ) : returns.map((ret) => {
              const rs = returnStatusConfig[ret.status] || returnStatusConfig.pending;
              const order = orders.find((o) => o.id === ret.order_id);
              return (
                <div key={ret.id} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {ret.request_type === "replacement" ? "Replacement" : "Return"} Request
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Order #{order?.order_number || "—"} • {new Date(ret.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${rs.color}`}>
                      {rs.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Reason: {ret.reason}</p>
                  {ret.admin_notes && (
                    <div className="bg-muted/50 rounded-xl p-3 text-sm text-foreground">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Admin Response:</p>
                      {ret.admin_notes}
                    </div>
                  )}
                  {(ret.status === "pending" || ret.status === "waiting_proof") && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-green-800">
                        <p className="font-semibold">Send unboxing video for faster processing</p>
                        <p className="mt-1">WhatsApp: <a href="https://wa.me/919497809094" className="font-bold underline">+91 9497809094</a></p>
                        <p>Include your order number: <strong>{order?.order_number}</strong></p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-foreground">Edit Profile</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Full Name</label>
              <input value={profileForm.full_name} onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))} className={inputCls} placeholder="Your full name" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone</label>
              <input value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Address</label>
              <textarea value={profileForm.address} onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))} className={`${inputCls} min-h-[80px]`} placeholder="Your delivery address" />
            </div>
            <button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl btn-gradient font-semibold text-sm disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md">
            {!returnSuccess ? (
              <>
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="font-display font-bold text-lg text-foreground">Request Return / Replacement</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Order #{returnModal.order_number}</p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Request Type</label>
                    <select value={returnForm.request_type} onChange={(e) => setReturnForm((f) => ({ ...f, request_type: e.target.value }))} className={inputCls}>
                      <option value="return">Return & Refund</option>
                      <option value="replacement">Replacement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Reason</label>
                    <textarea value={returnForm.reason} onChange={(e) => setReturnForm((f) => ({ ...f, reason: e.target.value }))}
                      className={`${inputCls} min-h-[80px]`} placeholder="Please describe the issue..." required />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-border flex gap-3">
                  <button onClick={submitReturn} disabled={submittingReturn || !returnForm.reason.trim()}
                    className="flex-1 py-3 rounded-2xl btn-gradient font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-1.5">
                    {submittingReturn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Submit Request
                  </button>
                  <button onClick={() => setReturnModal(null)} className="px-5 py-3 rounded-2xl bg-muted text-muted-foreground font-semibold text-sm hover:bg-muted/80">Cancel</button>
                </div>
              </>
            ) : (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="font-display font-bold text-lg text-foreground mb-2">Request Submitted!</h2>
                <p className="text-sm text-muted-foreground mb-4">Your {returnForm.request_type} request has been submitted and is pending admin approval.</p>
                
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-left mb-6">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-bold mb-1">Important: Send Video Proof</p>
                      <p>To process your {returnForm.request_type}, please send your unboxing video and order number to WhatsApp:</p>
                      <a href="https://wa.me/919497809094" className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors">
                        <MessageCircle className="w-4 h-4" /> +91 9497809094
                      </a>
                    </div>
                  </div>
                </div>

                <button onClick={() => setReturnModal(null)} className="px-6 py-3 rounded-2xl btn-gradient font-semibold text-sm">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MyAccount;
