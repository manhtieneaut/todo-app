// components/CreateConversationModal.tsx
import React from 'react';

interface CreateConversationModalProps {
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  onCreateConversation: () => void;
  onClose: () => void;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({ newName, setNewName, onCreateConversation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Conversation</h2>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter conversation name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={onCreateConversation} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;
