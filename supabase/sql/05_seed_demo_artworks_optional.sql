-- 05_seed_demo_artworks_optional.sql
-- Optional demo data. Run only if you want starter artworks in the database.

insert into public.artworks (
  id,
  title,
  year,
  medium,
  dimensions,
  status,
  image,
  images,
  description
)
values
  (
    'untitled-vessel-study',
    'Untitled Vessel Study',
    '2026',
    'stoneware, glaze',
    '24 x 18 x 12 cm',
    'available',
    '',
    '{}',
    'A hand-built ceramic form exploring surface and memory.'
  ),
  (
    'body-forms-series',
    'Body Forms Series',
    '2026',
    'ceramic sculpture',
    'variable dimensions',
    'selected work',
    '',
    '{}',
    'A series of tactile forms shaped around body, vessel, and fragment.'
  ),
  (
    'surface-studies',
    'Surface Studies',
    '2025',
    'drawing on paper',
    '29 x 42 cm',
    'study',
    '',
    '{}',
    'Drawings focused on texture, edges, repetition, and surface tension.'
  )
on conflict (id) do update
set
  title = excluded.title,
  year = excluded.year,
  medium = excluded.medium,
  dimensions = excluded.dimensions,
  status = excluded.status,
  image = excluded.image,
  images = excluded.images,
  description = excluded.description;
