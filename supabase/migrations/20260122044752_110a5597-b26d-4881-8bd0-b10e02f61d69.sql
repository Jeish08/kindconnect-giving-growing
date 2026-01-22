-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('donor', 'volunteer', 'ngo_admin', 'platform_admin');

-- Create enum for NGO status
CREATE TYPE public.ngo_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create NGOs table
CREATE TABLE public.ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  mission TEXT,
  logo_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  registration_number TEXT,
  status ngo_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create causes table
CREATE TABLE public.causes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_amount DECIMAL(12,2) DEFAULT 0,
  raised_amount DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer opportunities table
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  skills_required TEXT[],
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  slots_available INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  cause_id UUID REFERENCES public.causes(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  donor_name TEXT,
  donor_email TEXT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer applications table
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  ngo_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, volunteer_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function to check if user is NGO owner
CREATE OR REPLACE FUNCTION public.is_ngo_owner(_user_id UUID, _ngo_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ngos
    WHERE id = _ngo_id AND created_by = _user_id
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_ngos_updated_at BEFORE UPDATE ON public.ngos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_causes_updated_at BEFORE UPDATE ON public.causes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_volunteer_applications_updated_at BEFORE UPDATE ON public.volunteer_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles (only platform admins can manage)
CREATE POLICY "Platform admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'platform_admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for NGOs
CREATE POLICY "Anyone can view approved NGOs" ON public.ngos FOR SELECT USING (status = 'approved');
CREATE POLICY "NGO owners can view own NGO" ON public.ngos FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Authenticated users can create NGOs" ON public.ngos FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "NGO owners can update own NGO" ON public.ngos FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "NGO owners can delete own NGO" ON public.ngos FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for causes
CREATE POLICY "Anyone can view active causes from approved NGOs" ON public.causes FOR SELECT 
  USING (is_active = true AND EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND status = 'approved'));
CREATE POLICY "NGO owners can view own causes" ON public.causes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can create causes" ON public.causes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can update causes" ON public.causes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can delete causes" ON public.causes FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));

-- RLS Policies for opportunities
CREATE POLICY "Anyone can view active opportunities from approved NGOs" ON public.opportunities FOR SELECT 
  USING (is_active = true AND EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND status = 'approved'));
CREATE POLICY "NGO owners can view own opportunities" ON public.opportunities FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can create opportunities" ON public.opportunities FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can update opportunities" ON public.opportunities FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "NGO owners can delete opportunities" ON public.opportunities FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));

-- RLS Policies for donations
CREATE POLICY "Donors can view own donations" ON public.donations FOR SELECT USING (donor_id = auth.uid());
CREATE POLICY "NGO owners can view donations to their NGO" ON public.donations FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.ngos WHERE id = ngo_id AND created_by = auth.uid()));
CREATE POLICY "Authenticated users can create donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for volunteer applications
CREATE POLICY "Volunteers can view own applications" ON public.volunteer_applications FOR SELECT USING (volunteer_id = auth.uid());
CREATE POLICY "NGO owners can view applications to their opportunities" ON public.volunteer_applications FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.opportunities o 
    JOIN public.ngos n ON o.ngo_id = n.id 
    WHERE o.id = opportunity_id AND n.created_by = auth.uid()
  ));
CREATE POLICY "Authenticated users can create applications" ON public.volunteer_applications FOR INSERT TO authenticated 
  WITH CHECK (volunteer_id = auth.uid());
CREATE POLICY "Volunteers can update own applications" ON public.volunteer_applications FOR UPDATE USING (volunteer_id = auth.uid());
CREATE POLICY "NGO owners can update applications" ON public.volunteer_applications FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.opportunities o 
    JOIN public.ngos n ON o.ngo_id = n.id 
    WHERE o.id = opportunity_id AND n.created_by = auth.uid()
  ));
CREATE POLICY "Volunteers can delete own applications" ON public.volunteer_applications FOR DELETE USING (volunteer_id = auth.uid());