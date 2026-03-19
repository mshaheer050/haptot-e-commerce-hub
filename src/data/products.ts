export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: "toys" | "stationery" | "babycare";
  ageGroup: string;
  image: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  rating: number;
  reviewCount: number;
  badge?: "trending" | "new" | "bestseller";
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "1", name: "Rainbow Stacking Rings", slug: "rainbow-stacking-rings",
    price: 599, originalPrice: 799, category: "toys", ageGroup: "0-2 years",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    ],
    description: "Beautifully crafted wooden stacking rings in vibrant rainbow colors. Helps develop fine motor skills and color recognition.",
    specs: [{ label: "Material", value: "Natural Wood" }, { label: "Age", value: "6 months+" }, { label: "Pieces", value: "8 rings + base" }],
    rating: 4.8, reviewCount: 124, badge: "bestseller", inStock: true,
  },
  {
    id: "2", name: "Magnetic Building Blocks", slug: "magnetic-building-blocks",
    price: 1299, originalPrice: 1599, category: "toys", ageGroup: "3-5 years",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&q=80",
    ],
    description: "64-piece magnetic building set that inspires creativity and spatial thinking. Safe, rounded edges with strong magnets.",
    specs: [{ label: "Material", value: "ABS Plastic + Magnets" }, { label: "Age", value: "3 years+" }, { label: "Pieces", value: "64" }],
    rating: 4.9, reviewCount: 89, badge: "trending", inStock: true,
  },
  {
    id: "3", name: "Pastel Crayon Set (24 Colors)", slug: "pastel-crayon-set",
    price: 349, category: "stationery", ageGroup: "3-5 years",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    ],
    description: "Non-toxic, washable pastel crayons in 24 gorgeous colors. Perfect for little artists.",
    specs: [{ label: "Type", value: "Wax Crayons" }, { label: "Colors", value: "24" }, { label: "Non-toxic", value: "Yes" }],
    rating: 4.6, reviewCount: 67, badge: "new", inStock: true,
  },
  {
    id: "4", name: "Organic Baby Lotion", slug: "organic-baby-lotion",
    price: 449, originalPrice: 549, category: "babycare", ageGroup: "0-2 years",
    image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=800&q=80",
    ],
    description: "Gentle, organic baby lotion with chamomile and lavender. Dermatologically tested, hypoallergenic.",
    specs: [{ label: "Volume", value: "200ml" }, { label: "Organic", value: "100%" }, { label: "Paraben-free", value: "Yes" }],
    rating: 4.7, reviewCount: 203, badge: "bestseller", inStock: true,
  },
  {
    id: "5", name: "Wooden Alphabet Puzzle", slug: "wooden-alphabet-puzzle",
    price: 699, category: "toys", ageGroup: "3-5 years",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    ],
    description: "Hand-painted wooden alphabet puzzle. Each letter is chunky enough for small hands to grip.",
    specs: [{ label: "Material", value: "Birch Wood" }, { label: "Pieces", value: "26" }, { label: "Paint", value: "Non-toxic" }],
    rating: 4.5, reviewCount: 45, badge: "new", inStock: true,
  },
  {
    id: "6", name: "School Backpack - Space Explorer", slug: "school-backpack-space",
    price: 899, originalPrice: 1099, category: "stationery", ageGroup: "6-10 years",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    description: "Lightweight, ergonomic backpack with fun space theme. Water-resistant with padded straps.",
    specs: [{ label: "Material", value: "Nylon" }, { label: "Capacity", value: "18L" }, { label: "Water Resistant", value: "Yes" }],
    rating: 4.4, reviewCount: 56, badge: "trending", inStock: true,
  },
  {
    id: "7", name: "Baby Feeding Set (BPA Free)", slug: "baby-feeding-set",
    price: 799, category: "babycare", ageGroup: "0-2 years",
    image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=800&q=80",
    ],
    description: "Complete feeding set with suction bowl, spoon, fork, and sippy cup. Made from food-grade silicone.",
    specs: [{ label: "Material", value: "Food-grade Silicone" }, { label: "BPA Free", value: "Yes" }, { label: "Dishwasher Safe", value: "Yes" }],
    rating: 4.8, reviewCount: 178, badge: "trending", inStock: true,
  },
  {
    id: "8", name: "Art Supply Kit - Deluxe", slug: "art-supply-kit-deluxe",
    price: 1499, originalPrice: 1899, category: "stationery", ageGroup: "6-10 years",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    ],
    description: "150-piece deluxe art set with watercolors, markers, colored pencils, and sketch pad in a wooden carry case.",
    specs: [{ label: "Pieces", value: "150" }, { label: "Case", value: "Wooden" }, { label: "Non-toxic", value: "Yes" }],
    rating: 4.9, reviewCount: 92, badge: "bestseller", inStock: true,
  },
];

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductsByCategory = (cat: string) => products.filter(p => p.category === cat);
export const getTrendingProducts = () => products.filter(p => p.badge === "trending" || p.badge === "bestseller");
export const getNewArrivals = () => products.filter(p => p.badge === "new" || p.badge === "trending");
