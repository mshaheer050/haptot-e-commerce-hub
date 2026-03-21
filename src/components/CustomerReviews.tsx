import { Star, BadgeCheck, ThumbsUp } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// 📝 REVIEWS DATA
// Currently showing: Toys only
// To add a new category later (e.g. Baby Care, Stationery),
// just add new review objects below with the relevant "product" tag.
// ─────────────────────────────────────────────────────────────────
const reviews = [
  {
    name: "Arjun P.",
    city: "Bangalore",
    initials: "AP",
    rating: 5,
    text: "My son is obsessed with the Ford Mustang die-cast! The detail on the model is incredible for the price. Packed really well, delivered in 3 days.",
    date: "1 week ago",
    helpful: 21,
    product: "Die-cast Cars",
  },
  {
    name: "Meena R.",
    city: "Mumbai",
    initials: "MR",
    rating: 5,
    text: "Ordered the wooden train set as a birthday gift. The quality is outstanding — solid wood, smooth finish, no sharp edges. My 3-year-old loves it!",
    date: "2 weeks ago",
    helpful: 18,
    product: "Wooden Toys",
  },
  {
    name: "Suresh K.",
    city: "Chennai",
    initials: "SK",
    rating: 5,
    text: "Fast delivery, genuine products, great packaging. The Hot Wheels bundle was exactly what my kids wanted. Will definitely order again from Haptot!",
    date: "3 weeks ago",
    helpful: 14,
    product: "Hot Wheels",
  },
];

const ratingBars = [
  { star: 5, pct: 89, color: "bg-green-500" },
  { star: 4, pct: 8,  color: "bg-green-400" },
  { star: 3, pct: 3,  color: "bg-yellow-400" },
];

const CustomerReviews = () => (
  <section className="py-12 md:py-16 bg-muted/50">
    <div className="container mx-auto">

      {/* Section header */}
      <div className="text-center mb-10">
        <h2 className="font-display font-800 text-xl md:text-2xl text-foreground mb-2">
          What Parents Say
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Trusted by 10,000+ happy families across India
        </p>

        {/* Overall rating summary card */}
        <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-background rounded-2xl border border-border px-8 py-5 shadow-soft">
          <div className="text-center">
            <div className="font-display font-900 text-4xl text-foreground">4.9</div>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]" />
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Overall rating</div>
          </div>

          <div className="w-px h-12 bg-border" />

          <div className="space-y-1.5">
            {ratingBars.map((b) => (
              <div key={b.star} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-4">{b.star}★</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{b.pct}%</span>
              </div>
            ))}
          </div>

          <div className="w-px h-12 bg-border hidden sm:block" />

          <div className="text-center hidden sm:block">
            <div className="font-display font-700 text-xl text-foreground">10K+</div>
            <div className="text-[11px] text-muted-foreground mt-1">Reviews</div>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-background rounded-2xl border border-border p-6 flex flex-col gap-3 shadow-soft hover:shadow-card transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-700 text-sm flex-shrink-0">
                {r.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-700 text-sm text-foreground">{r.name}</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                </div>
                <span className="text-[11px] text-muted-foreground">{r.city}</span>
              </div>
              <span className="text-[11px] text-muted-foreground flex-shrink-0">{r.date}</span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= r.rating
                      ? "fill-[hsl(var(--rating-star))] text-[hsl(var(--rating-star))]"
                      : "text-border"
                  }`}
                />
              ))}
            </div>

            <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
              {r.product}
            </span>

            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              "{r.text}"
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600">
                <BadgeCheck className="w-3 h-3" />
                Verified Purchase
              </span>
              <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="w-3 h-3" />
                Helpful ({r.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Join 10,000+ happy families ·{" "}
          <span className="text-primary font-semibold cursor-pointer hover:underline">
            Read all reviews →
          </span>
        </p>
      </div>
    </div>
  </section>
);

export default CustomerReviews;
