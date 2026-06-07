-- Create RPC function to increment view_count for a couplet.
-- Uses SECURITY DEFINER so anon key can execute it without UPDATE on the table.

CREATE OR REPLACE FUNCTION public.increment_couplet_view(p_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE slug = p_slug;
END;
$$;

-- Grant execute permission to the anon role so the publishable key can call it
GRANT EXECUTE ON FUNCTION public.increment_couplet_view TO anon;
