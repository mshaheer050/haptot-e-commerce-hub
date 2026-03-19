import { Link } from "react-router-dom";
import { Blocks, Pencil, Heart } from "lucide-react";

const categories = [
  { name: "Toys", slug: "toys", icon: Blocks, color: "bg-pastel-blue", desc: "Fun & learning combined" },
  { name: "School Stationery", slug: "stationery", icon: Pencil, color: "bg-pastel-orange", desc: "Creative essentials" },
  { name: "Baby Care", slug: "babycare", icon: Heart, color: "bg-pastel-green", desc: "Gentle & organic" },
];

const CategoryGrid = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-800 text-3xl md:text-4xl text-foreground">Shop by Category</h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Handpicked products for every stage of your child's journey</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}`}
            className={`${cat.color} rounded-3xl p-8 md:p-10 card-hover group text-center`}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-card/60 backdrop-blur flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <cat.icon className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="font-display font-800 text-xl text-foreground">{cat.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
