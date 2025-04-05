-- Bật RLS cho bảng users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng tasks
ALTER TABLE note_app.tasks ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng task_shares
ALTER TABLE note_app.task_shares ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng conversation_members
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng tags
ALTER TABLE note_app.tags ENABLE ROW LEVEL SECURITY;

-- Bật RLS cho bảng task_tags
ALTER TABLE note_app.task_tags ENABLE ROW LEVEL SECURITY;
