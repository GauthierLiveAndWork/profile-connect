-- Check existing policies and create missing ones
CREATE POLICY IF NOT EXISTS "Users can view profile photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY IF NOT EXISTS "Users can upload profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos');