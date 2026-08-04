CREATE TABLE public.regional_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id text NOT NULL UNIQUE,
  region_label text NOT NULL,
  country_code text NOT NULL,
  v_current numeric NOT NULL DEFAULT 0,
  v_baseline numeric NOT NULL DEFAULT 1 CHECK (v_baseline > 0),
  surgency numeric NOT NULL DEFAULT 0,
  capacity numeric NOT NULL DEFAULT 1 CHECK (capacity > 0),
  n_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.regional_telemetry TO anon;
GRANT SELECT ON public.regional_telemetry TO authenticated;
GRANT ALL ON public.regional_telemetry TO service_role;

ALTER TABLE public.regional_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aggregated telemetry is publicly readable"
ON public.regional_telemetry FOR SELECT
TO anon, authenticated
USING (true);

ALTER TABLE public.regional_telemetry REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.regional_telemetry;

INSERT INTO public.regional_telemetry
  (region_id, region_label, country_code, v_current, v_baseline, surgency, capacity, n_count)
VALUES
  ('au-vic-melb', 'Greater Melbourne', 'AU', 1180, 1240, 0.18, 1.00, 412),
  ('au-nsw-syd',  'Greater Sydney',    'AU', 1610, 1300, 0.34, 0.92, 508),
  ('au-qld-nth',  'North Queensland',  'AU', 2240, 1150, 0.62, 0.71, 189),
  ('nz-cant',     'Canterbury',        'NZ', 640,  700,  0.11, 1.05, 143),
  ('ph-vis',      'Central Visayas',   'PH', 2980, 1420, 0.77, 0.64, 233),
  ('au-nt-remote','Remote NT districts','AU', 90,  120,  0.20, 0.90, 27);