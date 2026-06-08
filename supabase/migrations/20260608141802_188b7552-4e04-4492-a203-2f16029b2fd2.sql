ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);