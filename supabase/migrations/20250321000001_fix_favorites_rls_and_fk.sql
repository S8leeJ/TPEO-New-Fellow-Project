-- Fix favorites table: make unit_id nullable and drop bad default if any
ALTER TABLE favorites ALTER COLUMN unit_id DROP NOT NULL;
ALTER TABLE favorites ALTER COLUMN unit_id DROP DEFAULT;

-- RLS policies for favorites (idempotent with IF NOT EXISTS-style guards)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'favorites' AND policyname = 'Favorites are viewable by owner'
  ) THEN
    CREATE POLICY "Favorites are viewable by owner"
      ON favorites FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'favorites' AND policyname = 'Favorites insert by owner'
  ) THEN
    CREATE POLICY "Favorites insert by owner"
      ON favorites FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'favorites' AND policyname = 'Favorites delete by owner'
  ) THEN
    CREATE POLICY "Favorites delete by owner"
      ON favorites FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;
