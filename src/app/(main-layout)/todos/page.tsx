'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Layout, Menu, List, Input, Button, Typography, Upload, message as antdMessage, Modal } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchUser from '@/app/(main-layout)/(component)/SearchUser'; // Import SearchUser component

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

interface Conversation {
  id: string;
  name: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string | null;
  file_url: string | null;
  sent_at: string;
}

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // State to control modal visibility
  const [newConversationName, setNewConversationName] = useState(''); // State for new conversation name
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State for modal visibility
  const [userIdToAdd, setUserIdToAdd] = useState<string>(''); // State for selected user ID
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null); // State for selected user
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };

    const fetchConversations = async () => {
      const { data, error } = await supabase.from('conversations').select('*');
      if (!error && data) setConversations(data);
    };

    fetchCurrentUser();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('sent_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    fetchMessages();

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
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedConversation]);

  const uploadFileToBucket = async (file: File) => {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const { data, error } = await supabase.storage.from('chat-files').upload(fileName, file);
    if (error) {
      antdMessage.error('Failed to upload file');
      return null;
    }
    return data?.path || null;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !selectedConversation) return;

    let fileUrl = null;
    if (selectedFile) {
      fileUrl = await uploadFileToBucket(selectedFile);
      if (!fileUrl) return;
    }

    await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      message: newMessage,
      file_url: fileUrl,
    });

    setNewMessage('');
    setSelectedFile(null);
  };

  const handleCreateConversation = async () => {
    if (!newConversationName.trim()) {
      antdMessage.error('Conversation name cannot be empty');
      return;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([{ name: newConversationName }])
      .select();

    if (error) {
      antdMessage.error('Failed to create conversation');
    } else {
      setConversations((prev) => [...prev, ...(data || [])]);
      setNewConversationName('');
      setShowCreateModal(false);
      antdMessage.success('Conversation created successfully');
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;

    const isConfirmed = window.confirm(
      'Are you sure you want to delete this conversation? This action cannot be undone.'
    );

    if (isConfirmed) {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', selectedConversation.id);

      if (error) {
        antdMessage.error('Failed to delete conversation');
      } else {
        setConversations((prev) =>
          prev.filter((conv) => conv.id !== selectedConversation.id)
        );
        setSelectedConversation(null);
        antdMessage.success('Conversation deleted successfully');
      }
    }
  };

  const handleAddUserToConversation = async () => {
    if (!selectedConversation || !userIdToAdd) return;

    const { error } = await supabase
      .from('conversation_member')
      .insert({
        conversation_id: selectedConversation.id,
        user_id: userIdToAdd,
      });

    if (error) {
      antdMessage.error('Failed to add user to the conversation');
    } else {
      antdMessage.success('User added successfully');
      setShowAddUserModal(false);
      setUserIdToAdd('');
      setSelectedUser(null);
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme="light">
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Conversations
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowCreateModal(true)}
          >
            New
          </Button>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedConversation?.id || '']}
          onClick={({ key }) => {
            const conversation = conversations.find((conv) => conv.id === key);
            setSelectedConversation(conversation || null);
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
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteConversation}
                >
                  Delete
                </Button>
                <Button
                  type="default"
                  onClick={() => setShowAddUserModal(true)}
                >
                  Add Member
                </Button>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: '#888',
                fontSize: '16px',
              }}
            >
              <p>Please select a conversation to start chatting.</p>
            </div>
          )}
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
            <Button type="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </div>
      </Layout>

      {showCreateModal && (
        <Modal
          title="Create New Conversation"
          visible={showCreateModal}
          onOk={handleCreateConversation}
          onCancel={() => setShowCreateModal(false)}
        >
          <Input
            placeholder="Conversation Name"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
          />
        </Modal>
      )}

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
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserToConversation}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
