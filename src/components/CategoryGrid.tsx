import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";

const fallbackImages: Record<string, string> = {
  toys: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
  stationery: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop",
  babycare: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
};

const CategoryGrid = () => {
  const { data: categories = [] } = useCategories();

  const displayCats = categories.length > 0
    ? categories
    : [
        { id: "1", slug: "toys", name: "Toys", icon: null, color: null },
        { id: "2", slug: "stationery", name: "School Stationery", icon: null, color: null },
        { id: "3", slug: "babycare", name: "Baby Care", icon: null, color: null },
      ];

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-800 text-xl md:text-2xl text-foreground">Shop by Category</h2>
          <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1.5 px-1.5">
          {displayCats.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="flex-shrink-0 w-36 md:w-44 group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                <img
                  src={cat.icon || fallbackImages[cat.slug] || fallbackImages.toys}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="font-display font-700 text-sm text-foreground text-center group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
