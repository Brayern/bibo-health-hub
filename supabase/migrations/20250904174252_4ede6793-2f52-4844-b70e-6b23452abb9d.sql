-- Add payment status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_reminders_access BOOLEAN DEFAULT FALSE NOT NULL;