// components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  conversations: any[];
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onCreateNew: () => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, currentConversationId, onConversationSelect, onCreateNew, loading }) => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 border-r overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
        <button onClick={onCreateNew} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          + New
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer ${
                currentConversationId === conv.id
                  ? 'bg-blue-100 text-blue-800 font-semibold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => onConversationSelect(conv.id)}
            >
              <strong>{conv.name || '(No name)'}</strong>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
