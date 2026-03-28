-- TRUMPSTER 2000 - SUPABASE SCHEMA
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Create a table for market signals history
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

-- 2. Create a table for Winning Winnings (The Trophy Room)
CREATE TABLE IF NOT EXISTS public.winnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT NOT NULL,
    profit_pct DOUBLE PRECISION NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.signals_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winnings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for public access (Simplified for MVP)
-- In a real app, you would use authentication, but for this dashboard we'll allow public access to show off the data.

CREATE POLICY "Allow public read signals" ON public.signals_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert signals" ON public.signals_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read winnings" ON public.winnings FOR SELECT USING (true);
CREATE POLICY "Allow public insert winnings" ON public.winnings FOR INSERT WITH CHECK (true);

-- 5. Seed some initial "Winning" data
INSERT INTO public.winnings (symbol, profit_pct, action) VALUES 
('DJT', 420.69, 'STRONG BUY'),
('BTC-USD', 69.42, 'BUY'),
('TSLA', 12.50, 'BUY');
