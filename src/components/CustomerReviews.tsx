import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Priya S.",
    rating: 5,
    text: "Amazing quality toys! My son absolutely loves the wooden train set. The packaging was also very premium. Will definitely order again.",
    date: "2 weeks ago",
  },
  {
    name: "Rajesh K.",
    rating: 5,
    text: "Best baby care products I've found online. The organic lotion is gentle and smells wonderful. Fast delivery too!",
    date: "1 month ago",
  },
  {
    name: "Anita M.",
    rating: 4,
    text: "Great stationery sets for my daughter's school. The colors are vibrant and the quality is excellent. She's thrilled!",
    date: "3 weeks ago",
  },
];

const CustomerReviews = () => (
  <section className="py-10 md:py-14 bg-muted/50">
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display font-800 text-xl md:text-2xl text-foreground">What Parents Say</h2>
        <p className="text-sm text-muted-foreground mt-1">Trusted by 10,000+ happy families</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <div key={i} className="bg-background rounded-xl border border-border p-6 space-y-3">
            <Quote className="w-6 h-6 text-primary/30" />
            <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-display font-700 text-sm text-foreground">{r.name}</span>
              <span className="text-[11px] text-muted-foreground">{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerReviews;
