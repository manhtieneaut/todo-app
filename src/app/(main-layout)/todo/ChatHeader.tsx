// components/ChatHeader.tsx
import React from 'react';

interface ChatHeaderProps {
  conversationName: string;
  onAddUser: () => void;
  onDeleteConversation: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversationName, onAddUser, onDeleteConversation }) => {
  return (
    <header className="p-4 border-b bg-gray-50 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{conversationName}</h1>
        <p className="text-sm text-gray-500">Start chatting below.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAddUser}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Add User
        </button>
        <button
          onClick={onDeleteConversation}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
