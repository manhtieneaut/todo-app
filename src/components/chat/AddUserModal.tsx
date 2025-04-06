// components/AddUserModal.tsx
import React from 'react';

interface AddUserModalProps {
  userIdToAdd: string;
  setUserIdToAdd: React.Dispatch<React.SetStateAction<string>>;
  onAddUserToConversation: () => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ userIdToAdd, setUserIdToAdd, onAddUserToConversation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Add User to Conversation</h2>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter user ID..."
          value={userIdToAdd}
          onChange={(e) => setUserIdToAdd(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={onAddUserToConversation} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
