'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Layout, List } from 'antd';
import { supabase } from '@/lib/supabaseClient';
import { useChatStore } from '@/store/chat';
import ConversationSidebar from './ConversationSidebar';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import CreateConversationModal from './CreateConversationModal';
import AddUserModal from './AddUserModal';
import { useChatInit } from '@/hooks/useChatInit';
import { useMessagesListener } from '@/hooks/useMessagesListener';

const { Header, Content } = Layout;

const ChatPage = () => {
  const {
    messages,
    conversations,
    currentUserId,
    selectedConversation,
    setConversations,
    sendNewMessage,
    createNewConversation,
    addUser,
  } = useChatStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userIdToAdd, setUserIdToAdd] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useChatInit();
  useMessagesListener(scrollToBottom);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSendMessage = async (message: string, file: File | null) => {
    await sendNewMessage(message, file);
  };

  const handleCreateConversation = async () => {
    await createNewConversation(newConversationName);
    setNewConversationName('');
    setShowCreateModal(false);
  };

  const handleAddUserToConversation = async () => {
    await addUser(userIdToAdd);
    setShowAddUserModal(false);
    setUserIdToAdd('');
    setSelectedUser(null);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider width={300} theme="light">
        <ConversationSidebar onCreateClick={() => setShowCreateModal(true)} />
      </Layout.Sider>

      <Layout>
        <Header style={{ padding: 0 }}>
          <ChatHeader onAddUser={() => setShowAddUserModal(true)} />
        </Header>

        <Content style={{ padding: '16px', overflowY: 'auto', background: '#f0f2f5' }}>
          {selectedConversation ? (
            <List
              dataSource={messages}
              renderItem={(msg) => {
                const isOwn = msg.sender_id === currentUserId;
                return (
                  <List.Item style={{ justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '10px 16px',
                        borderRadius: '16px',
                        background: isOwn ? '#1890ff' : '#f5f5f5',
                        color: isOwn ? '#fff' : '#000',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.message && <p style={{ marginBottom: msg.file_url ? 8 : 0 }}>{msg.message}</p>}
                      {msg.file_url && (
                        <a
                          href={supabase.storage.from('chat-files').getPublicUrl(msg.file_url).data.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: isOwn ? '#fff' : '#1890ff', textDecoration: 'underline' }}
                        >
                          📎 {msg.file_url.split('/').pop()}
                        </a>
                      )}
                    </div>
                  </List.Item>
                );
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>Please select a conversation to start chatting.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Content>

        <MessageInput onSend={handleSendMessage} />
      </Layout>

      <CreateConversationModal
        open={showCreateModal}
        value={newConversationName}
        onChange={setNewConversationName}
        onOk={handleCreateConversation}
        onCancel={() => setShowCreateModal(false)}
      />

      <AddUserModal
        open={showAddUserModal}
        selectedUser={selectedUser}
        onSelect={(user) => {
          setSelectedUser(user);
          setUserIdToAdd(user.id);
        }}
        onAdd={handleAddUserToConversation}
        onCancel={() => {
          setShowAddUserModal(false);
          setSelectedUser(null);
          setUserIdToAdd('');
        }}
      />
    </Layout>
  );
};

export default ChatPage;
