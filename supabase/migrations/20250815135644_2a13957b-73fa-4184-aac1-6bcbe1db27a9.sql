-- Create admin roles table for managing admin access
CREATE TABLE public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Insert initial admin user
INSERT INTO public.admin_roles (email, role) VALUES ('gauthierwagneur@hotmail.com', 'admin');

-- Create policies for admin_roles table
CREATE POLICY "Admins can view admin roles" ON public.admin_roles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admin_roles ar 
        WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
);

CREATE POLICY "Admins can insert admin roles" ON public.admin_roles
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admin_roles ar 
        WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
);

CREATE POLICY "Admins can update admin roles" ON public.admin_roles
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.admin_roles ar 
        WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
);

-- Create trigger for updated_at
CREATE TRIGGER update_admin_roles_updated_at
BEFORE UPDATE ON public.admin_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();