/*
# Wano AI - Core Database Schema

## Overview
Creates the full schema for the Wano AI education platform: user profiles, AI chat history,
flashcards, quizzes, notes summaries, study plans, file uploads, and progress tracking.
All tables are owner-scoped (multi-user with sign-in), using auth.uid() for RLS.

## New Tables

1. `profiles` - Extended user profile data (full name, avatar, bio, education level, goals)
   - `id` (uuid, PK, references auth.users)
   - `full_name` (text)
   - `avatar_url` (text, nullable)
   - `bio` (text, nullable)
   - `education_level` (text, nullable)
   - `goals` (text, nullable)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

2. `chat_messages` - AI chatbot conversation history
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `role` (text: 'user' | 'assistant')
   - `content` (text)
   - `created_at` (timestamptz)

3. `flashcards` - Generated flashcard decks and cards
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `topic` (text)
   - `question` (text)
   - `answer` (text)
   - `created_at` (timestamptz)

4. `quizzes` - Generated quizzes
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `topic` (text)
   - `question` (text)
   - `options` (jsonb array of strings)
   - `correct_index` (integer)
   - `explanation` (text, nullable)
   - `created_at` (timestamptz)

5. `notes` - Summarized notes
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `title` (text)
   - `original_text` (text)
   - `summary` (text)
   - `key_points` (jsonb array of strings)
   - `created_at` (timestamptz)

6. `study_plans` - Study planner entries
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `title` (text)
   - `subject` (text)
   - `description` (text, nullable)
   - `study_date` (date)
   - `duration_minutes` (integer)
   - `completed` (boolean, default false)
   - `created_at` (timestamptz)

7. `file_uploads` - Metadata for uploaded study files
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `file_name` (text)
   - `file_type` (text)
   - `file_size` (bigint)
   - `storage_path` (text)
   - `created_at` (timestamptz)

8. `progress_entries` - Progress tracking data
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users)
   - `activity_type` (text: 'quiz' | 'flashcard' | 'note' | 'chat' | 'study')
   - `score` (integer, nullable)
   - `total` (integer, nullable)
   - `metadata` (jsonb, nullable)
   - `created_at` (timestamptz)

## Security
- RLS enabled on ALL tables.
- All tables scoped to `authenticated` users with ownership checks via auth.uid() = user_id.
- profiles table uses auth.uid() = id (references auth.users directly).
- All user_id columns default to auth.uid() so client inserts omitting user_id succeed.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  bio text,
  education_level text,
  goals text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chats" ON chat_messages;
CREATE POLICY "select_own_chats" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_chats" ON chat_messages;
CREATE POLICY "insert_own_chats" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_chats" ON chat_messages;
CREATE POLICY "delete_own_chats" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL DEFAULT '',
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_flashcards" ON flashcards;
CREATE POLICY "select_own_flashcards" ON flashcards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_flashcards" ON flashcards;
CREATE POLICY "insert_own_flashcards" ON flashcards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_flashcards" ON flashcards;
CREATE POLICY "update_own_flashcards" ON flashcards FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_flashcards" ON flashcards;
CREATE POLICY "delete_own_flashcards" ON flashcards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL DEFAULT '',
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  correct_index integer NOT NULL DEFAULT 0,
  explanation text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_quizzes" ON quizzes;
CREATE POLICY "select_own_quizzes" ON quizzes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_quizzes" ON quizzes;
CREATE POLICY "insert_own_quizzes" ON quizzes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_quizzes" ON quizzes;
CREATE POLICY "delete_own_quizzes" ON quizzes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  original_text text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  key_points jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes" ON notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes" ON notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Study plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL DEFAULT '',
  description text,
  study_date date NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes integer NOT NULL DEFAULT 60,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_plans" ON study_plans;
CREATE POLICY "select_own_plans" ON study_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_plans" ON study_plans;
CREATE POLICY "insert_own_plans" ON study_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_plans" ON study_plans;
CREATE POLICY "update_own_plans" ON study_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_plans" ON study_plans;
CREATE POLICY "delete_own_plans" ON study_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT '',
  file_size bigint NOT NULL DEFAULT 0,
  storage_path text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_files" ON file_uploads;
CREATE POLICY "select_own_files" ON file_uploads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_files" ON file_uploads;
CREATE POLICY "insert_own_files" ON file_uploads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_files" ON file_uploads;
CREATE POLICY "delete_own_files" ON file_uploads FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Progress entries table
CREATE TABLE IF NOT EXISTS progress_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('quiz', 'flashcard', 'note', 'chat', 'study')),
  score integer,
  total integer,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON progress_entries;
CREATE POLICY "select_own_progress" ON progress_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_progress" ON progress_entries;
CREATE POLICY "insert_own_progress" ON progress_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id, study_date);
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress_entries(user_id, created_at);