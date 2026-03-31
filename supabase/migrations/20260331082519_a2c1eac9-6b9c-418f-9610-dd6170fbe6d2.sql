
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  github_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Repos table
CREATE TABLE public.repos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_full_name TEXT NOT NULL,
  docs_repo_full_name TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  webhook_secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own repos" ON public.repos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own repos" ON public.repos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own repos" ON public.repos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own repos" ON public.repos FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_repos_updated_at BEFORE UPDATE ON public.repos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generation status enum
CREATE TYPE public.generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Doc generations table
CREATE TABLE public.doc_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id UUID NOT NULL REFERENCES public.repos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pr_number INTEGER,
  commit_sha TEXT,
  status public.generation_status NOT NULL DEFAULT 'pending',
  changed_files JSONB DEFAULT '[]'::jsonb,
  generated_docs JSONB DEFAULT '{}'::jsonb,
  docs_pr_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doc_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generations" ON public.doc_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own generations" ON public.doc_generations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_doc_generations_updated_at BEFORE UPDATE ON public.doc_generations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Service role policy for edge functions to update generations
CREATE POLICY "Service role can update generations" ON public.doc_generations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can select all repos" ON public.repos FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can select all profiles" ON public.profiles FOR SELECT TO service_role USING (true);
