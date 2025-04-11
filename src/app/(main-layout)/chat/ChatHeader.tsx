'use client';

import React from 'react';
import { Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'sonner';

import { deleteConversation } from '@/api/chatApi';
import { useChatStore } from '@/store/chat';

const { Title } = Typography;

interface ChatHeaderProps {
  onAddUser: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onAddUser }) => {
  const {
    selectedConversation,
    conversations,
    setConversations,
    setSelectedConversation
  } = useChatStore();

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await deleteConversation(selectedConversation.id);
      setConversations(conversations.filter((conv) => conv.id !== selectedConversation.id));
      setSelectedConversation(null);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
      <Title level={4}>
        {selectedConversation ? selectedConversation.name : 'Select a conversation'}
      </Title>
      <div style={{ display: 'flex', gap: '8px' }}>
        {selectedConversation && (
          <>
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteConversation}>
              Delete
            </Button>
            <Button onClick={onAddUser}>Add Member</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
