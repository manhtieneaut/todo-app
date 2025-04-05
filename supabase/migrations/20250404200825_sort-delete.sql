-- Tạo migration để thêm trường deleted_at vào các bảng

-- Table for users
ALTER TABLE public.users
ADD COLUMN deleted_at timestamp;

-- Table for tasks
ALTER TABLE note_app.tasks
ADD COLUMN deleted_at timestamp;

-- Table for task_shares
ALTER TABLE note_app.task_shares
ADD COLUMN deleted_at timestamp;

-- Table for conversations
ALTER TABLE public.conversations
ADD COLUMN deleted_at timestamp;

-- Table for conversation_members
ALTER TABLE public.conversation_members
ADD COLUMN deleted_at timestamp;

-- Table for messages
ALTER TABLE public.messages
ADD COLUMN deleted_at timestamp;

-- Table for tags
ALTER TABLE note_app.tags
ADD COLUMN deleted_at timestamp;

-- Table for task_tags
ALTER TABLE note_app.task_tags
ADD COLUMN deleted_at timestamp;
