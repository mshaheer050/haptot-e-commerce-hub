import { useState, useMemo } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Plus, Package, Pencil, Trash2, X, Save, LayoutDashboard,
  Search, Star, Sparkles, ShoppingBag, AlertCircle,
  ImageIcon, RefreshCw, LogOut, Lock, User, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAllProducts, useCategories } from "@/hooks/useProducts";
import { toast } from "sonner";

// ─── CREDENTIALS — change these anytime ───────────────────
const ADMIN_USERNAME = "haptot_admin";
const ADMIN_PASSWORD = "haptot@2025";
// ──────────────────────────────────────────────────────────

type ProductForm = {
  name: string; slug: string; price: string; original_price: string;
  category_id: string; age_group: string; image: string; images: string;
  description: string; badge: string; in_stock: boolean;
  is_featured: boolean; is_new_arrival: boolean; specs: string;
  rating: string; review_count: string;
};

const emptyForm: ProductForm = {
  name: "", slug: "", price: "", original_price: "", category_id: "",
  age_group: "", image: "", images: "", description: "", badge: "",
  in_stock: true, is_featured: false, is_new_arrival: false, specs: "[]",
  rating: "0", review_count: "0",
};

const AGE_GROUPS = ["0+ months", "3–12 months", "12+ months", "2+ years", "3+ years", "6+ years", "8+ years"];
const BADGES = ["", "Best Seller", "New", "Top Rated", "STEM Pick", "Popular", "Organic", "BPA Free", "Safe for Babies"];

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className={`rounded-2xl p-5 flex items-center gap-4 ${color}`}>
    <div className="w-11 h-11 rounded-xl bg-white/30 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-white font-display font-extrabold text-2xl leading-tight">{value}</p>
    </div>
  </div>
);

const Toggle = ({ checked, onChange, label }: any) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-primary" : "bg-muted"}`}
    title={label}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// ─── LOGIN SCREEN ──────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("haptot_admin_auth", "true");
        onLogin();
        toast.success("Welcome back, Admin! 👋");
      } else {
        setError("Invalid username or password. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-background to-pastel-orange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-foreground">Haptot Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to manage your store</p>
        </div>
        <div className="bg-card rounded-3xl border border-border shadow-card p-8 space-y-5">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}
          <button onClick={handleLogin} disabled={loading || !username || !password}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="bg-muted/50 rounded-xl p-3 text-center space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Default credentials</p>
            <p className="text-xs text-foreground font-mono">Username: <strong>haptot_admin</strong></p>
            <p className="text-xs text-foreground font-mono">Password: <strong>haptot@2025</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ROOT COMPONENT ────────────────────────────────────────
const AdminDashboard = () => {
  const isAuth = sessionStorage.getItem("haptot_admin_auth") === "true";
  const [loggedIn, setLoggedIn] = useState(isAuth);
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel onLogout={() => { sessionStorage.removeItem("haptot_admin_auth"); setLoggedIn(false); }} />;
};

// ─── ADMIN PANEL ───────────────────────────────────────────
const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const { data: products = [], isLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState<"products" | "dashboard">("dashboard");
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const set = (key: keyof ProductForm, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "image") setImagePreviewError(false);
  };

  const handleNameChange = (val: string) => {
    set("name", val);
    if (!editingId)
      set("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const stats = useMemo(() => ({
    total: products.length,
    featured: products.filter((p) => p.is_featured).length,
    newArrivals: products.filter((p) => p.is_new_arrival).length,
    outOfStock: products.filter((p) => !p.in_stock).length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()));
    if (filterCat) list = list.filter((p) => p.category_id === filterCat);
    if (filterStatus === "featured") list = list.filter((p) => p.is_featured);
    if (filterStatus === "new") list = list.filter((p) => p.is_new_arrival);
    if (filterStatus === "out") list = list.filter((p) => !p.in_stock);
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, filterCat, filterStatus, sortBy]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        category_id: form.category_id || null,
        age_group: form.age_group || null,
        image: form.image || null,
        images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
        description: form.description || null,
        badge: form.badge || null,
        in_stock: form.in_stock,
        is_featured: form.is_featured,
        is_new_arrival: form.is_new_arrival,
        rating: Number(form.rating) || 0,
        review_count: Number(form.review_count) || 0,
        specs: (() => { try { return JSON.parse(form.specs); } catch { return []; } })(),
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingId ? "✅ Product updated!" : "✅ Product added!");
      resetForm();
    },
    onError: (err: any) => toast.error("Error: " + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted!"); },
    onError: (err: any) => toast.error(err.message),
  });

  const quickToggle = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); setImagePreviewError(false); };

  const startEdit = (p: any) => {
    setForm({
      name: p.name, slug: p.slug, price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      category_id: p.category_id || "", age_group: p.age_group || "",
      image: p.image || "", images: (p.images ?? []).join(", "),
      description: p.description || "", badge: p.badge || "",
      in_stock: p.in_stock, is_featured: p.is_featured ?? false,
      is_new_arrival: p.is_new_arrival ?? false,
      specs: JSON.stringify(p.specs ?? [], null, 2),
      rating: String(p.rating ?? 0), review_count: String(p.review_count ?? 0),
    });
    setEditingId(p.id); setShowForm(true); setImagePreviewError(false);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition";
  const labelCls = "text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-extrabold text-foreground text-lg">Haptot Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex bg-muted rounded-xl p-1 gap-1">
              {(["dashboard", "products"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab}
                </button>
              ))}
            </nav>
            <button onClick={() => { resetForm(); setShowForm(true); setActiveTab("products"); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Add
            </button>
            <button onClick={onLogout} title="Sign out"
              className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-foreground">Overview</h1>
              <p className="text-muted-foreground text-sm mt-1">Your store at a glance</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={ShoppingBag} label="Total Products" value={stats.total} color="bg-gradient-to-br from-blue-500 to-blue-600" />
              <StatCard icon={Star} label="Featured" value={stats.featured} color="bg-gradient-to-br from-amber-400 to-orange-500" />
              <StatCard icon={Sparkles} label="New Arrivals" value={stats.newArrivals} color="bg-gradient-to-br from-violet-500 to-purple-600" />
              <StatCard icon={AlertCircle} label="Out of Stock" value={stats.outOfStock} color="bg-gradient-to-br from-rose-500 to-red-600" />
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">Products by Category</h2>
              <div className="space-y-3">
                {categories.map((cat: any) => {
                  const count = products.filter((p) => p.category_id === cat.id).length;
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-foreground">{cat.name}</span>
                        <span className="text-muted-foreground">{count} products</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-foreground">Recent Products</h2>
                <button onClick={() => setActiveTab("products")} className="text-primary text-sm font-semibold hover:underline">View all →</button>
              </div>
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    onError={(e: any) => { e.target.src = "/placeholder.svg"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category_name ?? "Uncategorized"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-foreground">₹{p.price}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-foreground">Products</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} of {products.length} products</p>
              </div>
              <button onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
                className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[180px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none min-w-[130px]">
                <option value="">All Categories</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none">
                <option value="">All Status</option>
                <option value="featured">Featured</option>
                <option value="new">New Arrivals</option>
                <option value="out">Out of Stock</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none">
                <option value="newest">Newest First</option>
                <option value="name">Name A–Z</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-[56px,1fr,110px,90px,90px,90px,72px] gap-3 px-5 py-3 border-b border-border bg-muted/40">
                {["", "Product", "Category", "Price", "Featured", "New Arrival", "Actions"].map((h) => (
                  <span key={h} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{h}</span>
                ))}
              </div>
              {isLoading && (
                <div className="p-16 text-center text-muted-foreground">
                  <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
                  Loading products...
                </div>
              )}
              {!isLoading && filtered.length === 0 && (
                <div className="p-16 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-semibold">No products found</p>
                </div>
              )}
              {filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-[56px,1fr,110px,90px,90px,90px,72px] gap-3 px-5 py-3.5 border-b border-border last:border-0 items-center hover:bg-muted/20 transition-colors">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-border"
                    onError={(e: any) => { e.target.src = "/placeholder.svg"; }} />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground truncate">{p.slug}</span>
                      {p.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary/15 text-secondary">{p.badge}</span>}
                      {!p.in_stock && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">Out of Stock</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{p.category_name ?? "—"}</span>
                  <div>
                    <span className="font-bold text-sm text-foreground">₹{p.price}</span>
                    {p.original_price && <span className="text-[10px] text-muted-foreground line-through ml-1">₹{p.original_price}</span>}
                  </div>
                  <Toggle checked={p.is_featured ?? false}
                    onChange={(v: boolean) => quickToggle.mutate({ id: p.id, field: "is_featured", value: v })} label="Featured" />
                  <Toggle checked={p.is_new_arrival ?? false}
                    onChange={(v: boolean) => quickToggle.mutate({ id: p.id, field: "is_new_arrival", value: v })} label="New Arrival" />
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(p)}
                      className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id); }}
                      className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 bg-foreground/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between px-7 py-5 border-b border-border">
              <div>
                <h2 className="font-display font-extrabold text-xl text-foreground">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{editingId ? "Update product details" : "Fill in product information"}</p>
              </div>
              <button onClick={resetForm} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-7 py-6 space-y-5">
              {form.image && !imagePreviewError ? (
                <div className="relative rounded-2xl overflow-hidden bg-muted h-40">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreviewError(true)} />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold bg-black/30 px-2 py-0.5 rounded-lg">Preview</span>
                </div>
              ) : (
                <div className="rounded-2xl bg-muted h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border">
                  <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground">Paste image URL below to preview</span>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Basic Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Product Name *</label>
                    <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Rainbow Stacking Rings" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (URL)</label>
                    <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Category *</label>
                    <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
                      <option value="">Select category</option>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Pricing</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Selling Price (₹) *</label><input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="599" className={inputCls} /></div>
                  <div><label className={labelCls}>Original Price (₹)</label><input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="799" className={inputCls} /></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Media</p>
                <div className="space-y-3">
                  <div><label className={labelCls}>Main Image URL *</label><input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls} /></div>
                  <div><label className={labelCls}>Additional Images (comma-separated)</label><input value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="https://img1.jpg, https://img2.jpg" className={inputCls} /></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Age Group</label><select value={form.age_group} onChange={(e) => set("age_group", e.target.value)} className={inputCls}><option value="">Select</option>{AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
                  <div><label className={labelCls}>Badge</label><select value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls}>{BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}</select></div>
                  <div><label className={labelCls}>Rating (0–5)</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} placeholder="4.5" className={inputCls} /></div>
                  <div><label className={labelCls}>Review Count</label><input type="number" min="0" value={form.review_count} onChange={(e) => set("review_count", e.target.value)} placeholder="128" className={inputCls} /></div>
                  <div className="col-span-2"><label className={labelCls}>Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description..." className={`${inputCls} resize-none`} /></div>
                  <div className="col-span-2"><label className={labelCls}>Specs (JSON)</label><textarea value={form.specs} onChange={(e) => set("specs", e.target.value)} rows={3} placeholder='[{"label":"Material","value":"Wood"}]' className={`${inputCls} resize-none font-mono text-xs`} /></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Visibility & Stock</p>
                <div className="grid grid-cols-3 gap-3">
                  {([["in_stock", "In Stock"], ["is_featured", "Featured"], ["is_new_arrival", "New Arrival"]] as const).map(([key, label]) => (
                    <div key={key} className={`rounded-xl border p-3 flex flex-col gap-2 ${form[key] ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
                      <span className="text-xs font-bold text-foreground">{label}</span>
                      <Toggle checked={form[key] as boolean} onChange={(v: boolean) => set(key, v)} label={label} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-7 py-5 border-t border-border flex gap-3">
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.price}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saveMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saveMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Save Product"}
              </button>
              <button onClick={resetForm} className="px-5 py-3 rounded-2xl bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
