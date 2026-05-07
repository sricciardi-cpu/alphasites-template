-- Alpha Sites v2 schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── tenants ─────────────────────────────────────────────────────────────────
-- One row per Alpha Sites client. Created at registration.
CREATE TABLE IF NOT EXISTS tenants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name   TEXT NOT NULL,
  business_type TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'onboarding',  -- onboarding | pending | active
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: only the owner can read/update their own row
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant owner read"
  ON tenants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tenant owner update"
  ON tenants FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── onboarding_sessions ─────────────────────────────────────────────────────
-- Progressive per-answer saves during the AI chat onboarding flow.
-- Upserted on every answer so data is never lost mid-flow.
CREATE TABLE IF NOT EXISTS onboarding_sessions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name           TEXT,
  products_description TEXT,
  style                TEXT,
  colors               TEXT,
  instagram            TEXT,
  whatsapp             TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every upsert
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER onboarding_sessions_updated_at
  BEFORE UPDATE ON onboarding_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: only the owner can read/write their onboarding session
ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "session owner read"
  ON onboarding_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "session owner insert"
  ON onboarding_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session owner update"
  ON onboarding_sessions FOR UPDATE
  USING (auth.uid() = user_id);
