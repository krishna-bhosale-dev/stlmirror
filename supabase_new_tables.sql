-- ═══════════════════════════════════════════════════════════════
-- STLMirror — New Tables Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Premium Downloads ──────────────────────────────────────
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

-- Allow public read of published items
CREATE POLICY "public_read_published_premium" ON public.premium_downloads
  FOR SELECT USING (status = 'published');

-- Allow authenticated admin write
CREATE POLICY "admin_write_premium" ON public.premium_downloads
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 2. Website Links ──────────────────────────────────────────
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

CREATE POLICY "public_read_published_links" ON public.website_links
  FOR SELECT USING (status = 'published');

CREATE POLICY "admin_write_links" ON public.website_links
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 3. APK Items ──────────────────────────────────────────────
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

CREATE POLICY "public_read_published_apks" ON public.apk_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "admin_write_apks" ON public.apk_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── 4. Trigger: auto-update updated_at on all 3 tables ────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_premium_downloads_updated_at
  BEFORE UPDATE ON public.premium_downloads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_website_links_updated_at
  BEFORE UPDATE ON public.website_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_apk_items_updated_at
  BEFORE UPDATE ON public.apk_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
