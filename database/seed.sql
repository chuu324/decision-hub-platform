-- ============================================================================
-- IMPORTANT: PRE-REQUISITES (READ BEFORE RUNNING) 
-- ============================================================================
-- Before running this script, you MUST manually register the following users
-- in your application using the "Sign Up" page.
-- or you can just sign up a new user and then you can use this system without run this seed.sql
--
-- Recommended Password for all users: 123456
--
-- Required Accounts:
-- 1. alice@example.com
-- 2. bob@example.com
-- 3. charlie@example.com
-- 4. david@example.com
-- 5. eve@example.com
--
-- This script works by looking up these users by their email address to assign data.
-- If these users do not exist in Auth, the script will fail.
-- ============================================================================

-- 1. Clean up existing application data to prevent conflicts.
TRUNCATE TABLE public.reactions, public.comments, public.votes, public.options, public.decisions CASCADE;

-- 2. Smart Data Seeding Block
DO $$
DECLARE
  -- Variables to hold real User IDs
  alice_id uuid;
  bob_id uuid;
  charlie_id uuid;
  david_id uuid;
  eve_id uuid;
  
  -- Fixed IDs for decisions to ensure consistent relationships
  d_a uuid := 'd1000000-0000-0000-0000-000000000001';
  d_b uuid := 'd2000000-0000-0000-0000-000000000002';
  d_c uuid := 'd3000000-0000-0000-0000-000000000003';
  
BEGIN
  -- ----------------------------------------------------------------
  -- Step A: Retrieve Real User IDs
  -- ----------------------------------------------------------------
  SELECT id INTO alice_id FROM auth.users WHERE email = 'alice@example.com';
  SELECT id INTO bob_id FROM auth.users WHERE email = 'bob@example.com';
  SELECT id INTO charlie_id FROM auth.users WHERE email = 'charlie@example.com';
  SELECT id INTO david_id FROM auth.users WHERE email = 'david@example.com';
  SELECT id INTO eve_id FROM auth.users WHERE email = 'eve@example.com';

  -- Fallback: If you missed registering some users, map them to Alice to prevent errors.
  IF alice_id IS NULL THEN RAISE EXCEPTION 'Error: Please register alice@example.com manually in the app first!'; END IF;
  IF bob_id IS NULL THEN bob_id := alice_id; END IF;
  IF charlie_id IS NULL THEN charlie_id := alice_id; END IF;
  IF david_id IS NULL THEN david_id := alice_id; END IF;
  IF eve_id IS NULL THEN eve_id := alice_id; END IF;

  -- ----------------------------------------------------------------
  -- Step B: Update Profiles (Optional: Add Avatars)
  -- ----------------------------------------------------------------
  -- Note: The 'profiles' table is automatically populated via triggers when you sign up.
  -- Here we just update their avatars for a better visual demo.
  UPDATE public.profiles SET avatar = '👩‍💼' WHERE id = alice_id;
  UPDATE public.profiles SET avatar = '👨‍💻' WHERE id = bob_id;
  UPDATE public.profiles SET avatar = '👨‍🎨' WHERE id = charlie_id;
  UPDATE public.profiles SET avatar = '👨‍🔧' WHERE id = david_id;
  UPDATE public.profiles SET avatar = '👩‍🚀' WHERE id = eve_id;

  -- ----------------------------------------------------------------
  -- Step C: Insert Scenario 1 - Active Voting (Tech Stack)
  -- Creator: Alice
  -- ----------------------------------------------------------------
  INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
  VALUES (d_a, 'Final Project Tech Stack Selection', 'We need to decide on the frontend and backend technologies for our final group project. Please consider learning curve, performance, and team familiarity.', 'vote', 'active', alice_id, now() - interval '3 days');

  -- Options
  INSERT INTO public.options (id, title, description, "decisionId", "proposedBy") VALUES
  ('da000000-0000-0000-0000-000000000101', 'React + Supabase', 'Modern stack, real-time features out of the box.', d_a, alice_id),
  ('da000000-0000-0000-0000-000000000102', 'Vue3 + Spring Boot', 'Classic enterprise stack. Good for Java experience.', d_a, bob_id),
  ('da000000-0000-0000-0000-000000000103', 'Next.js + Node.js', 'Full JS stack. Great for SEO.', d_a, charlie_id);

  -- Votes (React wins)
  INSERT INTO public.votes ("userId", "optionId", "decisionId") VALUES
  (bob_id, 'da000000-0000-0000-0000-000000000101', d_a),
  (charlie_id, 'da000000-0000-0000-0000-000000000101', d_a),
  (eve_id, 'da000000-0000-0000-0000-000000000101', d_a),
  (david_id, 'da000000-0000-0000-0000-000000000103', d_a);

  -- Comments & Reactions
  INSERT INTO public.comments ("decisionId", "userId", content, "createdAt") VALUES
  (d_a, bob_id, 'Supabase setup is incredibly fast!', now() - interval '2 days'),
  (d_a, david_id, 'I am worried about the learning curve of React.', now() - interval '1 day');

  INSERT INTO public.reactions ("decisionId", "optionId", "userId", type) VALUES
  (d_a, 'da000000-0000-0000-0000-000000000101', david_id, 'like'),
  (d_a, 'da000000-0000-0000-0000-000000000102', alice_id, 'question');


  -- ----------------------------------------------------------------
  -- Step D: Insert Scenario 2 - Exploration Phase (Team Building)
  -- Creator: Bob
  -- ----------------------------------------------------------------
  INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
  VALUES (d_b, 'Team Building Activity Location', 'We have budget for a team event next Friday. Propose your ideas! (Brainstorming phase)', 'explore', 'active', bob_id, now() - interval '5 hours');

  INSERT INTO public.options (id, title, description, "decisionId", "proposedBy") VALUES
  ('db000000-0000-0000-0000-000000000201', 'Escape Room', 'Collaborative puzzle solving.', d_b, bob_id),
  ('db000000-0000-0000-0000-000000000202', 'Hiking in Country Park', 'Fresh air and completely free!', d_b, charlie_id);

  INSERT INTO public.comments ("decisionId", "userId", content) VALUES
  (d_b, david_id, 'Hiking might be too tiring if it rains.');

  INSERT INTO public.reactions ("decisionId", "optionId", "userId", type) VALUES
  (d_b, 'db000000-0000-0000-0000-000000000201', alice_id, 'like');


  -- ----------------------------------------------------------------
  -- Step E: Insert Scenario 3 - Closed Decision (Snacks)
  -- Creator: Charlie
  -- ----------------------------------------------------------------
  INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
  VALUES (d_c, 'Monthly Office Snack Order', 'Voting is over. Results are final.', 'vote', 'closed', charlie_id, now() - interval '1 month');

  INSERT INTO public.options (id, title, description, "decisionId", "proposedBy") VALUES
  ('dc000000-0000-0000-0000-000000000301', 'Healthy Nuts & Fruits', 'Expensive but healthy.', d_c, charlie_id),
  ('dc000000-0000-0000-0000-000000000302', 'Chips & Soda', 'Comfort food.', d_c, david_id);

  INSERT INTO public.votes ("userId", "optionId", "decisionId") VALUES
  (alice_id, 'dc000000-0000-0000-0000-000000000301', d_c),
  (bob_id, 'dc000000-0000-0000-0000-000000000301', d_c),
  (eve_id, 'dc000000-0000-0000-0000-000000000301', d_c),
  (david_id, 'dc000000-0000-0000-0000-000000000302', d_c);

END $$;