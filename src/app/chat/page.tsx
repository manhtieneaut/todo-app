"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/supabaseClient";
import useAuthStore from "@/lib/authStore";

// Define types
interface ChatGroup {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Message {
    id: string;
    content: string;
    file_url?: string | null;
    created_at: string;
    updated_at: string;
    chat_group_id: string;
}

export default function MessengerLayout() {
    const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
    const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);


    // Lấy thông tin người dùng từ store

    // Fetch groups
    useEffect(() => {
        const fetchGroups = async () => {
            const { data, error } = await supabase
                .from("chat_groups")
                .select("*")
                .order("created_at");

            if (data) {
                setChatGroups(data as ChatGroup[]);
                if (data.length > 0) setActiveGroup(data[0] as ChatGroup);
            } else {
                console.error("Lỗi lấy nhóm:", error);
            }
        };

        fetchGroups();
    }, []);

    // Fetch messages when group changes
    useEffect(() => {
        if (!activeGroup) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("chat_group_id", activeGroup.id)
                .order("created_at");

            if (data) {
                setMessages(data as Message[]);
            } else {
                console.error("Lỗi lấy tin nhắn:", error);
            }
        };

        fetchMessages();
    }, [activeGroup]);

    // Subscribe to real-time messages
    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                if (activeGroup?.id === payload.new.chat_group_id) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        payload.new as Message,
                    ]);
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === payload.new.id ? (payload.new as Message) : msg
                    )
                );
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== payload.old.id)
                );
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeGroup]);

    const sendMessage = async () => {
        if (!newMsg.trim() && !file && !activeGroup) return;

        let fileUrl = null;

        // Nếu có file, upload lên Supabase Storage
        if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('chat-files')
                .upload(fileName, file);

            if (uploadError) {
                console.error("Lỗi upload tệp:", uploadError.message);
                return;
            }

            fileUrl = data?.path ? supabase.storage.from('chat-files').getPublicUrl(data.path).data.publicUrl : null;
        }

        const { error } = await supabase.from("messages").insert([
            {
                chat_group_id: activeGroup?.id ?? "",
                content: newMsg,
                file_url: fileUrl,
            },
        ]);

        if (error) {
            console.error("Lỗi gửi tin nhắn:", error.message);
        }

        // Reset form after sending message
        setNewMsg("");
        setFile(null); // Reset file input after sending
    };

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r p-4 shadow-lg rounded-lg overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">📂 Phòng chat</h2>
                <ul className="space-y-4">
                    {chatGroups.map((group) => (
                        <li
                            key={group.id}
                            onClick={() => setActiveGroup(group)}
                            className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${activeGroup?.id === group.id
                                ? "bg-blue-500 text-white font-semibold"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {group.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Chat Content */}
            <main className="flex-1 p-6 flex flex-col">
                <header className="mb-6 border-b pb-3">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        💬 {activeGroup ? activeGroup.name : "Chọn phòng để bắt đầu"}
                    </h2>
                </header>

                <div
                    className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 space-y-4 max-h-[60vh]"
                    style={{ maxHeight: "60vh" }}
                >
                    {messages.length === 0 && (
                        <p className="text-gray-400 italic">Chưa có tin nhắn nào...</p>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-4 rounded-xl ${msg.file_url ? "bg-transparent" : "bg-gray-200 text-black"
                                } self-start max-w-fit`}
                        >
                            <p className={`break-words whitespace-pre-line text-sm ${msg.file_url ? "text-black" : ""}`}>
                                {msg.content}
                            </p>
                            {msg.file_url && (
                                <div className="mt-2 bg-gray-100 p-2 rounded-lg">
                                    {/* Kiểm tra nếu là hình ảnh */}
                                    {msg.file_url.endsWith(".jpg") || msg.file_url.endsWith(".png") || msg.file_url.endsWith(".jpeg") ? (
                                        <img
                                            src={msg.file_url}
                                            alt="file preview"
                                            className="max-w-full h-auto rounded-md"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            {/* Biểu tượng tệp đính kèm */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3a2 2 0 00-2-2H3a2 2 0 00-2 2v18a2 2 0 002 2h12a2 2 0 002-2V11a2 2 0 00-2-2h-5" />
                                            </svg>
                                            {/* Hiển thị tên tệp */}
                                            <a
                                                href={msg.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 text-sm"
                                            >
                                                {msg.file_url.split("/").pop()} {/* Lấy tên tệp từ URL */}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}


                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="relative">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="border border-gray-300 rounded-lg px-4 py-3"
                        />
                        {file && (
                            <button
                                onClick={() => setFile(null)}
                                className="absolute top-0 right-0 text-red-500 text-xl"
                            >
                                ✖
                            </button>
                        )}
                    </div>
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                        Gửi
                    </button>
                </div>
            </main>
        </div>
    );
}


