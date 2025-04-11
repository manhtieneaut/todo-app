import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchMessages } from '@/api/chatApi';
import { useChatStore } from '@/store/chat';
import { toast } from 'sonner';
import { Message } from '@/types/chat';

export const useMessagesListener = (scrollToBottom: () => void) => {
  const {
    selectedConversation,
    currentUserId,
    setMessages,
    addMessage,
  } = useChatStore();

  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      try {
        const msgs = await fetchMessages(selectedConversation.id);
        setMessages(msgs);
        scrollToBottom();
      } catch {
        toast.error('Failed to load messages');
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`messages:conversation_id=eq.${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          addMessage(newMsg);
          scrollToBottom();

          if (newMsg.sender_id !== currentUserId) {
            toast.info('New message received');
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedConversation, currentUserId, setMessages, addMessage, scrollToBottom]);
};
