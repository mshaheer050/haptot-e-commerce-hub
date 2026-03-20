import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  price: Number(row.price),
  original_price: row.original_price ? Number(row.original_price) : null,
  category_id: row.category_id,
  category_slug: row.categories?.slug ?? undefined,
  category_name: row.categories?.name ?? undefined,
  age_group: row.age_group,
  image: row.image,
  images: row.images ?? [],
  description: row.description,
  specs: (row.specs as any[]) ?? [],
  rating: Number(row.rating ?? 0),
  review_count: row.review_count ?? 0,
  badge: row.badge,
  in_stock: row.in_stock ?? true,
  is_featured: row.is_featured ?? false,
  is_new_arrival: row.is_new_arrival ?? false,
});

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_new_arrival", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useAllProducts = () =>
  useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });

export const useProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data) : null;
    },
    enabled: !!slug,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
