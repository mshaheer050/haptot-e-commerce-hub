import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import CustomerReviews from "@/components/CustomerReviews";
import { useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";

const Index = () => {
  const { data: featured = [] } = useFeaturedProducts();
  const { data: newArrivals = [] } = useNewArrivals();
  return (
    <main>
      <HeroBanner />
      <CategoryGrid />
      <CustomerReviews />
    </main>
  );
};

export default Index;
