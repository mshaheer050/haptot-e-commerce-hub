import { Link } from "react-router-dom";
import { ArrowRight, Blocks, BookOpen, Baby, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

type CategoryCardMeta = {
  icon: typeof Blocks;
  gradient: string;
  surface: string;
  emoji: string;
  description: string;
};

const categoryMeta: Record<string, CategoryCardMeta> = {
  toys: {
    icon: Blocks,
    gradient: "from-primary to-accent",
    surface: "bg-pastel-purple",
    emoji: "🧸",
    description: "Creative play picks, gift-ready favorites, and joyful everyday toys.",
  },
  stationery: {
    icon: BookOpen,
    gradient: "from-secondary to-accent",
    surface: "bg-pastel-orange",
    emoji: "✏️",
    description: "Colorful supplies for sketching, learning, writing, and crafting fun.",
  },
  babycare: {
    icon: Baby,
    gradient: "from-accent to-primary",
    surface: "bg-pastel-pink",
    emoji: "🍼",
    description: "Soft-touch care for tiny routines, comfort, feeding, and early growth.",
  },
};

const fallbackCategories = [
  { id: "fallback-toys", name: "Toys", slug: "toys", description: null },
  { id: "fallback-stationery", name: "School Stationery", slug: "stationery", description: null },
  { id: "fallback-babycare", name: "Baby Care", slug: "babycare", description: null },
];

const CategoryGrid = () => {
  const { data, isLoading } = useCategories();
  const categories = data && data.length > 0 ? data : fallbackCategories;

  return (
    <section className="py-14 md:py-20 gradient-soft">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Shop by Collection
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-foreground">
            Discover Playful Worlds
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-sm md:text-base text-muted-foreground">
            Browse curated collections designed for gifting, learning, and joyful moments.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-card bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => {
              const meta = categoryMeta[category.slug] ?? {
                icon: Blocks, gradient: "from-primary to-secondary", surface: "bg-pastel-green", emoji: "🎁",
                description: category.description ?? "Thoughtfully picked products for kids and families.",
              };
              const Icon = meta.icon;

              return (
                <Link key={category.id} to={`/products?category=${encodeURIComponent(category.slug)}`} className="group block">
                  <article className="relative overflow-hidden rounded-card bg-card p-7 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-hover h-full border border-border">
                    {/* Gradient corner */}
                    <div className={`absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br ${meta.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                    <div className="relative flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-14 h-14 rounded-2xl ${meta.surface} flex items-center justify-center shadow-soft`}>
                          <span className="text-2xl">{meta.emoji}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-black text-foreground">{category.name}</h3>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Explore →</span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                        {category.description || meta.description}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                        View Collection
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
