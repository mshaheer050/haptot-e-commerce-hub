import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Package, Pencil, Trash2, X, Save, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAllProducts, useCategories } from "@/hooks/useProducts";
import { toast } from "sonner";

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  original_price: string;
  category_id: string;
  age_group: string;
  image: string;
  images: string;
  description: string;
  badge: string;
  in_stock: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  specs: string;
};

const emptyForm: ProductForm = {
  name: "", slug: "", price: "", original_price: "", category_id: "",
  age_group: "", image: "", images: "", description: "", badge: "",
  in_stock: true, is_featured: false, is_new_arrival: false, specs: "[]",
};

const AdminDashboard = () => {
  const { data: products = [], isLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const set = (key: keyof ProductForm, value: any) => setForm((f) => ({ ...f, [key]: value }));

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
      toast.success(editingId ? "Product updated!" : "Product added!");
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

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
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-900 text-2xl md:text-3xl text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{products.length} products</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-foreground/30 backdrop-blur-sm">
            <div className="bg-card rounded-3xl shadow-card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-800 text-xl text-foreground">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={resetForm} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Product Name *</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Rainbow Stacking Rings"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Slug</label>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-name"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Category *</label>
                  <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="599"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Original Price (₹)</label>
                  <input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="799"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Age Group</label>
                  <select value={form.age_group} onChange={(e) => set("age_group", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select age group</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6-10 years">6-10 years</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Badge</label>
                  <select value={form.badge} onChange={(e) => set("badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">None</option>
                    <option value="trending">Trending</option>
                    <option value="new">New</option>
                    <option value="bestseller">Bestseller</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Main Image URL *</label>
                  <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Additional Image URLs (comma-separated)</label>
                  <input value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="https://img1.jpg, https://img2.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Specs (JSON)</label>
                  <textarea value={form.specs} onChange={(e) => set("specs", e.target.value)} rows={3}
                    placeholder='[{"label":"Material","value":"Wood"}]'
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-6">
                  {([
                    ["in_stock", "In Stock"],
                    ["is_featured", "Featured"],
                    ["is_new_arrival", "New Arrival"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30" />
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.price}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  <Save className="w-4 h-4" /> {editingId ? "Update Product" : "Save Product"}
                </button>
                <button onClick={resetForm} className="px-5 py-3 rounded-2xl bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products list */}
        <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto] md:grid-cols-[80px,1fr,120px,100px,100px,80px] gap-4 px-6 py-3 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="hidden md:block">Image</span>
            <span>Product</span>
            <span className="hidden md:block">Category</span>
            <span>Price</span>
            <span className="hidden md:block">Status</span>
            <span>Actions</span>
          </div>

          {isLoading && <div className="p-12 text-center text-muted-foreground">Loading...</div>}

          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr,auto,auto,auto] md:grid-cols-[80px,1fr,120px,100px,100px,80px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-muted/30 transition-colors">
              <div className="hidden md:block">
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-700 text-sm text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">{p.slug}</p>
              </div>
              <span className="hidden md:block text-xs text-muted-foreground">{p.category_name ?? "—"}</span>
              <span className="font-display font-700 text-sm text-foreground">₹{p.price}</span>
              <div className="hidden md:flex gap-1.5">
                {p.is_featured && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">Featured</span>}
                {p.is_new_arrival && <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold">New</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p.id); }}
                  className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {!isLoading && products.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
