-- TRUMPSTER 2000 - SUPABASE CRON SCHEMA (AUTONOMOUS EDITION)
-- RUN THIS IN THE SUPABASE SQL EDITOR TO ENSURE 24/7 DEDUPLICATION

-- 1. Create the signals_history table (if it doesn't already exist)
CREATE TABLE IF NOT EXISTS public.signals_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    price DOUBLE PRECISION,
    confidence INTEGER,
    change_pct DOUBLE PRECISION,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.signals_history ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies so Vercel can seamlessly Read and Write to it
-- (Using IF NOT EXISTS syntax equivalents for Policies)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'signals_history' AND policyname = 'Allow Vercel read access'
    ) THEN
        CREATE POLICY "Allow Vercel read access" ON public.signals_history FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'signals_history' AND policyname = 'Allow Vercel insert access'
    ) THEN
        CREATE POLICY "Allow Vercel insert access" ON public.signals_history FOR INSERT WITH CHECK (true);
    END IF;
END
$$;
