-- ============================================================
-- STEP 1: Add ALL missing columns safely
-- ============================================================
alter table public.categories add column if not exists slug text;
alter table public.categories add column if not exists description text;
alter table public.categories add column if not exists image text;
alter table public.categories add column if not exists created_at timestamptz default now();

alter table public.products add column if not exists slug text;
alter table public.products add column if not exists price numeric(10,2);
alter table public.products add column if not exists original_price numeric(10,2);
alter table public.products add column if not exists category_id uuid;
alter table public.products add column if not exists age_group text;
alter table public.products add column if not exists image text;
alter table public.products add column if not exists images text[] default '{}';
alter table public.products add column if not exists description text;
alter table public.products add column if not exists specs jsonb default '[]';
alter table public.products add column if not exists rating numeric(3,1) default 0;
alter table public.products add column if not exists review_count integer default 0;
alter table public.products add column if not exists badge text;
alter table public.products add column if not exists in_stock boolean default true;
alter table public.products add column if not exists is_featured boolean default false;
alter table public.products add column if not exists is_new_arrival boolean default false;
alter table public.products add column if not exists created_at timestamptz default now();

-- ============================================================
-- STEP 2: Add unique constraints if not present
-- ============================================================
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'categories_slug_key'
  ) then
    alter table public.categories add constraint categories_slug_key unique (slug);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_slug_key'
  ) then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
end $$;

-- ============================================================
-- STEP 3: RLS policies
-- ============================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Allow public read" on public.categories;
create policy "Public read categories" on public.categories for select using (true);

drop policy if exists "Public read products" on public.products;
drop policy if exists "Allow public read" on public.products;
create policy "Public read products" on public.products for select using (true);

-- ============================================================
-- STEP 4: Seed categories
-- ============================================================
insert into public.categories (id, name, slug, description, image) values
(
  'a1000000-0000-0000-0000-000000000001',
  'Toys', 'toys',
  'Educational and fun toys for every age',
  'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&q=80'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Stationery', 'stationery',
  'School essentials and creative supplies',
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80'
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Baby Care', 'baby-care',
  'Gentle products for your little one',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80'
)
on conflict (slug) do update set
  description = excluded.description,
  image       = excluded.image;

-- ============================================================
-- STEP 5: Seed products
-- ============================================================
insert into public.products (
  name, slug, price, original_price, category_id,
  age_group, image, images, description, specs,
  rating, review_count, badge, in_stock, is_featured, is_new_arrival
) values
(
  'Ford Mustang Die-Cast Metal Car', 'ford-mustang-die-cast',
  649, 899, 'a1000000-0000-0000-0000-000000000001',
  '3+ years',
  'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=600&q=80',
  array['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=600&q=80'],
  'Detailed 1:36 scale die-cast metal replica of the iconic Ford Mustang. Features opening doors and rubber tires.',
  '[{"label":"Scale","value":"1:36"},{"label":"Material","value":"Die-cast metal"},{"label":"Doors","value":"Opens both sides"},{"label":"Age","value":"3+ years"}]',
  4.8, 124, 'Best Seller', true, true, false
),
(
  'Land Rover Defender Die-Cast', 'land-rover-defender-die-cast',
  749, 999, 'a1000000-0000-0000-0000-000000000001',
  '3+ years',
  'https://images.unsplash.com/photo-1617814076229-8bf56a3df4ee?w=600&q=80',
  array['https://images.unsplash.com/photo-1617814076229-8bf56a3df4ee?w=600&q=80'],
  'Premium 1:32 scale die-cast Defender with pull-back motor action.',
  '[{"label":"Scale","value":"1:32"},{"label":"Material","value":"Die-cast zinc alloy"},{"label":"Feature","value":"Pull-back motor"},{"label":"Age","value":"3+ years"}]',
  4.7, 89, 'New', true, true, true
),
(
  'Mini Cooper S Die-Cast Collectible', 'mini-cooper-s-die-cast',
  549, 699, 'a1000000-0000-0000-0000-000000000001',
  '3+ years',
  'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&q=80',
  array['https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&q=80'],
  'Classic 1:36 scale Mini Cooper S in iconic two-tone finish.',
  '[{"label":"Scale","value":"1:36"},{"label":"Material","value":"Die-cast metal"},{"label":"Finish","value":"Two-tone paint"},{"label":"Age","value":"3+ years"}]',
  4.6, 67, null, true, false, true
),
(
  'Wooden Railway Set — 32 Pieces', 'wooden-railway-set-32',
  1299, 1799, 'a1000000-0000-0000-0000-000000000001',
  '2+ years',
  'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&q=80',
  array['https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&q=80'],
  'Expandable wooden railway set with 32 pieces including tracks, bridges, and two trains.',
  '[{"label":"Pieces","value":"32"},{"label":"Material","value":"FSC-certified wood"},{"label":"Age","value":"2+ years"}]',
  4.9, 203, 'Top Rated', true, true, false
),
(
  'Magnetic Building Blocks — 64 Pcs', 'magnetic-building-blocks-64',
  1599, 2099, 'a1000000-0000-0000-0000-000000000001',
  '3+ years',
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80',
  array['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80'],
  'STEM magnetic tiles that snap together to build 2D and 3D structures.',
  '[{"label":"Pieces","value":"64"},{"label":"Material","value":"ABS plastic + magnets"},{"label":"Age","value":"3+ years"}]',
  4.8, 156, 'STEM Pick', true, true, true
),
(
  'Soft Plush Elephant Buddy', 'soft-plush-elephant',
  399, 499, 'a1000000-0000-0000-0000-000000000001',
  '0+ months',
  'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&q=80',
  array['https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&q=80'],
  'Super soft plush elephant. Hypoallergenic stuffing, machine washable. Safe for newborns.',
  '[{"label":"Height","value":"30 cm"},{"label":"Washable","value":"Machine washable"},{"label":"Age","value":"0+ months"}]',
  4.9, 312, 'Safe for Babies', true, false, false
),
(
  'Jumbo Triangular Crayons — 24 Colors', 'jumbo-triangular-crayons-24',
  299, 399, 'a1000000-0000-0000-0000-000000000002',
  '2+ years',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80',
  array['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80'],
  'Thick triangular crayons for little hands. Non-toxic, break-resistant, and vibrant.',
  '[{"label":"Colors","value":"24"},{"label":"Shape","value":"Triangular grip"},{"label":"Non-toxic","value":"Yes"},{"label":"Age","value":"2+ years"}]',
  4.7, 88, null, true, false, true
),
(
  'Pastel Gel Pen Set — 36 Colors', 'pastel-gel-pen-set-36',
  549, 699, 'a1000000-0000-0000-0000-000000000002',
  '6+ years',
  'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80',
  array['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80'],
  '36 dreamy pastel gel pens with smooth glide ink. Perfect for journaling and school notes.',
  '[{"label":"Colors","value":"36 pastel shades"},{"label":"Ink","value":"Smooth gel"},{"label":"Age","value":"6+ years"}]',
  4.6, 74, 'Popular', true, true, false
),
(
  'Haptot Kids Backpack — Space Theme', 'kids-backpack-space',
  899, 1199, 'a1000000-0000-0000-0000-000000000002',
  '3+ years',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
  'Lightweight ergonomic school backpack with space-themed print and padded straps.',
  '[{"label":"Capacity","value":"12 litres"},{"label":"Material","value":"Waterproof polyester"},{"label":"Age","value":"3+ years"}]',
  4.5, 61, 'New', true, false, true
),
(
  'Organic Silicone Teether Ring', 'organic-silicone-teether',
  249, 349, 'a1000000-0000-0000-0000-000000000003',
  '3–12 months',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
  array['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80'],
  'BPA-free food-grade silicone teether ring. Dishwasher safe. Soothes sore gums naturally.',
  '[{"label":"Material","value":"Food-grade silicone"},{"label":"BPA Free","value":"Yes"},{"label":"Age","value":"3–12 months"}]',
  4.8, 189, 'BPA Free', true, true, false
),
(
  'Baby Muslin Swaddle Blankets — Set of 3', 'muslin-swaddle-set-3',
  699, 899, 'a1000000-0000-0000-0000-000000000003',
  '0–12 months',
  'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80',
  array['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80'],
  'Ultra-soft 100% muslin cotton swaddle blankets. Set of 3 in pastel prints.',
  '[{"label":"Material","value":"100% muslin cotton"},{"label":"Size","value":"120 x 120 cm"},{"label":"Age","value":"0–12 months"}]',
  4.9, 247, 'Organic', true, true, false
),
(
  'Wooden Shape Sorter Cube', 'wooden-shape-sorter-cube',
  499, 649, 'a1000000-0000-0000-0000-000000000003',
  '12+ months',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
  array['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80'],
  'Classic wooden shape sorter with 8 chunky shapes. Natural water-based paint.',
  '[{"label":"Shapes","value":"8 pieces"},{"label":"Material","value":"Solid wood"},{"label":"Age","value":"12+ months"}]',
  4.7, 93, null, true, false, true
)
on conflict (slug) do update set
  name           = excluded.name,
  price          = excluded.price,
  original_price = excluded.original_price,
  category_id    = excluded.category_id,
  age_group      = excluded.age_group,
  image          = excluded.image,
  images         = excluded.images,
  description    = excluded.description,
  specs          = excluded.specs,
  rating         = excluded.rating,
  review_count   = excluded.review_count,
  badge          = excluded.badge,
  in_stock       = excluded.in_stock,
  is_featured    = excluded.is_featured,
  is_new_arrival = excluded.is_new_arrival;
