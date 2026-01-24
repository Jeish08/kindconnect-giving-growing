-- Add category column to causes table for filtering
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS category text DEFAULT 'Education';

-- Insert admin roles for the specified emails
-- First, we need to get the user IDs from auth.users by email and insert into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'platform_admin'::app_role
FROM auth.users 
WHERE email IN ('kevindraaferolinjoseph@gmail.com', 'jeyashriragavan@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;