-- Featured inventory flag + New ZR1 Coupe 3LZ (black) spotlight unit.

alter table public.vehicles
  add column if not exists featured boolean not null default false;

create index if not exists vehicles_featured_idx
  on public.vehicles (featured)
  where featured = true;

insert into public.vehicles (
  id, brand, brand_slug, model, year, highlight, price_label,
  image_src, image_alt, status, source, featured
) values (
  'corvette-zr1-coupe-3lz-black',
  'Corvette',
  'corvette',
  'ZR1 Coupe 3LZ',
  2025,
  'Available now · Black exterior · Twin-turbo LT7 · 1,064 hp',
  'Call for Price',
  '/vehicles/corvette-zr1-coupe-3lz-black.webp',
  'New 2025 Chevrolet Corvette ZR1 Coupe 3LZ in black',
  'available',
  'wcfg',
  true
)
on conflict (id) do update set
  brand = excluded.brand,
  brand_slug = excluded.brand_slug,
  model = excluded.model,
  year = excluded.year,
  highlight = excluded.highlight,
  price_label = excluded.price_label,
  image_src = excluded.image_src,
  image_alt = excluded.image_alt,
  status = excluded.status,
  source = excluded.source,
  featured = excluded.featured;
