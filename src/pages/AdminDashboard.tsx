import { useState, useMemo, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Plus, Package, Pencil, Trash2, X, Save, LayoutDashboard,
  Search, Star, Sparkles, ShoppingBag, AlertCircle,
  RefreshCw, LogOut, Lock, User, Eye, EyeOff,
  Upload, Link, Tag, Globe, ChevronRight,
  PlusCircle, Grip, Image as ImageIcon, Layers,
  ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Monitor,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAllProducts, useCategories } from "@/hooks/useProducts";
import { toast } from "sonner";

const ADMIN_USERNAME = "haptot_admin";
const ADMIN_PASSWORD = "haptot@2025";

const AGE_GROUPS = ["0+ months", "3–12 months", "12+ months", "2+ years", "3+ years", "6+ years", "8+ years"];
const BADGES = ["", "Best Seller", "New", "Top Rated", "STEM Pick", "Popular", "Organic", "BPA Free", "Safe for Babies"];
const MAX_BANNERS = 6;

type Spec = { label: string; value: string };
type ProductForm = {
  name: string; slug: string; price: string; original_price: string;
  category_id: string; age_group: string; image: string; images: string[];
  description: string; badge: string; in_stock: boolean;
  is_featured: boolean; is_new_arrival: boolean; specs: Spec[];
  rating: string; review_count: string;
  tags: string[]; seo_title: string; seo_description: string; seo_keywords: string;
};
type BannerForm = {
  title: string; subtitle: string; image: string; badge_text: string;
  btn_text: string; btn_link: string; btn_link_type: string; btn_style: string;
  text_color: string; overlay: boolean; is_active: boolean;
};

const emptyProductForm: ProductForm = {
  name: "", slug: "", price: "", original_price: "", category_id: "",
  age_group: "", image: "", images: [], description: "", badge: "",
  in_stock: true, is_featured: false, is_new_arrival: false,
  specs: [{ label: "", value: "" }], rating: "0", review_count: "0",
  tags: [], seo_title: "", seo_description: "", seo_keywords: "",
};
const emptyBannerForm: BannerForm = {
  title: "", subtitle: "", image: "", badge_text: "",
  btn_text: "Shop Now", btn_link: "/products", btn_link_type: "url",
  btn_style: "primary", text_color: "dark", overlay: false, is_active: true,
};

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-muted-foreground/50";
const labelCls = "text-xs font-semibold text-muted-foreground mb-1.5 block";

// ── SHARED COMPONENTS ──────────────────────────────────────
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
  <button onClick={() => onChange(!checked)} title={label}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-primary" : "bg-border"}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const SectionCard = ({ title, icon: Icon, children }: any) => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden">
    <div className="px-5 py-4 border-b border-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const TagsInput = ({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) => {
  const [input, setInput] = useState("");
  const addTag = () => { const t = input.trim().toLowerCase(); if (t && !tags.includes(t)) onChange([...tags, t]); setInput(""); };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {t}<button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-destructive ml-0.5"><X className="w-3 h-3" /></button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-muted-foreground/50 py-1">No tags yet</span>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder="Type a tag and press Enter" className={inputCls} />
        <button onClick={addTag} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors whitespace-nowrap">Add</button>
      </div>
    </div>
  );
};

const SpecsEditor = ({ specs, onChange }: { specs: Spec[]; onChange: (s: Spec[]) => void }) => {
  const update = (i: number, key: keyof Spec, val: string) => onChange(specs.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const remove = (i: number) => onChange(specs.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr,1fr,32px] gap-2 mb-1">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Spec Name</span>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Value</span>
        <span />
      </div>
      {specs.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr,1fr,32px] gap-2 items-center">
          <input value={s.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="e.g. Material" className={inputCls} />
          <input value={s.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="e.g. Wood" className={inputCls} />
          <button onClick={() => remove(i)} disabled={specs.length === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...specs, { label: "", value: "" }])}
        className="mt-1 inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
        <PlusCircle className="w-4 h-4" /> Add another spec
      </button>
      <p className="text-[11px] text-muted-foreground">Examples: Material → Wood | Age → 3+ years | Scale → 1:36</p>
    </div>
  );
};

const ImageUploader = ({ image, onImageChange, height = "h-44" }: { image: string; onImageChange: (url: string) => void; height?: string }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(image);
  const [previewError, setPreviewError] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      onImageChange(data.publicUrl); setUrlInput(data.publicUrl); setPreviewError(false);
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed — create 'product-images' bucket in Supabase Storage first"); }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {image && !previewError ? (
        <div className={`relative rounded-2xl overflow-hidden bg-muted ${height} group`}>
          <img src={image} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewError(true)} />
          <button onClick={() => { onImageChange(""); setUrlInput(""); setPreviewError(false); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive">
            <X className="w-4 h-4" />
          </button>
          <span className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-black/40 px-2.5 py-1 rounded-lg">Image ✓</span>
        </div>
      ) : (
        <div className={`rounded-2xl bg-muted/50 ${height === "h-44" ? "h-28" : "h-20"} flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border`}>
          <ImageIcon className="w-7 h-7 text-muted-foreground/30" />
          <span className="text-xs text-muted-foreground">No image selected</span>
        </div>
      )}
      <div className="flex bg-muted rounded-xl p-1 gap-1">
        {(["upload", "url"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            {t === "upload" ? <Upload className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
            {t === "upload" ? "Upload" : "URL"}
          </button>
        ))}
      </div>
      {tab === "upload" && (
        <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><RefreshCw className="w-5 h-5 text-primary animate-spin" /><p className="text-sm text-primary font-semibold">Uploading...</p></div>
          ) : (
            <div className="flex flex-col items-center gap-2"><Upload className="w-5 h-5 text-muted-foreground" /><p className="text-sm font-semibold text-foreground">Click or drag photo</p><p className="text-xs text-muted-foreground">JPG, PNG, WebP — max 5MB</p></div>
          )}
        </div>
      )}
      {tab === "url" && (
        <div className="flex gap-2">
          <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://images.unsplash.com/..." className={inputCls} />
          <button onClick={() => { onImageChange(urlInput); setPreviewError(false); }}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 whitespace-nowrap">Use</button>
        </div>
      )}
    </div>
  );
};

// ── LOGIN ──────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    if (!username || !password) return;
    setLoading(true); setError("");
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) { sessionStorage.setItem("haptot_admin_auth", "true"); onLogin(); toast.success("Welcome back! 👋"); }
      else setError("Wrong username or password.");
      setLoading(false);
    }, 600);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-background to-pastel-orange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg"><LayoutDashboard className="w-8 h-8 text-primary-foreground" /></div>
          <h1 className="font-display font-extrabold text-3xl text-foreground">Haptot Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to manage your store</p>
        </div>
        <div className="bg-card rounded-3xl border border-border shadow-card p-8 space-y-5">
          <div>
            <label className={labelCls}>Username</label>
            <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20"><AlertCircle className="w-4 h-4 text-destructive" /><p className="text-destructive text-sm">{error}</p></div>}
          <button onClick={handleLogin} disabled={loading || !username || !password}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}{loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="bg-muted/60 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground font-semibold mb-1">Default credentials</p>
            <p className="text-xs font-mono text-foreground">Username: <strong>haptot_admin</strong></p>
            <p className="text-xs font-mono text-foreground">Password: <strong>haptot@2025</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("haptot_admin_auth") === "true");
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <AdminPanel onLogout={() => { sessionStorage.removeItem("haptot_admin_auth"); setLoggedIn(false); }} />;
};

// ── BANNER MANAGER ─────────────────────────────────────────
const BannerManager = () => {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerForm, setBannerForm] = useState<BannerForm>(emptyBannerForm);
  const [showBannerForm, setShowBannerForm] = useState(false);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("banners").select("*").order("position");
      if (error) throw error;
      return data ?? [];
    },
  });

  const setBF = (key: keyof BannerForm, value: any) => setBannerForm((f) => ({ ...f, [key]: value }));

  const saveBanner = useMutation({
    mutationFn: async () => {
      const payload = { ...bannerForm, position: editingBanner?.position ?? (banners.length + 1) };
      if (editingBanner?.id) {
        const { error } = await supabase.from("banners").update(payload).eq("id", editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["banners"] }); toast.success(editingBanner?.id ? "Banner updated!" : "Banner added!"); setShowBannerForm(false); setEditingBanner(null); setBannerForm(emptyBannerForm); },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("banners").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["banners"] }); toast.success("Banner deleted!"); },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => { const { error } = await supabase.from("banners").update({ is_active: val }).eq("id", id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  const movePosition = useMutation({
    mutationFn: async ({ id, dir, currentPos }: { id: string; dir: "up" | "down"; currentPos: number }) => {
      const swapPos = dir === "up" ? currentPos - 1 : currentPos + 1;
      const swapBanner = banners.find((b: any) => b.position === swapPos);
      if (!swapBanner) return;
      await supabase.from("banners").update({ position: swapPos }).eq("id", id);
      await supabase.from("banners").update({ position: currentPos }).eq("id", swapBanner.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  const openEdit = (b: any) => {
    setEditingBanner(b);
    setBannerForm({ title: b.title ?? "", subtitle: b.subtitle ?? "", image: b.image ?? "", badge_text: b.badge_text ?? "", btn_text: b.btn_text ?? "", btn_link: b.btn_link ?? "", btn_link_type: b.btn_link_type ?? "url", btn_style: b.btn_style ?? "primary", text_color: b.text_color ?? "dark", overlay: b.overlay ?? false, is_active: b.is_active ?? true });
    setShowBannerForm(true);
  };

  const activeBanners = banners.filter((b: any) => b.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground">Banners</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{activeBanners} active · {banners.length}/{MAX_BANNERS} slots used</p>
        </div>
        <button onClick={() => { setEditingBanner(null); setBannerForm(emptyBannerForm); setShowBannerForm(true); }}
          disabled={banners.length >= MAX_BANNERS}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Slot indicator */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Banner Slots</p>
          <span className="text-xs text-muted-foreground">{banners.length}/{MAX_BANNERS} used</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: MAX_BANNERS }).map((_, i) => {
            const b = banners.find((x: any) => x.position === i + 1);
            return (
              <div key={i} className={`h-16 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold gap-1 border-2 transition-all ${b ? (b.is_active ? "border-primary/40 bg-primary/8 text-primary" : "border-border bg-muted/50 text-muted-foreground") : "border-dashed border-border bg-muted/20 text-muted-foreground/40"}`}>
                <Layers className="w-4 h-4" />
                <span>{b ? (b.is_active ? "Active" : "Off") : "Empty"}</span>
                <span className="text-[9px] opacity-60">Slot {i + 1}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">Up to {MAX_BANNERS} banners. Active banners rotate in your homepage hero.</p>
      </div>

      {/* Banner list */}
      {isLoading && <div className="p-16 text-center"><RefreshCw className="w-7 h-7 animate-spin mx-auto text-muted-foreground/30" /></div>}

      <div className="space-y-3">
        {banners.map((b: any, idx: number) => (
          <div key={b.id} className={`bg-card rounded-2xl border overflow-hidden transition-all ${b.is_active ? "border-primary/30" : "border-border opacity-75"}`}>
            <div className="flex gap-0">
              {/* Image thumbnail */}
              <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden bg-muted">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground/30" /></div>
                )}
                {/* Overlay indicator */}
                {b.overlay && <div className="absolute inset-0 bg-black/20" />}
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${b.text_color === "light" ? "bg-white/20 text-white" : "bg-black/20 text-white"}`}>
                  {b.text_color === "light" ? "Light text" : "Dark text"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Slot {b.position}</span>
                      {b.badge_text && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{b.badge_text}</span>}
                    </div>
                    <p className="font-semibold text-sm text-foreground truncate">{b.title || <span className="text-muted-foreground italic">No title</span>}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{b.subtitle || "No subtitle"}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {b.btn_text && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${b.btn_style === "primary" ? "bg-primary/10 text-primary" : "border border-border text-muted-foreground"}`}>
                            {b.btn_text}
                          </span>
                          → {b.btn_link}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Active toggle */}
                    <div className="flex flex-col items-center gap-1">
                      <Toggle checked={b.is_active} onChange={(v: boolean) => toggleActive.mutate({ id: b.id, val: v })} label="Active" />
                      <span className="text-[10px] text-muted-foreground">{b.is_active ? "Live" : "Off"}</span>
                    </div>

                    {/* Order controls */}
                    <div className="flex flex-col gap-1">
                      <button onClick={() => movePosition.mutate({ id: b.id, dir: "up", currentPos: b.position })}
                        disabled={idx === 0} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => movePosition.mutate({ id: b.id, dir: "down", currentPos: b.position })}
                        disabled={idx === banners.length - 1} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit / Delete */}
                    <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm("Delete this banner?")) deleteBanner.mutate(b.id); }} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && banners.length === 0 && (
          <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
            <Layers className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-semibold text-muted-foreground">No banners yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Add your first banner to start customising your homepage</p>
          </div>
        )}
      </div>

      {/* Banner Form Modal */}
      {showBannerForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-6 bg-foreground/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between px-7 py-5 border-b border-border">
              <div>
                <h2 className="font-display font-extrabold text-xl text-foreground">{editingBanner?.id ? "Edit Banner" : "Add New Banner"}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Customise your homepage banner</p>
              </div>
              <button onClick={() => setShowBannerForm(false)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80"><X className="w-4 h-4" /></button>
            </div>

            <div className="px-7 py-6 space-y-6">
              {/* Live mini preview */}
              <div className="rounded-2xl overflow-hidden border border-border" style={{ aspectRatio: "16/5", position: "relative", background: "#f3f4f6" }}>
                {bannerForm.image && <img src={bannerForm.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                {bannerForm.overlay && <div className="absolute inset-0 bg-black/35" />}
                <div className={`absolute inset-0 flex flex-col justify-center px-8 gap-1 ${bannerForm.text_color === "light" ? "text-white" : "text-gray-900"}`}>
                  {bannerForm.badge_text && <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{bannerForm.badge_text}</span>}
                  <p className="font-extrabold text-lg leading-tight">{bannerForm.title || "Banner Title"}</p>
                  <p className="text-xs opacity-75">{bannerForm.subtitle || "Banner subtitle text"}</p>
                  {bannerForm.btn_text && bannerForm.btn_style !== "none" && (
                    <span className={`mt-2 inline-flex self-start px-4 py-1.5 rounded-xl text-xs font-bold ${bannerForm.btn_style === "primary" ? "bg-primary text-primary-foreground" : "border-2 border-current"}`}>
                      {bannerForm.btn_text}
                    </span>
                  )}
                </div>
                <span className="absolute top-2 right-2 bg-black/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Monitor className="w-2.5 h-2.5" /> Preview</span>
              </div>

              {/* Image */}
              <div>
                <label className={labelCls}>Banner Image</label>
                <ImageUploader image={bannerForm.image} onImageChange={(url) => setBF("image", url)} height="h-32" />
                <p className="text-[11px] text-muted-foreground mt-1.5">Recommended: 1200×500px or wider. Landscape images work best.</p>
              </div>

              {/* Text content */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Badge Text <span className="text-muted-foreground/50 font-normal">(optional)</span></label>
                  <input value={bannerForm.badge_text} onChange={(e) => setBF("badge_text", e.target.value)} placeholder="e.g. New Collection · Sale · Trending" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Main Heading</label>
                  <input value={bannerForm.title} onChange={(e) => setBF("title", e.target.value)} placeholder="e.g. Quality Care for Little Ones" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Subheading</label>
                  <input value={bannerForm.subtitle} onChange={(e) => setBF("subtitle", e.target.value)} placeholder="e.g. Discover thoughtfully designed toys..." className={inputCls} />
                </div>
              </div>

              {/* Button settings */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Action Button</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Button Text</label>
                    <input value={bannerForm.btn_text} onChange={(e) => setBF("btn_text", e.target.value)} placeholder="Shop Now" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Button Style</label>
                    <select value={bannerForm.btn_style} onChange={(e) => setBF("btn_style", e.target.value)} className={inputCls}>
                      <option value="primary">Filled (Primary)</option>
                      <option value="outline">Outline / Ghost</option>
                      <option value="none">No Button</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Link Type</label>
                    <select value={bannerForm.btn_link_type} onChange={(e) => setBF("btn_link_type", e.target.value)} className={inputCls}>
                      <option value="url">Custom URL</option>
                      <option value="category">Product Category</option>
                      <option value="product">Single Product</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>
                      {bannerForm.btn_link_type === "url" ? "URL" : bannerForm.btn_link_type === "category" ? "Category Slug" : "Product Slug"}
                    </label>
                    <input value={bannerForm.btn_link} onChange={(e) => setBF("btn_link", e.target.value)}
                      placeholder={bannerForm.btn_link_type === "url" ? "/products" : bannerForm.btn_link_type === "category" ? "toys" : "ford-mustang-die-cast"}
                      className={inputCls} />
                  </div>
                </div>
                <div className="mt-3 bg-muted/40 rounded-xl px-4 py-3 text-xs text-muted-foreground">
                  <strong>Examples:</strong> Custom URL → <code>/products</code> or <code>/products?category=toys</code> · Category slug → <code>toys</code> · Product slug → <code>ford-mustang-die-cast</code>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Appearance</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Text Colour</label>
                    <select value={bannerForm.text_color} onChange={(e) => setBF("text_color", e.target.value)} className={inputCls}>
                      <option value="dark">Dark (for light images)</option>
                      <option value="light">Light / White (for dark images)</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-background">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Dark Overlay</p>
                        <p className="text-[11px] text-muted-foreground">Adds a dark tint over image</p>
                      </div>
                      <Toggle checked={bannerForm.overlay} onChange={(v: boolean) => setBF("overlay", v)} label="Overlay" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active toggle */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${bannerForm.is_active ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
                <div>
                  <p className="text-sm font-semibold text-foreground">Show on website</p>
                  <p className="text-[11px] text-muted-foreground">Toggle to show or hide this banner</p>
                </div>
                <Toggle checked={bannerForm.is_active} onChange={(v: boolean) => setBF("is_active", v)} label="Active" />
              </div>
            </div>

            <div className="px-7 py-5 border-t border-border flex gap-3">
              <button onClick={() => saveBanner.mutate()} disabled={saveBanner.isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50">
                {saveBanner.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saveBanner.isPending ? "Saving..." : editingBanner?.id ? "Update Banner" : "Save Banner"}
              </button>
              <button onClick={() => setShowBannerForm(false)} className="px-5 py-3 rounded-2xl bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── ADMIN PANEL ─────────────────────────────────────────────
const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const { data: products = [], isLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const queryClient = useQueryClient();

  const [view, setView] = useState<"dashboard" | "products" | "banners" | "form">("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [search, setSearch] = useState(""); const [filterCat, setFilterCat] = useState(""); const [filterStatus, setFilterStatus] = useState(""); const [sortBy, setSortBy] = useState("newest");

  const set = (key: keyof ProductForm, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const handleNameChange = (val: string) => { set("name", val); if (!editingId) set("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); };

  const stats = useMemo(() => ({
    total: products.length, featured: products.filter((p) => p.is_featured).length,
    newArrivals: products.filter((p) => p.is_new_arrival).length, outOfStock: products.filter((p) => !p.in_stock).length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
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
      const cleanSpecs = form.specs.filter((s) => s.label.trim() && s.value.trim());
      const payload: any = {
        name: form.name, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null,
        category_id: form.category_id || null, age_group: form.age_group || null,
        image: form.image || null, images: form.images.filter(Boolean),
        description: form.description || null, badge: form.badge || null,
        in_stock: form.in_stock, is_featured: form.is_featured, is_new_arrival: form.is_new_arrival,
        rating: Number(form.rating) || 0, review_count: Number(form.review_count) || 0,
        specs: cleanSpecs, tags: form.tags,
        seo_title: form.seo_title || null, seo_description: form.seo_description || null, seo_keywords: form.seo_keywords || null,
      };
      if (editingId) { const { error } = await supabase.from("products").update(payload).eq("id", editingId); if (error) throw error; }
      else { const { error } = await supabase.from("products").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success(editingId ? "✅ Product updated!" : "✅ Product added!"); resetForm(); },
    onError: (err: any) => toast.error("Error: " + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted!"); },
    onError: (err: any) => toast.error(err.message),
  });

  const quickToggle = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => { const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => { setForm(emptyProductForm); setEditingId(null); setView("products"); };

  const startEdit = (p: any) => {
    setForm({ name: p.name, slug: p.slug, price: String(p.price), original_price: p.original_price ? String(p.original_price) : "", category_id: p.category_id || "", age_group: p.age_group || "", image: p.image || "", images: p.images ?? [], description: p.description || "", badge: p.badge || "", in_stock: p.in_stock, is_featured: p.is_featured ?? false, is_new_arrival: p.is_new_arrival ?? false, specs: (p.specs && p.specs.length > 0) ? p.specs : [{ label: "", value: "" }], rating: String(p.rating ?? 0), review_count: String(p.review_count ?? 0), tags: p.tags ?? [], seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "", seo_keywords: p.seo_keywords ?? "" });
    setEditingId(p.id); setView("form");
  };

  const seoTitleLen = form.seo_title.length;
  const seoDescLen = form.seo_description.length;
  const navTabs = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: Package },
    { key: "banners", label: "Banners", icon: Layers },
  ] as const;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === "form" && (
              <button onClick={resetForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-primary-foreground" /></div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-extrabold text-foreground font-display">Haptot Admin</span>
              {view === "form" && <><ChevronRight className="w-3 h-3 text-muted-foreground" /><span className="text-muted-foreground">{editingId ? "Edit Product" : "Add Product"}</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view !== "form" && (
              <nav className="flex bg-muted rounded-xl p-1 gap-1">
                {navTabs.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setView(key as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${view === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </nav>
            )}
            {view === "products" && (
              <button onClick={() => { setForm(emptyProductForm); setEditingId(null); setView("form"); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
            {view === "form" && (
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.price}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50">
                {saveMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Save Product"}
              </button>
            )}
            <button onClick={onLogout} title="Sign out" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div className="space-y-8">
            <div><h1 className="font-display font-extrabold text-2xl text-foreground">Overview</h1><p className="text-muted-foreground text-sm mt-1">Your store at a glance</p></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={ShoppingBag} label="Total Products" value={stats.total} color="bg-gradient-to-br from-blue-500 to-blue-600" />
              <StatCard icon={Star} label="Featured" value={stats.featured} color="bg-gradient-to-br from-amber-400 to-orange-500" />
              <StatCard icon={Sparkles} label="New Arrivals" value={stats.newArrivals} color="bg-gradient-to-br from-violet-500 to-purple-600" />
              <StatCard icon={AlertCircle} label="Out of Stock" value={stats.outOfStock} color="bg-gradient-to-br from-rose-500 to-red-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Products by Category</h2>
                <div className="space-y-3">
                  {categories.map((cat: any) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={cat.id}>
                        <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-foreground">{cat.name}</span><span className="text-muted-foreground">{count} products</span></div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-foreground">Recent Products</h2>
                  <button onClick={() => setView("products")} className="text-primary text-sm font-semibold hover:underline">View all →</button>
                </div>
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-3 border-b border-border last:border-0 hover:bg-muted/30">
                    <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-10 h-10 rounded-xl object-cover" onError={(e: any) => { e.target.src = "/placeholder.svg"; }} />
                    <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-foreground truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.category_name ?? "—"}</p></div>
                    <div className="text-right"><p className="font-bold text-sm">₹{p.price}</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.in_stock ? "In Stock" : "Out"}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[{ label: "Manage Products", desc: "Add, edit, remove products", icon: Package, action: () => setView("products"), color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700" },
                { label: "Edit Banners", desc: "Customise your homepage banners", icon: Layers, action: () => setView("banners"), color: "from-violet-50 to-violet-100 border-violet-200 text-violet-700" },
                { label: "Add Product", desc: "List a new product quickly", icon: Plus, action: () => { setForm(emptyProductForm); setEditingId(null); setView("form"); }, color: "from-green-50 to-green-100 border-green-200 text-green-700" },
              ].map(({ label, desc, icon: Icon, action, color }) => (
                <button key={label} onClick={action} className={`bg-gradient-to-br ${color} border rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform`}>
                  <Icon className="w-6 h-6 mb-3" />
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {view === "products" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div><h1 className="font-display font-extrabold text-2xl text-foreground">Products</h1><p className="text-muted-foreground text-sm mt-0.5">{filtered.length} of {products.length} products</p></div>
              <button onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"><RefreshCw className="w-4 h-4" /></button>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[180px] relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none min-w-[130px]"><option value="">All Categories</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"><option value="">All Status</option><option value="featured">Featured</option><option value="new">New Arrivals</option><option value="out">Out of Stock</option></select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none"><option value="newest">Newest</option><option value="name">Name A–Z</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option></select>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-[56px,1fr,110px,90px,90px,90px,80px] gap-3 px-5 py-3 border-b border-border bg-muted/40">
                {["", "Product", "Category", "Price", "Featured", "New Arrival", "Actions"].map((h) => <span key={h} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{h}</span>)}
              </div>
              {isLoading && <div className="p-16 text-center"><RefreshCw className="w-8 h-8 mx-auto animate-spin opacity-30 text-muted-foreground" /></div>}
              {!isLoading && filtered.length === 0 && <div className="p-16 text-center"><Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground font-semibold">No products found</p></div>}
              {filtered.map((p) => (
                <div key={p.id} className="grid grid-cols-[56px,1fr,110px,90px,90px,90px,80px] gap-3 px-5 py-3.5 border-b border-border last:border-0 items-center hover:bg-muted/20 transition-colors">
                  <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-border" onError={(e: any) => { e.target.src = "/placeholder.svg"; }} />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">{p.badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary/15 text-secondary">{p.badge}</span>}{!p.in_stock && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">Out of Stock</span>}</div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{p.category_name ?? "—"}</span>
                  <div><span className="font-bold text-sm text-foreground">₹{p.price}</span>{p.original_price && <span className="text-[10px] text-muted-foreground line-through ml-1">₹{p.original_price}</span>}</div>
                  <Toggle checked={p.is_featured ?? false} onChange={(v: boolean) => quickToggle.mutate({ id: p.id, field: "is_featured", value: v })} label="Featured" />
                  <Toggle checked={p.is_new_arrival ?? false} onChange={(v: boolean) => quickToggle.mutate({ id: p.id, field: "is_new_arrival", value: v })} label="New Arrival" />
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id); }} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANNERS */}
        {view === "banners" && <BannerManager />}

        {/* PRODUCT FORM */}
        {view === "form" && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6"><h1 className="font-display font-extrabold text-2xl text-foreground">{editingId ? "Edit Product" : "Add New Product"}</h1><p className="text-muted-foreground text-sm mt-1">{editingId ? "Update product details" : "Fill in the details to add a new product"}</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
              <div className="space-y-6">
                <SectionCard title="Product Information" icon={Package}>
                  <div className="space-y-4">
                    <div><label className={labelCls}>Product Name <span className="text-destructive">*</span></label><input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Wooden Rainbow Stacking Rings" className={inputCls} /></div>
                    <div><label className={labelCls}>Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe what makes this product special..." className={`${inputCls} resize-none`} /></div>
                    <div><label className={labelCls}>URL Slug</label><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground whitespace-nowrap">/product/</span><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-name" className={inputCls} /></div></div>
                  </div>
                </SectionCard>
                <SectionCard title="Product Image" icon={ImageIcon}>
                  <ImageUploader image={form.image} onImageChange={(url) => set("image", url)} />
                </SectionCard>
                <SectionCard title="Pricing" icon={ShoppingBag}>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Selling Price (₹) <span className="text-destructive">*</span></label><input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="599" className={inputCls} /></div>
                    <div><label className={labelCls}>Original / MRP (₹)</label><input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="799" className={inputCls} /><p className="text-[11px] text-muted-foreground mt-1">Shows as strikethrough if higher.</p></div>
                  </div>
                </SectionCard>
                <SectionCard title="Product Specifications" icon={Grip}>
                  <SpecsEditor specs={form.specs} onChange={(s) => set("specs", s)} />
                </SectionCard>
                <SectionCard title="Tags" icon={Tag}>
                  <TagsInput tags={form.tags} onChange={(t) => set("tags", t)} />
                </SectionCard>
                <SectionCard title="SEO & Search Visibility" icon={Globe}>
                  <div className="space-y-4">
                    <div className="bg-muted/40 rounded-xl p-4 border border-border">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Google Preview</p>
                      <p className="text-blue-600 text-sm font-semibold truncate">{form.seo_title || form.name || "Product Title"}</p>
                      <p className="text-green-700 text-xs">haptot-e-commerce-hub.vercel.app/product/{form.slug || "slug"}</p>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{form.seo_description || form.description || "Your product description will appear here..."}</p>
                    </div>
                    <div><div className="flex justify-between mb-1.5"><label className={labelCls}>SEO Title</label><span className={`text-[11px] font-semibold ${seoTitleLen > 60 ? "text-destructive" : "text-muted-foreground"}`}>{seoTitleLen}/60</span></div><input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder={form.name || "Leave blank to use product name"} className={inputCls} maxLength={70} /></div>
                    <div><div className="flex justify-between mb-1.5"><label className={labelCls}>Meta Description</label><span className={`text-[11px] font-semibold ${seoDescLen > 160 ? "text-destructive" : "text-muted-foreground"}`}>{seoDescLen}/160</span></div><textarea value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={3} placeholder="Short description for Google..." className={`${inputCls} resize-none`} maxLength={200} /></div>
                    <div><label className={labelCls}>SEO Keywords</label><input value={form.seo_keywords} onChange={(e) => set("seo_keywords", e.target.value)} placeholder="wooden toy, educational, kids 3 years" className={inputCls} /></div>
                  </div>
                </SectionCard>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-sm text-foreground">Status & Visibility</h3></div>
                  <div className="p-5 space-y-4">
                    {([["in_stock", "In Stock", "Product is available to buy"], ["is_featured", "Featured", "Show in Trending Now"], ["is_new_arrival", "New Arrival", "Show in New Arrivals"]] as const).map(([key, label, desc]) => (
                      <div key={key} className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-foreground">{label}</p><p className="text-[11px] text-muted-foreground">{desc}</p></div><Toggle checked={form[key] as boolean} onChange={(v: boolean) => set(key, v)} label={label} /></div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-sm text-foreground">Category & Details</h3></div>
                  <div className="p-5 space-y-4">
                    <div><label className={labelCls}>Category <span className="text-destructive">*</span></label><select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}><option value="">Select a category</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className={labelCls}>Age Group</label><select value={form.age_group} onChange={(e) => set("age_group", e.target.value)} className={inputCls}><option value="">Select</option>{AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
                    <div><label className={labelCls}>Badge / Label</label><select value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls}>{BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}</select></div>
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-sm text-foreground">Ratings</h3></div>
                  <div className="p-5 space-y-4">
                    <div><label className={labelCls}>Rating (0–5)</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} placeholder="4.5" className={inputCls} /></div>
                    <div><label className={labelCls}>Review Count</label><input type="number" min="0" value={form.review_count} onChange={(e) => set("review_count", e.target.value)} placeholder="128" className={inputCls} /></div>
                  </div>
                </div>
                <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.price}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saveMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Save Product"}
                </button>
                <button onClick={resetForm} className="w-full py-3 rounded-2xl bg-muted text-muted-foreground font-semibold text-sm hover:bg-muted/80">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
