
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can update generations" ON public.doc_generations;

-- Create proper service role policy for edge functions
CREATE POLICY "Service role can update generations" ON public.doc_generations FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- Also need service role INSERT for webhook edge function
CREATE POLICY "Service role can insert generations" ON public.doc_generations FOR INSERT TO service_role WITH CHECK (true);
