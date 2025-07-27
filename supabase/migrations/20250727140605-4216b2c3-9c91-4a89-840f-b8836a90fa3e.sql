-- Add missing RLS policies for posts table
CREATE POLICY "posts_select_policy" ON public.posts
  FOR SELECT
  USING (true);

CREATE POLICY "posts_insert_policy" ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update_policy" ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "posts_delete_policy" ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Add missing RLS policies for profiles table
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE
  USING (auth.uid()::text = user_id);