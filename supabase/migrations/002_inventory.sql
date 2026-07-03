-- Public inventory of WCFG-managed premium vehicles.
-- Public clients may SELECT available rows only; writes are service-role only.

create table if not exists public.vehicles (
  id text primary key,
  brand text not null,
  brand_slug text not null,
  model text not null,
  year integer not null,
  highlight text not null,
  price_label text not null default 'Upon Inquiry',
  image_src text not null,
  image_alt text not null,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold')),
  created_at timestamptz not null default now()
);

comment on table public.vehicles is
  'Curated luxury inventory presented on the WCFG website.';

create index if not exists vehicles_brand_slug_idx
  on public.vehicles (brand_slug);

create index if not exists vehicles_status_idx
  on public.vehicles (status);

create index if not exists vehicles_brand_slug_status_idx
  on public.vehicles (brand_slug, status);

alter table public.vehicles enable row level security;

drop policy if exists "Public can read available vehicles" on public.vehicles;
create policy "Public can read available vehicles"
  on public.vehicles
  for select
  to anon, authenticated
  using (status = 'available');

-- Seed current curated inventory (idempotent upsert).
insert into public.vehicles (
  id, brand, brand_slug, model, year, highlight, price_label, image_src, image_alt, status
) values
  (
    'rr-cullinan-2024',
    'Rolls-Royce',
    'rolls-royce',
    'Cullinan Black Badge',
    2024,
    'Bespoke interior · Night-ready presence',
    'Upon Inquiry',
    '/vehicles/rr-cullinan-2024.webp',
    'Rolls-Royce Cullinan luxury SUV',
    'available'
  ),
  (
    'ferrari-296-gtb',
    'Ferrari',
    'ferrari',
    '296 GTB',
    2024,
    'Plug-in hybrid V6 · Track-bred elegance',
    'Upon Inquiry',
    '/vehicles/ferrari-296-gtb.webp',
    'Ferrari 296 GTB sports car',
    'available'
  ),
  (
    'lambo-urus-se',
    'Lamborghini',
    'lamborghini',
    'Urus SE',
    2025,
    'Hybrid performance SUV · Off-market allocation',
    'Upon Inquiry',
    '/vehicles/lambo-urus-se.webp',
    'Lamborghini Urus SE performance SUV',
    'available'
  ),
  (
    'mb-g63-2024',
    'Mercedes-Benz',
    'mercedes-benz',
    'G 63 AMG',
    2024,
    'Manufaktur package · Iconic silhouette',
    'Upon Inquiry',
    '/vehicles/mb-g63-2024.webp',
    'Mercedes-AMG G 63 luxury off-roader',
    'available'
  ),
  (
    'porsche-911-turbo-s',
    'Porsche',
    'porsche',
    '911 Turbo S',
    2024,
    'Sport Chrono · Precision engineering',
    'Upon Inquiry',
    '/vehicles/porsche-911-turbo-s.webp',
    'Porsche 911 Turbo S sports car',
    'available'
  ),
  (
    'bentley-continental-gt',
    'Bentley',
    'bentley',
    'Continental GT Speed',
    2024,
    'Mulliner appointments · Grand tourer',
    'Upon Inquiry',
    '/vehicles/bentley-continental-gt.webp',
    'Bentley Continental GT Speed grand tourer',
    'available'
  ),
  (
    'corvette-z06',
    'Corvette',
    'corvette',
    'Z06 3LZ',
    2024,
    'Flat-plane V8 · American exotic',
    'Upon Inquiry',
    '/vehicles/corvette-z06.webp',
    'Chevrolet Corvette Z06 sports car',
    'available'
  ),
  (
    'rr-ghost-2023',
    'Rolls-Royce',
    'rolls-royce',
    'Ghost Extended',
    2023,
    'Starlight headliner · Whisper-quiet cabin',
    'Upon Inquiry',
    '/vehicles/rr-ghost-2023.webp',
    'Rolls-Royce Ghost Extended luxury sedan',
    'available'
  ),
  (
    'ferrari-roma',
    'Ferrari',
    'ferrari',
    'Roma Spider',
    2024,
    'Open-air grand touring · Timeless lines',
    'Upon Inquiry',
    '/vehicles/ferrari-roma.webp',
    'Ferrari Roma Spider convertible',
    'available'
  ),
  (
    'mb-s580',
    'Mercedes-Benz',
    'mercedes-benz',
    'S 580 4MATIC',
    2024,
    'Executive rear suite · Flagship comfort',
    'Upon Inquiry',
    '/vehicles/mb-s580.webp',
    'Mercedes-Benz S-Class luxury sedan',
    'available'
  ),
  (
    'lambo-huracan-sterrato',
    'Lamborghini',
    'lamborghini',
    'Huracán Sterrato',
    2023,
    'Rally-bred supercar · Limited production',
    'Upon Inquiry',
    '/vehicles/lambo-huracan-sterrato.webp',
    'Lamborghini Huracán Sterrato supercar',
    'available'
  ),
  (
    'porsche-cayenne-turbo-gt',
    'Porsche',
    'porsche',
    'Cayenne Turbo GT',
    2024,
    'Track-tuned SUV · Uncompromising pace',
    'Upon Inquiry',
    '/vehicles/porsche-cayenne-turbo-gt.webp',
    'Porsche Cayenne Turbo GT performance SUV',
    'available'
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
  status = excluded.status;
