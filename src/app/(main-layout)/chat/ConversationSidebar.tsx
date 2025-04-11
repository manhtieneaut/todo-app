'use client';

import React from 'react';
import { Menu, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useChatStore } from '@/store/chat';

const { Title } = Typography;

interface Props {
  onCreateClick: () => void;
}

const ConversationSidebar: React.FC<Props> = ({ onCreateClick }) => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
  } = useChatStore();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Conversations</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>New</Button>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedConversation?.id || '']}
        onClick={({ key }) => {
          const conv = conversations.find(c => c.id === key);
          setSelectedConversation(conv || null);
        }}
        style={{ borderRight: 'none', flex: 1 }}
        items={conversations.map((conv) => ({
          key: conv.id,
          label: (
            <span style={{ fontWeight: selectedConversation?.id === conv.id ? 'bold' : 'normal' }}>
              {conv.name}
            </span>
          ),
        }))}
      />
    </div>
  );
};

export default ConversationSidebar;
