import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useAllProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

const categories = [
  { value: "", label: "All" },
  { value: "toys", label: "Toys" },
  { value: "stationery", label: "Stationery" },
  { value: "babycare", label: "Baby Care" },
];

const ageGroups = ["0-2 years", "3-5 years", "6-10 years"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedAge, setSelectedAge] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: products = [], isLoading } = useAllProducts();

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category_slug === selectedCategory);
    if (selectedAge) result = result.filter((p) => p.age_group === selectedAge);
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, selectedCategory, selectedAge, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-900 text-3xl md:text-4xl text-foreground">
            {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">{filtered.length} products</p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
                selectedCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border text-sm font-semibold">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-2xl bg-card border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-card p-6 overflow-y-auto" : "hidden"} md:block md:static md:w-56 flex-shrink-0`}>
            {filtersOpen && (
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="font-display font-700 text-lg">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-700 text-sm mb-3 text-foreground">Age Group</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAge("")}
                    className={`block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!selectedAge ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    All Ages
                  </button>
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      onClick={() => { setSelectedAge(age); setFiltersOpen(false); }}
                      className={`block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${selectedAge === age ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoading && <p className="col-span-full text-center py-20 text-muted-foreground">Loading...</p>}
            {!isLoading && filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground text-lg">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
