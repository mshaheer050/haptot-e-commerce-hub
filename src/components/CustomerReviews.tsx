import { Star, BadgeCheck, ThumbsUp, Quote } from "lucide-react";

const reviews = [
  {
    name: "Arjun P.", city: "Bangalore", initials: "AP", rating: 5,
    text: "My son is obsessed with the Ford Mustang die-cast! The detail on the model is incredible for the price. Packed really well, delivered in 3 days.",
    date: "1 week ago", helpful: 21, product: "Die-cast Cars",
  },
  {
    name: "Meena R.", city: "Mumbai", initials: "MR", rating: 5,
    text: "Ordered the wooden train set as a birthday gift. The quality is outstanding — solid wood, smooth finish, no sharp edges. My 3-year-old loves it!",
    date: "2 weeks ago", helpful: 18, product: "Wooden Toys",
  },
  {
    name: "Suresh K.", city: "Chennai", initials: "SK", rating: 5,
    text: "Fast delivery, genuine products, great packaging. The Hot Wheels bundle was exactly what my kids wanted. Will definitely order again!",
    date: "3 weeks ago", helpful: 14, product: "Hot Wheels",
  },
];

const ratingBars = [
  { star: 5, pct: 89 },
  { star: 4, pct: 8 },
  { star: 3, pct: 3 },
];

const CustomerReviews = () => (
  <section className="py-14 md:py-20 bg-muted/30">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-black text-2xl md:text-4xl text-foreground mb-3">
          Loved by <span className="text-gradient">10,000+ Families</span>
        </h2>
        <p className="text-sm text-muted-foreground">Real reviews from real parents across India</p>

        {/* Rating summary */}
        <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-card rounded-card border border-border px-10 py-6 shadow-card mt-8">
          <div className="text-center">
            <div className="font-display font-black text-5xl text-gradient">4.9</div>
            <div className="flex items-center gap-0.5 justify-center mt-2">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" />
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5 font-medium">Overall rating</div>
          </div>

          <div className="w-px h-14 bg-border" />

          <div className="space-y-2">
            {ratingBars.map((b) => (
              <div key={b.star} className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground w-5 font-semibold">{b.star}★</span>
                <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{b.pct}%</span>
              </div>
            ))}
          </div>

          <div className="w-px h-14 bg-border hidden sm:block" />

          <div className="text-center hidden sm:block">
            <div className="font-display font-black text-2xl text-foreground">10K+</div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">Happy Families</div>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="bg-card rounded-card border border-border p-7 flex flex-col gap-4 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl gradient-hero text-primary-foreground flex items-center justify-center font-display font-black text-sm flex-shrink-0 shadow-soft">
                {r.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-foreground">{r.name}</span>
                  <BadgeCheck className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[11px] text-muted-foreground">{r.city} · {r.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" : "text-border"}`} />
              ))}
            </div>

            <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit">
              {r.product}
            </span>

            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              "{r.text}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified Purchase
              </span>
              <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />
                Helpful ({r.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CustomerReviews;
