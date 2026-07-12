CREATE TABLE public.avatar_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  source_type TEXT NOT NULL DEFAULT 'uploaded' CHECK (source_type IN ('uploaded','live_capture')),
  original_image_ref TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avatar_sources TO authenticated;
GRANT ALL ON public.avatar_sources TO service_role;
ALTER TABLE public.avatar_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own avatar sources" ON public.avatar_sources FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.avatar_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  avatar_source_id UUID NOT NULL REFERENCES public.avatar_sources ON DELETE CASCADE,
  style_preset TEXT NOT NULL,
  likeness_level INTEGER NOT NULL DEFAULT 50,
  generated_image_ref TEXT NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avatar_results TO authenticated;
GRANT ALL ON public.avatar_results TO service_role;
ALTER TABLE public.avatar_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own avatar results" ON public.avatar_results FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);