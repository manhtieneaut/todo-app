import { useEffect } from 'react';
import { fetchCurrentUser, fetchConversations } from '@/api/chatApi';
import { useChatStore } from '@/store/chat';
import { toast } from 'sonner';

export const useChatInit = () => {
  const { setCurrentUserId, setConversations, setSelectedConversation } = useChatStore();

  useEffect(() => {
    const init = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) setCurrentUserId(user.id);

        const convs = await fetchConversations();
        setConversations(convs);

        if (convs.length > 0) {
          setSelectedConversation(convs[0]);
        }
      } catch (err) {
        toast.error('Failed to load initial data');
      }
    };

    init();
  }, [setCurrentUserId, setConversations, setSelectedConversation]);
};
