-- Add sample units for 26 West (and any other apartments that have none)
-- Run this in Supabase SQL Editor

INSERT INTO units (apartment_id, room_type, bedrooms, bathrooms, sq_ft, floor, windows)
SELECT
  a.id,
  u.room_type,
  u.bedrooms,
  u.bathrooms,
  u.sq_ft,
  u.floor,
  u.windows
FROM apartments a
CROSS JOIN (
  VALUES
    ('2B/2B A', 2, 2, 750, 3, 'East'),
    ('2B/2B B', 2, 2, 820, 5, 'South'),
    ('3B/2B', 3, 2, 1100, 2, 'North')
) AS u(room_type, bedrooms, bathrooms, sq_ft, floor, windows)
WHERE a.name ILIKE '%26 west%'
  AND NOT EXISTS (SELECT 1 FROM units un WHERE un.apartment_id = a.id);
