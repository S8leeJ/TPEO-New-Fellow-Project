-- Units table: individual units within an apartment building
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bedrooms INT,
  bathrooms NUMERIC(3,1),
  floor_area_sqft INT,
  price INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_units_apartment_id ON units(apartment_id);

-- Compare items: what users add to the compare page (apartment + unit)
CREATE TABLE IF NOT EXISTS compare_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, apartment_id, unit_id)
);

CREATE INDEX IF NOT EXISTS idx_compare_items_user_id ON compare_items(user_id);

-- RLS policies
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Units are viewable by authenticated users"
  ON units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Compare items are viewable by owner"
  ON compare_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Compare items insert by owner"
  ON compare_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Compare items delete by owner"
  ON compare_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
