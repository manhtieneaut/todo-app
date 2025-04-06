-- Bảng cho users (dùng chung cho real-time và task)
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar NOT NULL UNIQUE,
  role varchar DEFAULT 'user',
  created_at timestamp DEFAULT current_timestamp
);

-- Bảng cho conversations (dùng trong real-time)
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar,
  created_by uuid REFERENCES public.users(id),
  created_at timestamp DEFAULT current_timestamp
);

-- Bảng cho conversation_members (dùng trong real-time)
CREATE TABLE public.conversation_members (
  conversation_id uuid REFERENCES public.conversations(id),
  user_id uuid REFERENCES public.users(id),
);

-- Bảng cho messages (dùng trong real-time)
CREATE TABLE public.messages (
  id serial PRIMARY KEY,
  conversation_id uuid REFERENCES public.conversations(id),
  sender_id uuid REFERENCES public.users(id),
  message text NOT NULL,
  file_url varchar,
  sent_at timestamp DEFAULT current_timestamp
);

-- Schema riêng cho task management
CREATE SCHEMA note_app;

-- Bảng cho tasks
-- Nếu bạn sử dụng schema public cho bảng users, thì tham chiếu cần phải là public.users(id)
-- Sửa lại tham chiếu đến bảng public.users
CREATE TABLE note_app.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar NOT NULL,
  description text,
  status varchar DEFAULT 'pending',
  created_by uuid REFERENCES public.users(id), -- Sửa từ note_app.users sang public.users
  assigned_to uuid REFERENCES public.users(id), -- Sửa từ note_app.users sang public.users
  due_date timestamp,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp
);

-- Sửa lại tham chiếu đến public.users trong bảng task_shares
CREATE TABLE note_app.task_shares (
  id serial PRIMARY KEY,
  task_id uuid REFERENCES note_app.tasks(id),
  shared_with uuid REFERENCES public.users(id), -- Sửa từ note_app.users sang public.users
  permission varchar DEFAULT 'view',
  shared_at timestamp DEFAULT current_timestamp
);


-- Bảng cho tags
CREATE TABLE note_app.tags (
  id serial PRIMARY KEY,
  name varchar NOT NULL UNIQUE,
  color varchar,
  created_at timestamp DEFAULT current_timestamp
);

-- Bảng cho task_tags (mối quan hệ nhiều-nhiều giữa tasks và tags)
CREATE TABLE note_app.task_tags (
  id serial PRIMARY KEY,
  task_id uuid REFERENCES note_app.tasks(id),
  tag_id int REFERENCES note_app.tags(id)
);
