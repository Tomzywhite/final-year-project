-- Drop the old constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new constraint supporting pending_admin and super_admin
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'pending_admin', 'super_admin'));

-- 1. Create a secure trigger to prevent manual 'admin' registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role text;
  final_role text;
BEGIN
  -- Grab the role requested during signup via Auth
  requested_role := NEW.raw_user_meta_data ->> 'role';
  
  -- Force security downgrade: Never allow front-end to register as active admin directly
  IF requested_role = 'admin' OR requested_role = 'super_admin' THEN
    final_role := 'pending_admin';
  ELSIF requested_role = 'pending_admin' THEN
    final_role := 'pending_admin';
  ELSE
    final_role := 'student';
  END IF;

  INSERT INTO public.profiles (id, full_name, email, matric_number, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email,
    NEW.raw_user_meta_data ->> 'matric_number',
    final_role
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Allow super_admins to SELECT all profiles
CREATE POLICY "super_admin_select_profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  public.get_my_role() = 'super_admin'
);

-- 3. Allow super_admins to UPDATE any profile (like changing roles)
CREATE POLICY "super_admin_update_profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  public.get_my_role() = 'super_admin'
)
WITH CHECK (
  public.get_my_role() = 'super_admin'
);
