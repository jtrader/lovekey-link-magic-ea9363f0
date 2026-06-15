-- Tighten family_presence policies to family members only
DROP POLICY IF EXISTS authenticated_read_family_presence ON public.family_presence;
DROP POLICY IF EXISTS authenticated_update_family_presence ON public.family_presence;
DROP POLICY IF EXISTS authenticated_write_family_presence ON public.family_presence;

CREATE POLICY "Family members can read family presence"
  ON public.family_presence FOR SELECT
  TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Family members can write family presence"
  ON public.family_presence FOR INSERT
  TO authenticated
  WITH CHECK (public.is_family_member(family_id, auth.uid()));

CREATE POLICY "Family members can update family presence"
  ON public.family_presence FOR UPDATE
  TO authenticated
  USING (public.is_family_member(family_id, auth.uid()))
  WITH CHECK (public.is_family_member(family_id, auth.uid()));

-- Tighten presence_states read to family members only
DROP POLICY IF EXISTS authenticated_read_presence ON public.presence_states;

CREATE POLICY "Family members can read presence"
  ON public.presence_states FOR SELECT
  TO authenticated
  USING (public.is_family_member(family_id, auth.uid()));

-- customers: owners can read their own records
CREATE POLICY "Users can view their own customer record"
  ON public.customers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- credit_transactions: owners (via customer) can read their own
CREATE POLICY "Customers can view their own credit transactions"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.customers c
    WHERE c.id = credit_transactions.customer_id
      AND c.user_id = auth.uid()
  ));

-- redemptions: owners (via customer) can read their own
CREATE POLICY "Customers can view their own redemptions"
  ON public.redemptions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.customers c
    WHERE c.id = redemptions.customer_id
      AND c.user_id = auth.uid()
  ));

-- Pin search_path on set_updated_at to address mutable search_path lint
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;