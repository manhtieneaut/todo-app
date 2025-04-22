"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Layout, List } from 'antd';
import { supabase } from '@/lib/supabaseClient';
import { useChatStore } from '@/store/chat';
import { FilePdfOutlined, FileTextOutlined, PaperClipOutlined } from '@ant-design/icons'; // Import icons
import ConversationSidebar from './ConversationSidebar';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import CreateConversationModal from './CreateConversationModal';
import AddUserModal from './AddUserModal';
import { useChatInit } from '@/hooks/useChatInit';
import { useMessagesListener } from '@/hooks/useMessagesListener';

const { Sider, Header, Content } = Layout;

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
    <Layout style={{ height: '800px', overflow: 'hidden' }}>
      <Sider width={300} theme="light">
        <ConversationSidebar onCreateClick={() => setShowCreateModal(true)} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <ChatHeader onAddUser={() => setShowAddUserModal(true)} />
        </Header>

        <Content style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          {/* Vùng tin nhắn cuộn được */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f0f2f5' }}>
            {selectedConversation ? (
              <List
                dataSource={messages}
                renderItem={(msg) => {
                  const isOwn = msg.sender_id === currentUserId;
                  const fileName = msg.file_url?.split('/').pop() || '';
                  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                  const fileIcon = fileExt === 'pdf' ? <FilePdfOutlined /> : fileExt === 'doc' || fileExt === 'docx' ? <FileTextOutlined /> : <PaperClipOutlined />;

                  return (
                    <List.Item
                      style={{
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        flexDirection: 'column',
                        alignItems: isOwn ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {msg.message && (
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            background: isOwn ? '#1890ff' : '#f5f5f5',
                            color: isOwn ? '#fff' : '#000',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            wordBreak: 'break-word',
                            marginBottom: msg.file_url ? '12px' : 0,
                          }}
                        >
                          {msg.message}
                        </div>
                      )}

                      {/* Hiển thị file đính kèm giống Zalo */}
                      {msg.file_url && (
                        <div
                          style={{
                            maxWidth: 'fit-content', // Giới hạn chiều rộng của thẻ file bằng chiều rộng của tên file
                            display: 'inline-flex', // Để biểu tượng và văn bản không chiếm hết chiều ngang
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            background: '#f5f5f5',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            wordBreak: 'break-word', // Đảm bảo không bị tràn chữ ra ngoài
                          }}
                        >
                          <div style={{ fontSize: '22px', color: '#1890ff' }}>{fileIcon}</div>
                          <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <div style={{ fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fileName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              <a
                                href={supabase.storage.from('chat-files').getPublicUrl(msg.file_url).data.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#1890ff',
                                  fontSize: '13px',
                                  textDecoration: 'underline',
                                }}
                              >
                                Tải xuống
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                    </List.Item>
                  );
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                <p>Vui lòng chọn một cuộc trò chuyện để bắt đầu.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Vùng nhập tin nhắn cố định dưới cùng */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #d9d9d9', background: '#fff' }}>
            <MessageInput onSend={handleSendMessage} />
          </div>
        </Content>
      </Layout>

      {/* Modal tạo nhóm chat */}
      <CreateConversationModal
        open={showCreateModal}
        value={newConversationName}
        onChange={setNewConversationName}
        onOk={handleCreateConversation}
        onCancel={() => setShowCreateModal(false)}
      />

      {/* Modal thêm người dùng */}
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
