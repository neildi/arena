-- Aurelia Fine Jewelry Academy — core schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  location_type TEXT NOT NULL, -- luxury_boutique, bridal_showroom, cruise_travel, department_counter, independent, estate_auction, ecommerce_hybrid
  city TEXT,
  region TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id),
  location_id TEXT REFERENCES locations(id),
  name TEXT NOT NULL,
  manager_id TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES organizations(id),
  location_id TEXT REFERENCES locations(id),
  team_id TEXT REFERENCES teams(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL, -- learner, store_manager, trainer, district_leader, admin
  title TEXT,
  avatar_seed TEXT,
  experience_level TEXT,
  onboarded INTEGER NOT NULL DEFAULT 0,
  weekly_availability_hours INTEGER,
  region TEXT,
  market TEXT,
  career_goal TEXT,
  primary_skill_goal TEXT,
  retail_environment TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  track TEXT NOT NULL, -- foundations, specialist, leadership, trainer
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  path_id TEXT REFERENCES learning_paths(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  outcomes TEXT, -- json array
  estimated_minutes INTEGER DEFAULT 60,
  skill_tags TEXT, -- json array
  kpi_areas TEXT, -- json array
  level TEXT DEFAULT 'foundations',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT,
  sections TEXT, -- json array of {heading, body}
  key_terms TEXT, -- json array of {term, definition}
  client_language TEXT, -- json array of strings
  floor_tasks TEXT, -- json array of strings (quick refs; full tasks in floor_tasks table)
  scripts TEXT, -- json array of {title, dialogue}
  compliance_notes TEXT, -- json array of strings
  estimated_minutes INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES lessons(id),
  course_id TEXT REFERENCES courses(id),
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL REFERENCES flashcard_decks(id),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  lesson_id TEXT REFERENCES lessons(id),
  title TEXT NOT NULL,
  quiz_type TEXT NOT NULL DEFAULT 'knowledge_check', -- knowledge_check, final_assessment, drill, gia_reading, terminology, kpi_calc
  time_limit_seconds INTEGER,
  passing_score INTEGER DEFAULT 70,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id),
  question_type TEXT NOT NULL, -- multiple_choice, true_false, scenario, best_response
  prompt TEXT NOT NULL,
  options TEXT, -- json array of strings
  correct_answer TEXT NOT NULL, -- json-encoded index or value
  explanation TEXT,
  skill_tag TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT, -- json
  passed INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS role_play_scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  client_opening TEXT NOT NULL,
  situation TEXT,
  persona TEXT,
  skill_tags TEXT, -- json array
  guardrails TEXT, -- json array of strings
  branches TEXT, -- json: heuristic scripted client behavior tree
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS role_play_rubrics (
  id TEXT PRIMARY KEY,
  scenario_id TEXT REFERENCES role_play_scenarios(id),
  title TEXT NOT NULL,
  criteria TEXT NOT NULL, -- json array {key,label,description,weight}
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS role_play_attempts (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES role_play_scenarios(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  transcript TEXT NOT NULL, -- json array {role, text, ts}
  scores TEXT NOT NULL, -- json {criterionKey: score}
  overall_score INTEGER NOT NULL,
  strengths TEXT, -- json array
  improvements TEXT, -- json array
  recommended_next TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS floor_tasks (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES lessons(id),
  course_id TEXT REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  skill_tag TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS floor_task_logs (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES floor_tasks(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, planned, practiced, used_with_client, needs_manager_feedback, completed
  reflection_notes TEXT,
  evidence TEXT,
  manager_verified_by TEXT REFERENCES users(id),
  manager_verified_at TEXT,
  due_date TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learner_assignments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  assigned_by TEXT REFERENCES users(id),
  assignment_type TEXT NOT NULL, -- course, path, task, quiz, roleplay
  ref_id TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, overdue
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS coaching_notes (
  id TEXT PRIMARY KEY,
  manager_id TEXT NOT NULL REFERENCES users(id),
  learner_id TEXT NOT NULL REFERENCES users(id),
  skill_area TEXT,
  note TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'manager', -- manager, shared_with_learner
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS manager_observations (
  id TEXT PRIMARY KEY,
  manager_id TEXT NOT NULL REFERENCES users(id),
  learner_id TEXT NOT NULL REFERENCES users(id),
  skill TEXT NOT NULL,
  rubric TEXT, -- json {criterion: score}
  score INTEGER,
  notes TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  related_task_id TEXT REFERENCES floor_tasks(id),
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL, -- course_completion, demonstrated_skill, manager_verified
  icon TEXT,
  criteria TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  badge_id TEXT NOT NULL REFERENCES badges(id),
  earned_at TEXT NOT NULL,
  verified_by TEXT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  cert_uid TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id),
  course_id TEXT REFERENCES courses(id),
  badge_id TEXT REFERENCES badges(id),
  level TEXT NOT NULL, -- course_completion, demonstrated_skill, manager_verified
  title TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'issued', -- issued, manager_verified, revoked
  issued_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS kpi_definitions (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  formula TEXT,
  unit TEXT,
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS team_kpi_records (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id),
  kpi_key TEXT NOT NULL,
  period TEXT NOT NULL, -- e.g. 2026-08
  value REAL NOT NULL,
  target REAL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  org_id TEXT REFERENCES organizations(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience_role TEXT DEFAULT 'all',
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS content_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'general',
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS toolkit_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'guide', -- guide, checklist, script, comparison, reference
  summary TEXT,
  content TEXT, -- json structured content
  tags TEXT, -- json array
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS toolkit_favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  resource_id TEXT NOT NULL REFERENCES toolkit_resources(id),
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS toolkit_recent_views (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  resource_id TEXT NOT NULL REFERENCES toolkit_resources(id),
  viewed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  course_id TEXT NOT NULL REFERENCES courses(id),
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percent INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  completed_at TEXT,
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS path_enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  path_id TEXT NOT NULL REFERENCES learning_paths(id),
  created_at TEXT NOT NULL,
  UNIQUE(user_id, path_id)
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  activity_type TEXT NOT NULL, -- lesson_completed, quiz_completed, roleplay_completed, task_completed, badge_earned, cert_issued
  ref_id TEXT,
  summary TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user ON learner_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_tasklogs_user ON floor_task_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
