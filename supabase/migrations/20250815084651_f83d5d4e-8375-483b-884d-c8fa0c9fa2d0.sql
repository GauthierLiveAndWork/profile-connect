-- Update policies to allow anonymous uploads for profile photos
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete profile photos" ON storage.objects;

-- Create policies that allow anonymous uploads
CREATE POLICY "Allow anyone to upload profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow anyone to update profile photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Allow anyone to delete profile photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-photos');