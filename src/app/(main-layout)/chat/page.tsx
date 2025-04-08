'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layout, Menu, List, Input, Button, Typography, Upload, message as antdMessage, Modal } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabaseClient';
import { Message, Conversation } from './type';

import {
  fetchCurrentUser,
  fetchConversations,
  fetchMessages,
  sendMessage,
  uploadFileToBucket,
  createConversation,
  deleteConversation,
  addUserToConversation
} from './api';

import { useChatStore } from './store';
import { useAuthStore } from '@/app/(auth-layout)/login/store';
import SearchUser from '@/app/(main-layout)/(component)/SearchUser';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const ChatPage = () => {
  const {
    conversations,
    messages,
    currentUserId,
    selectedConversation,
    setConversations,
    setMessages,
    setCurrentUserId,
    setSelectedConversation,
    addMessage
  } = useChatStore();

  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConversationName, setNewConversationName] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userIdToAdd, setUserIdToAdd] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAuthStore((state) => state.currentUser);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) setCurrentUserId(user.id);

        const convs = await fetchConversations();
        setConversations(convs);
      } catch (err) {
        antdMessage.error('Failed to load initial data');
      }
    };
    init();
  }, [setCurrentUserId, setConversations]);

  useEffect(() => {
    if (!selectedConversation) return;

    const loadMessages = async () => {
      try {
        const msgs = await fetchMessages(selectedConversation.id);
        setMessages(msgs);
        scrollToBottom();
      } catch {
        antdMessage.error('Failed to load messages');
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
          addMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedConversation, setMessages, addMessage]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile || !selectedConversation || !currentUserId) return;

    try {
      let fileUrl = null;
      if (selectedFile) {
        fileUrl = await uploadFileToBucket(selectedFile);
      }

      await sendMessage(selectedConversation.id, currentUserId, newMessage, fileUrl);
      setNewMessage('');
      setSelectedFile(null);
    } catch {
      antdMessage.error('Failed to send message');
    }
  };

  const handleCreateConversation = async () => {
    if (!newConversationName.trim()) {
      antdMessage.error('Conversation name cannot be empty');
      return;
    }

    try {
      // Step 1: Create the conversation
      const data = await createConversation(newConversationName);
      // Step 3: Update state and UI
      setConversations([...conversations, ...data]);
      setNewConversationName('');
      setShowCreateModal(false);
      antdMessage.success('Conversation created and you were added as a member');
    } catch {
      antdMessage.error('Failed to create conversation');
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await deleteConversation(selectedConversation.id);
      setConversations(conversations.filter((conv) => conv.id !== selectedConversation.id));
      setSelectedConversation(null);
      antdMessage.success('Conversation deleted');
    } catch {
      antdMessage.error('Failed to delete conversation');
    }
  };

  const handleAddUserToConversation = async () => {
    if (!selectedConversation || !userIdToAdd) return;

    try {
      await addUserToConversation(selectedConversation.id, userIdToAdd);
      antdMessage.success('User added');
      setShowAddUserModal(false);
      setUserIdToAdd('');
      setSelectedUser(null);
    } catch {
      antdMessage.error('Failed to add user');
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme="light">
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Conversations</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>New</Button>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedConversation?.id || '']}
          onClick={({ key }) => {
            const conv = conversations.find(c => c.id === key);
            setSelectedConversation(conv || null);
          }}
        >
          {conversations.map((conv) => (
            <Menu.Item key={conv.id}>{conv.name}</Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>
            {selectedConversation ? selectedConversation.name : 'Select a conversation'}
          </Title>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedConversation && (
              <>
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDeleteConversation}>
                  Delete
                </Button>
                <Button onClick={() => setShowAddUserModal(true)}>Add Member</Button>
              </>
            )}
          </div>
        </Header>

        <Content style={{ padding: '16px', overflowY: 'auto', background: '#f0f2f5' }}>
          {selectedConversation ? (
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item
                  style={{
                    justifyContent: msg.sender_id === currentUserId ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '60%',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: msg.sender_id === currentUserId ? '#1890ff' : '#f0f0f0',
                      color: msg.sender_id === currentUserId ? '#fff' : '#000',
                    }}
                  >
                    {msg.message && <p>{msg.message}</p>}
                    {msg.file_url && (
                      <a
                        href={supabase.storage.from('chat-files').getPublicUrl(msg.file_url).data.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1890ff', textDecoration: 'underline' }}
                      >
                        {msg.file_url.split('/').pop()}
                      </a>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
              <p>Please select a conversation to start chatting.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Content>

        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
          <TextArea
            rows={2}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Attach File</Button>
            </Upload>
            <Button type="primary" onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </Layout>

      <Modal
        title="Create New Conversation"
        open={showCreateModal}
        onOk={handleCreateConversation}
        onCancel={() => setShowCreateModal(false)}
      >
        <Input
          placeholder="Conversation Name"
          value={newConversationName}
          onChange={(e) => setNewConversationName(e.target.value)}
        />
      </Modal>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add User to Conversation</h2>
            <SearchUser
              onSelect={(user) => {
                setSelectedUser(user);
                setUserIdToAdd(user.id);
              }}
            />
            {selectedUser && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <strong>{selectedUser.email}</strong>
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddUserModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleAddUserToConversation} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
