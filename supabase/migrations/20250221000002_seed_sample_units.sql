-- Optional: Seed sample units for apartments that exist.
-- Run this after 20250221000001_create_units_and_compare.sql
-- Inserts 2 sample units per apartment (only for apartments that have no units yet)

DO $$
DECLARE
  apt RECORD;
  i INT;
BEGIN
  FOR apt IN SELECT id FROM apartments a
    WHERE NOT EXISTS (SELECT 1 FROM units u WHERE u.apartment_id = a.id)
  LOOP
    FOR i IN 1..2 LOOP
      INSERT INTO units (apartment_id, name, bedrooms, bathrooms, floor_area_sqft, price)
      VALUES (
        apt.id,
        'Unit ' || i,
        (2 + (random() * 2)::int),
        (1 + (random() * 1.5))::numeric(3,1),
        (600 + (random() * 400)::int),
        (120000 + (random() * 80000)::int)
      );
    END LOOP;
  END LOOP;
END $$;
