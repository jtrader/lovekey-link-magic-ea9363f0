
-- Customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  stripe_customer_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Credit transactions
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase','bonus','redemption','adjustment')),
  credits integer NOT NULL,
  description text,
  stripe_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Redemptions
CREATE TABLE public.redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  service text NOT NULL,
  credits_deducted integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','fulfilled','cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  fulfilled_at timestamptz
);
GRANT ALL ON public.redemptions TO service_role;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Indexes for foreign keys
CREATE INDEX idx_credit_transactions_customer_id ON public.credit_transactions(customer_id);
CREATE INDEX idx_redemptions_customer_id ON public.redemptions(customer_id);

-- Customer balances view
CREATE VIEW public.customer_balances
WITH (security_invoker = true) AS
SELECT
  c.id AS customer_id,
  c.email,
  c.name,
  COALESCE(SUM(ct.credits), 0)::integer AS total_credits
FROM public.customers c
LEFT JOIN public.credit_transactions ct ON ct.customer_id = c.id
GROUP BY c.id, c.email, c.name;
GRANT ALL ON public.customer_balances TO service_role;
