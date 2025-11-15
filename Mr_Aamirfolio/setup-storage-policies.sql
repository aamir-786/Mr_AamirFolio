-- Setup Storage Bucket Policies for portfolio-images
-- Run this in Supabase SQL Editor to allow authenticated users to upload images

-- First, ensure the bucket exists (create it manually in Storage if it doesn't exist)
-- Bucket name: portfolio-images
-- Make it Public: ON

-- Allow authenticated users to upload files
CREATE POLICY IF NOT EXISTS "Allow authenticated upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  (storage.foldername(name))[1] = 'project-images'
);

-- Allow authenticated users to update their own files
CREATE POLICY IF NOT EXISTS "Allow authenticated update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  (storage.foldername(name))[1] = 'project-images'
)
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  (storage.foldername(name))[1] = 'project-images'
);

-- Allow authenticated users to delete their own files
CREATE POLICY IF NOT EXISTS "Allow authenticated delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  (storage.foldername(name))[1] = 'project-images'
);

-- Allow public read access (so images can be displayed)
CREATE POLICY IF NOT EXISTS "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- Alternative: If you want to allow authenticated users to upload to any folder in the bucket
-- Remove the folder restriction from the above policies:

-- CREATE POLICY IF NOT EXISTS "Allow authenticated upload all"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'portfolio-images');

-- CREATE POLICY IF NOT EXISTS "Allow authenticated update all"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'portfolio-images')
-- WITH CHECK (bucket_id = 'portfolio-images');

-- CREATE POLICY IF NOT EXISTS "Allow authenticated delete all"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'portfolio-images');

