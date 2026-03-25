import { Sparkles, Truck, Shield } from "lucide-react";

const AnnouncementBar = () => (
  <div className="w-full gradient-hero">
    <div className="container mx-auto h-10 flex items-center justify-center gap-6 text-primary-foreground overflow-hidden">
      <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
        {[
          { icon: Truck, text: "Free Pan-India Delivery on ₹499+" },
          { icon: Sparkles, text: "100% Safe & Non-Toxic Toys" },
          { icon: Shield, text: "Easy 7-Day Returns" },
          { icon: Truck, text: "Free Pan-India Delivery on ₹499+" },
          { icon: Sparkles, text: "100% Safe & Non-Toxic Toys" },
          { icon: Shield, text: "Easy 7-Day Returns" },
        ].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide">
            <item.icon className="w-3.5 h-3.5 opacity-80" />
            {item.text}
            <span className="mx-4 opacity-30">✦</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default AnnouncementBar;
