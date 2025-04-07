'use client';

// pages/chat.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Conversation } from './type'; // Import kiểu dữ liệu
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import CreateConversationModal from './CreateConversationModal';
import AddUserModal from './AddUserModal';
import ChatMesages from '@/app/(main-layout)/chat/ChatMessages'; // Import component ChatMessages

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false); // Modal thêm người dùng
  const [newName, setNewName] = useState<string>(''); // Tên nhóm chat mới
  const [userIdToAdd, setUserIdToAdd] = useState<string>(''); // ID người dùng cần thêm

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not logged in');
        return;
      }

      try {
        const { data: memberData, error: memberError } = await supabase
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (memberError) {
          console.error('Error fetching conversation members:', memberError);
          return;
        }

        const memberConversationIds = memberData?.map((member) => member.conversation_id) || [];

        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .or(`id.in.(${memberConversationIds.join(',')}),created_by.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (conversationError) {
          console.error('Error fetching conversations:', conversationError);
          return;
        }

        setConversations(conversationData || []);

        if (conversationData && conversationData.length > 0 && !currentConversationId) {
          setCurrentConversationId(conversationData[0].id);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentConversationId]);

  const handleCreateConversation = async () => {
    if (!newName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not logged in');
      return;
    }

    try {
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert([{
          name: newName,
          created_by: user.id,
        }])
        .select();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return;
      }

      const newConversation = conversationData?.[0];
      if (!newConversation) {
        console.error('Failed to create conversation');
        return;
      }

      const { error: memberError } = await supabase
        .from('conversation_members')
        .insert([{
          conversation_id: newConversation.id,
          user_id: user.id,
        }]);

      if (memberError) {
        console.error('Error adding creator to conversation_members:', memberError);
        return;
      }

      setConversations([newConversation, ...conversations]);
      setNewName('');
      setShowModal(false);

      setCurrentConversationId(newConversation.id);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleAddUserToConversation = async () => {
    if (!currentConversationId || !userIdToAdd.trim()) return;

    const { error } = await supabase
      .from('conversation_members')
      .insert([{
        conversation_id: currentConversationId,
        user_id: userIdToAdd,
      }]);

    if (error) {
      console.error('Error adding user to conversation:', error);
    } else {
      setUserIdToAdd('');
      setShowAddUserModal(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!currentConversationId) return;

    try {
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', currentConversationId);

      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        return;
      }

      setConversations(prev => prev.filter(conv => conv.id !== currentConversationId));
      setCurrentConversationId(null);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={setCurrentConversationId}
        onCreateNew={() => setShowModal(true)}
        loading={loading}
      />

      <main className="flex-1 flex flex-col bg-white shadow-md">
        {currentConversationId ? (
          <>
            <ChatHeader
              conversationName={conversations.find((conv) => conv.id === currentConversationId)?.name || 'Unnamed Conversation'}
              onAddUser={() => setShowAddUserModal(true)}
              onDeleteConversation={handleDeleteConversation}
            />
            <ChatMesages conversationId={currentConversationId} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h1 className="text-2xl font-bold">Welcome to Chat 👋</h1>
            <p className="mt-2">Select a conversation to start chatting.</p>
          </div>
        )}
      </main>

      {showModal && (
        <CreateConversationModal
          newName={newName}
          setNewName={setNewName}
          onCreateConversation={handleCreateConversation}
          onClose={() => setShowModal(false)}
        />
      )}

      {showAddUserModal && (
        <AddUserModal
          userIdToAdd={userIdToAdd}
          setUserIdToAdd={setUserIdToAdd}
          onAddUserToConversation={handleAddUserToConversation}
          onClose={() => setShowAddUserModal(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
