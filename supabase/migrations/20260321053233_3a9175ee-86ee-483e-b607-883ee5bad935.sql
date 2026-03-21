
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  image TEXT DEFAULT '',
  badge_text TEXT DEFAULT '',
  btn_text TEXT DEFAULT 'Shop Now',
  btn_link TEXT DEFAULT '/products',
  btn_link_type TEXT DEFAULT 'url',
  btn_style TEXT DEFAULT 'primary',
  text_color TEXT DEFAULT 'dark',
  overlay BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners" ON public.banners
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage banners" ON public.banners
  FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.banners (title, subtitle, image, btn_text, btn_link, is_active, position) VALUES
('Quality Care for Little Ones', 'Discover thoughtfully designed toys, school essentials & baby care products that spark joy and nurture growth.', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&q=80', 'Shop Now', '/products', true, 1),
('New Arrivals Are Here!', 'Check out our latest collection of safe, fun, and educational toys for every age.', 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=1200&q=80', 'Explore New', '/products?category=toys', true, 2),
('Back to School Essentials', 'Premium stationery and school supplies that make learning fun and organized.', 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80', 'Shop Stationery', '/products?category=stationery', true, 3);
