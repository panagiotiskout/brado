grant execute on function public.create_booking(uuid, timestamptz) to authenticated;
grant execute on function public.booking_bucket_keys(timestamptz) to authenticated;
grant execute on function public.count_bookings_in_bucket(text) to authenticated;
