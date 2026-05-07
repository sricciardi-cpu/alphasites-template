-- AlphaSites platform: tenants table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Registration fields
  nombre          TEXT NOT NULL,
  email           TEXT NOT NULL,
  business_name   TEXT NOT NULL,
  business_type   TEXT NOT NULL,

  -- Onboarding fields (filled after AI chat)
  brand_name              TEXT,
  products_description    TEXT,
  style                   TEXT,
  colors                  TEXT,
  instagram               TEXT,
  whatsapp                TEXT,

  -- Lifecycle
  status          TEXT NOT NULL DEFAULT 'pending',
  -- 'pending'            → registered, hasn't finished onboarding
  -- 'onboarding_complete'→ answered all questions, store being generated
  -- 'active'            → store live

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tenants_updated_at ON tenants;
CREATE TRIGGER tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: users can only read/update their own row
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_select_own" ON tenants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tenant_update_own" ON tenants
  FOR UPDATE USING (auth.uid() = user_id);

-- Inserts are done server-side via service role key (no policy needed for anon)
