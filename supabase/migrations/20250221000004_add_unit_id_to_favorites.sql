-- Add unit_id to compare so compare can store apartment + unit
ALTER TABLE compare ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES units(id) ON DELETE CASCADE;

-- Unique: one apartment-level favorite per (user, apartment)
CREATE UNIQUE INDEX IF NOT EXISTS idx_compare_user_apartment_null_unit
  ON compare (user_id, apartment_id) WHERE unit_id IS NULL;

-- Unique: one unit-level favorite per (user, apartment, unit)
CREATE UNIQUE INDEX IF NOT EXISTS idx_compare_user_apartment_unit
  ON compare (user_id, apartment_id, unit_id) WHERE unit_id IS NOT NULL;
