'use client';

import React from 'react';
import { Modal } from 'antd';

interface CreateConversationModalProps {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  open,
  value,
  onChange,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title="Create New Conversation"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Create"
      cancelText="Cancel"
    >
      <input
        className="w-full border p-2 rounded"
        placeholder="Conversation Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Modal>
  );
};

export default CreateConversationModal;
