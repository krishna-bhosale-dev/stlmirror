-- ═══════════════════════════════════════════════════════════════
-- STLMirror — New Tables Migration  (v2 — safe to re-run)
-- Run this in: Supabase Dashboard → SQL Editor → Run All
--
-- Changes from v1:
--   • auth.role() replaced with auth.uid() IS NOT NULL (non-deprecated)
--   • INSERT / UPDATE policies now include WITH CHECK clauses
--   • Admin can SELECT all rows (not just published), so the admin
--     table shows draft records too
-- ═══════════════════════════════════════════════════════════════

-- ─── Shared helper: auto-update updated_at ─────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ═══════════════════════════════════════════════════════════════
-- 1. premium_downloads
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.premium_downloads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  category      text,
  file_url      text,
  thumbnail_url text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured   boolean NOT NULL DEFAULT false,
  downloads     integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.premium_downloads ENABLE ROW LEVEL SECURITY;

-- Drop old policies before recreating (safe for re-runs)
DROP POLICY IF EXISTS "public_read_published_premium" ON public.premium_downloads;
DROP POLICY IF EXISTS "admin_write_premium"            ON public.premium_downloads;
DROP POLICY IF EXISTS "admin_select_all_premium"       ON public.premium_downloads;
DROP POLICY IF EXISTS "admin_insert_premium"           ON public.premium_downloads;
DROP POLICY IF EXISTS "admin_update_premium"           ON public.premium_downloads;
DROP POLICY IF EXISTS "admin_delete_premium"           ON public.premium_downloads;

-- Public: read published rows only
CREATE POLICY "public_read_published_premium" ON public.premium_downloads
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated admin: full write access
CREATE POLICY "admin_insert_premium" ON public.premium_downloads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_update_premium" ON public.premium_downloads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_premium" ON public.premium_downloads
  FOR DELETE TO authenticated USING (true);

-- Trigger
DROP TRIGGER IF EXISTS set_premium_downloads_updated_at ON public.premium_downloads;
CREATE TRIGGER set_premium_downloads_updated_at
  BEFORE UPDATE ON public.premium_downloads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- 2. website_links
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.website_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  category      text,
  url           text,
  thumbnail_url text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured   boolean NOT NULL DEFAULT false,
  clicks        integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.website_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_links" ON public.website_links;
DROP POLICY IF EXISTS "admin_write_links"            ON public.website_links;
DROP POLICY IF EXISTS "admin_select_all_links"       ON public.website_links;
DROP POLICY IF EXISTS "admin_insert_links"           ON public.website_links;
DROP POLICY IF EXISTS "admin_update_links"           ON public.website_links;
DROP POLICY IF EXISTS "admin_delete_links"           ON public.website_links;

-- Public: read published rows only; authenticated users see all
CREATE POLICY "public_read_published_links" ON public.website_links
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated admin: full write access
CREATE POLICY "admin_insert_links" ON public.website_links
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_update_links" ON public.website_links
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_links" ON public.website_links
  FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS set_website_links_updated_at ON public.website_links;
CREATE TRIGGER set_website_links_updated_at
  BEFORE UPDATE ON public.website_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- 3. apk_items
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.apk_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  category      text,
  package_name  text,
  version       text,
  file_url      text,
  thumbnail_url text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured   boolean NOT NULL DEFAULT false,
  downloads     integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.apk_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_apks" ON public.apk_items;
DROP POLICY IF EXISTS "admin_write_apks"            ON public.apk_items;
DROP POLICY IF EXISTS "admin_select_all_apks"       ON public.apk_items;
DROP POLICY IF EXISTS "admin_insert_apks"           ON public.apk_items;
DROP POLICY IF EXISTS "admin_update_apks"           ON public.apk_items;
DROP POLICY IF EXISTS "admin_delete_apks"           ON public.apk_items;

-- Public: read published rows only; authenticated users see all
CREATE POLICY "public_read_published_apks" ON public.apk_items
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated admin: full write access
CREATE POLICY "admin_insert_apks" ON public.apk_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_update_apks" ON public.apk_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_apks" ON public.apk_items
  FOR DELETE TO authenticated USING (true);

DROP TRIGGER IF EXISTS set_apk_items_updated_at ON public.apk_items;
CREATE TRIGGER set_apk_items_updated_at
  BEFORE UPDATE ON public.apk_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- Verification queries — run these after to confirm setup
-- ═══════════════════════════════════════════════════════════════
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--   AND table_name IN ('website_links', 'premium_downloads', 'apk_items');
--
-- SELECT tablename, policyname, cmd
--   FROM pg_policies
--   WHERE tablename IN ('website_links', 'premium_downloads', 'apk_items')
--   ORDER BY tablename, cmd;
