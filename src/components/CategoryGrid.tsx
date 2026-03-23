import { Link } from "react-router-dom";
import { ArrowRight, Blocks, BookOpen, Baby } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

type CategoryCardMeta = {
  icon: typeof Blocks;
  surface: string;
  badge: string;
  description: string;
};

const categoryMeta: Record<string, CategoryCardMeta> = {
  toys: {
    icon: Blocks,
    surface: "bg-pastel-blue",
    badge: "Best sellers",
    description: "Creative play picks, gift-ready favorites, and joyful everyday toys.",
  },
  stationery: {
    icon: BookOpen,
    surface: "bg-pastel-orange",
    badge: "Back to school",
    description: "Colorful supplies for sketching, learning, writing, and crafting fun.",
  },
  babycare: {
    icon: Baby,
    surface: "bg-pastel-pink",
    badge: "Gentle essentials",
    description: "Soft-touch care for tiny routines, comfort, feeding, and early growth.",
  },
};

const fallbackCategories = [
  { id: "fallback-toys", name: "Toys", slug: "toys", description: null },
  { id: "fallback-stationery", name: "School Stationery", slug: "stationery", description: null },
  { id: "fallback-babycare", name: "Baby Care", slug: "babycare", description: null },
];

const CategorySkeleton = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="h-56 rounded-3xl bg-muted animate-pulse" />
    ))}
  </div>
);

const CategoryGrid = () => {
  const { data, isLoading } = useCategories();
  const categories = data && data.length > 0 ? data : fallbackCategories;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Shop by collection
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-display font-extrabold text-foreground">
              Discover playful worlds for every little explorer
            </h2>
            <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
              Browse curated collections designed for gifting, learning, and joyful everyday moments.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View all products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => {
              const meta = categoryMeta[category.slug] ?? {
                icon: Blocks,
                surface: "bg-pastel-green",
                badge: "Curated picks",
                description: category.description ?? "Thoughtfully picked products for kids and families.",
              };

              const Icon = meta.icon;

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="group block h-full"
                >
                  <article className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover h-full">
                    <div className={`absolute inset-x-0 top-0 h-28 ${meta.surface}`} />
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-background/50" />

                    <div className="relative flex h-full flex-col">
                      <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${meta.surface} ring-1 ring-background`}>
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <span className="mb-3 inline-flex w-fit rounded-full bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground border border-border">
                        {meta.badge}
                      </span>

                      <h3 className="text-xl font-display font-extrabold text-foreground">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground flex-1">
                        {category.description || meta.description}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Explore collection
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
