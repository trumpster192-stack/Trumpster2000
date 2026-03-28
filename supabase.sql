-- TRUMPSTER 2000 - SUPABASE SCHEMA (PATRIOT EDITION)
-- RUN THIS IN THE SUPABASE SQL EDITOR TO SEED THE TROPHY ROOM

-- 1. Create Tables
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

CREATE TABLE IF NOT EXISTS public.winnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT NOT NULL,
    profit_pct DOUBLE PRECISION NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.signals_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winnings ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies (Fixed Syntax)
-- PostgreSQL does not support IF NOT EXISTS for policies, so we DROP first if needed.

DROP POLICY IF EXISTS "Allow public read signals" ON public.signals_history;
CREATE POLICY "Allow public read signals" ON public.signals_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert signals" ON public.signals_history;
CREATE POLICY "Allow public insert signals" ON public.signals_history FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read winnings" ON public.winnings;
CREATE POLICY "Allow public read winnings" ON public.winnings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert winnings" ON public.winnings;
CREATE POLICY "Allow public insert winnings" ON public.winnings FOR INSERT WITH CHECK (true);

-- 4. Seed Real-Looking PATRIOT Winnings
DELETE FROM public.winnings; -- Clear existing to avoid duplicates
INSERT INTO public.winnings (symbol, profit_pct, action) VALUES 
('DJT', 1420.69, 'STRONG BUY'),
('BTC-USD', 69.42, 'BUY'),
('TSLA', 45.12, 'BUY'),
('NVDA', 122.50, 'STRONG BUY'),
('DJT', 88.00, 'BUY'),
('ETH-USD', 34.20, 'BUY'),
('SPY', 12.04, 'BUY'),
('QQQ', 15.60, 'BUY');
