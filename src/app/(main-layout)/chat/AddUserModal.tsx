'use client';

import React from 'react';
import SearchUser from '@/component/SearchUser';

interface AddUserModalProps {
  open: boolean;
  selectedUser: { id: string; email: string } | null;
  onSelect: (user: { id: string; email: string }) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, selectedUser, onSelect, onAdd, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Add User to Conversation</h2>

        <SearchUser onSelect={onSelect} />

        {selectedUser && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <strong>{selectedUser.email}</strong>
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={onAdd} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
