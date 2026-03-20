
-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category_id UUID REFERENCES public.categories(id),
  age_group TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  specs JSONB DEFAULT '[]',
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access (storefront)
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON public.products FOR SELECT USING (true);

-- Allow all inserts/updates/deletes for now (no auth yet - admin dashboard)
CREATE POLICY "Allow all inserts on categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on categories" ON public.categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Allow all inserts on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all deletes on products" ON public.products FOR DELETE USING (true);
