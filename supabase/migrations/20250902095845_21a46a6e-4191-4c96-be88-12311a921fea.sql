-- Add foreign key relationship between community_posts and profiles
ALTER TABLE public.community_posts 
ADD CONSTRAINT fk_community_posts_user_profile 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key relationship between post_comments and profiles  
ALTER TABLE public.post_comments 
ADD CONSTRAINT fk_post_comments_user_profile 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;