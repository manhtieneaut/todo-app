'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Message } from '@/app/chat/type'; // Import kiểu dữ liệu

interface MessageListProps {
  conversationId: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file được chọn
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Lưu ID người dùng hiện tại
  const MAX_MESSAGES = 50; // Giới hạn số lượng tin nhắn hiển thị

  // Ref để theo dõi phần tử cuối cùng
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Hàm cuộn xuống cuối danh sách
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch tin nhắn khi conversationId thay đổi
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('sent_at', { ascending: true })
        .limit(MAX_MESSAGES); // Chỉ lấy tối đa MAX_MESSAGES tin nhắn

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
        scrollToBottom(); // Cuộn xuống cuối khi tải tin nhắn
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom(); // Cuộn xuống cuối khi danh sách tin nhắn thay đổi
  }, [messages]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id); // Lưu ID người dùng hiện tại
      }
    };

    fetchCurrentUser();

    // Đăng ký real-time cho bảng `messages`
    const channel = supabase
      .channel(`messages:conversation_id=eq.${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, payload.new as Message];

            // Giới hạn số lượng tin nhắn hiển thị
            if (updatedMessages.length > MAX_MESSAGES) {
              return updatedMessages.slice(-MAX_MESSAGES); // Chỉ giữ lại MAX_MESSAGES tin nhắn mới nhất
            }

            return updatedMessages;
          });
        }
      )
      .subscribe();

    // Clean up khi component unmount
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  // Hàm chuẩn hóa tên file
  const sanitizeFileName = (fileName: string) => {
    return fileName
      .normalize('NFD') // Chuẩn hóa Unicode để loại bỏ dấu
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
      .toLowerCase() // Chuyển tất cả ký tự thành chữ thường
      .replace(/[^a-z0-9.-]/g, '-') // Thay thế ký tự không hợp lệ bằng dấu gạch ngang
      .replace(/-+/g, '-') // Loại bỏ dấu gạch ngang thừa
      .replace(/^-|-$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
  };

  // Hàm upload file lên Supabase Storage
  const uploadFileToBucket = async (file: File, conversationId: string) => {
    const sanitizedFileName = sanitizeFileName(file.name); // Chuẩn hóa tên file
    const fileName = `${conversationId}/${Date.now()}-${sanitizedFileName}`; // Tạo tên file duy nhất

    const { data, error } = await supabase.storage
      .from('chat-files') // Tên bucket
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Trả về đường dẫn file
    return data?.path;
  };

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return; // Không gửi nếu không có tin nhắn hoặc file

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not logged in');
      return;
    }

    let fileUrl = null;

    // Upload file nếu có
    if (selectedFile) {
      fileUrl = await uploadFileToBucket(selectedFile, conversationId);
      if (!fileUrl) {
        console.error('Failed to upload file');
        return;
      }
    }

    // Gửi tin nhắn kèm đường dẫn file (nếu có)
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: user.id,
          message: newMessage,
          file_url: fileUrl, // Lưu đường dẫn file vào đây
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage(''); // Reset input tin nhắn
      setSelectedFile(null); // Reset file
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Danh sách tin nhắn */}
      <div className="overflow-y-auto p-4 bg-gray-50" style={{ height: '400px' }}>
        <ul className="space-y-4">
          {messages.map((msg, index) => (
            <li
              key={`${msg.id}-${index}`}
              className={`flex ${
                msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender_id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.message}</p>
                {msg.file_url && (
                  <a
                    href={`${supabase.storage.from('chat-files').getPublicUrl(msg.file_url).data.publicUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        {/* Phần tử cuối cùng để cuộn */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input cố định ở dưới cùng */}
      <div className="bg-white p-4 border-t" style={{ height: '150px' }}>
        <textarea
          className="w-full p-2 border rounded mb-2 h-[60px] resize-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-500"
          />
          {selectedFile && (
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
          )}
        </div>
        <button
          onClick={handleSendMessage}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageList;