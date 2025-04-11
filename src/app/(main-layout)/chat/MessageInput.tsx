'use client';

import React, { useState } from 'react';
import { Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface MessageInputProps {
  onSend: (message: string, file: File | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSend(message, file);
    setMessage('');
    setFile(null);
  };

  return (
    <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
      <TextArea
        rows={2}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: '8px', borderRadius: '8px' }}
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Attach</Button>
        </Upload>
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
