-- Storage policies (run after creating buckets in Dashboard: medical-docs, avatars)

-- Example policies — adjust in Dashboard if needed:

-- medical-docs: authenticated users upload to own folder
-- create policy "medical_upload_own"
-- on storage.objects for insert to authenticated
-- with check (bucket_id = 'medical-docs' and (storage.foldername(name))[1] = auth.uid()::text);

-- avatars: public read
-- create policy "avatars_public_read"
-- on storage.objects for select to public
-- using (bucket_id = 'avatars');
