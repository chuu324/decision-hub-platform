-- ==================================================
-- DecisionHub Data Seeding Script
-- Project Track 1: Database Application Development
-- Usage: Run this in Supabase SQL Editor to populate demo data.
-- ==================================================

-- 1. Clean up existing data to prevent conflicts (Cascading delete)
TRUNCATE TABLE public.reactions, public.comments, public.votes, public.options, public.decisions CASCADE;
DELETE FROM auth.users WHERE email IN ('alice@example.com', 'bob@example.com', 'charlie@example.com', 'david@example.com', 'eve@example.com');

-- 2. Create Demo Users (using fixed UUIDs for relationships)
-- Note: These users are for data association only. You can sign up with these emails to "claim" them if needed.
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'alice@example.com',   '$2a$10$q3Wi9rRwATm7BiOW9Knx8OoYugLlS1mP/qxy9FXUXmzVBnKO3woFa', now(), '{"name": "Alice Wang"}'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'bob@example.com',     '$2a$10$q3Wi9rRwATm7BiOW9Knx8OoYugLlS1mP/qxy9FXUXmzVBnKO3woFa', now(), '{"name": "Bob Li"}'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'charlie@example.com', '$2a$10$q3Wi9rRwATm7BiOW9Knx8OoYugLlS1mP/qxy9FXUXmzVBnKO3woFa', now(), '{"name": "Charlie Zhang"}'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'david@example.com',   '$2a$10$q3Wi9rRwATm7BiOW9Knx8OoYugLlS1mP/qxy9FXUXmzVBnKO3woFa', now(), '{"name": "David Chen"}'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'eve@example.com',     '$2a$10$q3Wi9rRwATm7BiOW9Knx8OoYugLlS1mP/qxy9FXUXmzVBnKO3woFa', now(), '{"name": "Eve Wu"}')
ON CONFLICT (id) DO NOTHING;


-- ==================================================
-- Scenario A: Active Voting Phase (Rich data for charts)
-- Topic: Final Project Tech Stack
-- ==================================================

INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
VALUES 
  ('d1000000-0000-0000-0000-000000000001', 
   'Final Project Tech Stack Selection', 
   'We need to decide on the frontend and backend technologies for our final group project. Please consider learning curve, performance, and team familiarity.', 
   'vote', 
   'active', 
   'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Alice
   now() - interval '3 days');

-- Options for Decision A
INSERT INTO public.options (id, title, description, "decisionId", "proposedBy")
VALUES
  ('da000000-0000-0000-0000-000000000101', 'React + Supabase', 'Modern stack, real-time features out of the box. Good for MVP.', 'd1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
  ('da000000-0000-0000-0000-000000000102', 'Vue3 + Spring Boot', 'Classic enterprise stack. Good for Java backend experience.', 'd1000000-0000-0000-0000-000000000001', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'),
  ('da000000-0000-0000-0000-000000000103', 'Next.js + Node.js', 'Full JS stack. Great for SEO and server-side rendering.', 'd1000000-0000-0000-0000-000000000001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33');

-- Votes for Decision A (Ensuring React+Supabase wins for demo)
INSERT INTO public.votes ("userId", "optionId", "decisionId")
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'da000000-0000-0000-0000-000000000101', 'd1000000-0000-0000-0000-000000000001'), -- Bob -> React
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'da000000-0000-0000-0000-000000000101', 'd1000000-0000-0000-0000-000000000001'), -- Charlie -> React
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'da000000-0000-0000-0000-000000000101', 'd1000000-0000-0000-0000-000000000001'), -- Eve -> React
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'da000000-0000-0000-0000-000000000103', 'd1000000-0000-0000-0000-000000000001'); -- David -> Next.js

-- Comments for Decision A
INSERT INTO public.comments ("decisionId", "userId", content, "createdAt")
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Supabase saves us a lot of time on backend setup. Highly recommend it!', now() - interval '2 days'),
  ('d1000000-0000-0000-0000-000000000001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'But Spring Boot is more robust for complex business logic. Are we sure about JS backend?', now() - interval '1 day'),
  ('d1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '@David, for this project scale, Node.js is sufficient and faster to iterate.', now() - interval '2 hours');

-- Reactions for Decision A
INSERT INTO public.reactions ("decisionId", "optionId", "userId", type)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'da000000-0000-0000-0000-000000000101', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'like'),
  ('d1000000-0000-0000-0000-000000000001', 'da000000-0000-0000-0000-000000000102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'question');


-- ==================================================
-- Scenario B: Exploration Phase (Brainstorming)
-- Topic: Team Building
-- ==================================================

INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
VALUES 
  ('d2000000-0000-0000-0000-000000000002', 
   'Team Building Activity Location', 
   'We have some budget for a team bonding event next Friday. Propose your ideas! (No voting yet, just brainstorming)', 
   'explore', 
   'active', 
   'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', -- Bob
   now() - interval '5 hours');

-- Options for Decision B
INSERT INTO public.options (id, title, description, "decisionId", "proposedBy")
VALUES
  ('db000000-0000-0000-0000-000000000201', 'Escape Room', 'Collaborative puzzle solving. Good for team spirit.', 'd2000000-0000-0000-0000-000000000002', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'),
  ('db000000-0000-0000-0000-000000000202', 'Hiking in Country Park', 'Fresh air and exercise. Completely free!', 'd2000000-0000-0000-0000-000000000002', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'),
  ('db000000-0000-0000-0000-000000000203', 'Board Game Cafe', 'Relaxed atmosphere with snacks and drinks.', 'd2000000-0000-0000-0000-000000000002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55');

-- Comments for Decision B
INSERT INTO public.comments ("decisionId", "userId", content, "createdAt")
VALUES
  ('d2000000-0000-0000-0000-000000000002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Hiking might be too tiring if it rains. I prefer indoor activities.', now() - interval '1 hour');

-- Reactions for Decision B
INSERT INTO public.reactions ("decisionId", "optionId", "userId", type)
VALUES
  ('d2000000-0000-0000-0000-000000000002', 'db000000-0000-0000-0000-000000000201', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'like'),
  ('d2000000-0000-0000-0000-000000000002', 'db000000-0000-0000-0000-000000000202', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'concern');


-- ==================================================
-- Scenario C: Closed Decision (Historical Data)
-- Topic: Office Snacks
-- ==================================================

INSERT INTO public.decisions (id, title, description, stage, status, "creatorId", "createdAt")
VALUES 
  ('d3000000-0000-0000-0000-000000000003', 
   'Monthly Office Snack Order', 
   'Voting is over. This decision has been finalized.', 
   'vote', 
   'closed', 
   'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', -- Charlie
   now() - interval '1 month');

-- Options for Decision C
INSERT INTO public.options (id, title, description, "decisionId", "proposedBy")
VALUES
  ('dc000000-0000-0000-0000-000000000301', 'Healthy Nuts & Fruits', 'Expensive but healthy option.', 'd3000000-0000-0000-0000-000000000003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'),
  ('dc000000-0000-0000-0000-000000000302', 'Chips & Soda', 'Standard comfort food. Everyone likes it.', 'd3000000-0000-0000-0000-000000000003', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44');

-- Votes for Decision C
INSERT INTO public.votes ("userId", "optionId", "decisionId")
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'dc000000-0000-0000-0000-000000000301', 'd3000000-0000-0000-0000-000000000003'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'dc000000-0000-0000-0000-000000000301', 'd3000000-0000-0000-0000-000000000003'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'dc000000-0000-0000-0000-000000000301', 'd3000000-0000-0000-0000-000000000003'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'dc000000-0000-0000-0000-000000000302', 'd3000000-0000-0000-0000-000000000003');