// type.d.ts

export type Conversation = {
    id: string;
    name: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    message: string;
    file_url: string | null;
    sent_at: string;
  };
  