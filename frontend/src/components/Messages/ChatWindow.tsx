import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, User as UserIcon, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { User } from '../../types';

interface ChatWindowProps {
  currentUser: User;
  users: User[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('register', currentUser.id);

    socketRef.current.on('receive_message', (message: any) => {
      if (
        (message.sender === selectedUser?.id && message.receiver === currentUser.id) ||
        (message.sender === currentUser.id && message.receiver === selectedUser?.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on('message_sent', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser.id, selectedUser?.id]);

  // Fetch message history when selected user changes
  useEffect(() => {
    if (!selectedUser) return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/messages/${selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();
  }, [selectedUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if ((!newMessageText.trim() && !selectedFile) || !selectedUser || !socketRef.current || isUploading) return;

    setIsUploading(true);
    let uploadedImagePath = '';

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/messages/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          uploadedImagePath = data.imagePath;
        }
      } catch (err) {
        console.error('Error uploading message image:', err);
      }
    }

    const msgData = {
      sender: currentUser.id,
      receiver: selectedUser.id,
      content: newMessageText.trim(),
      image: uploadedImagePath,
    };

    socketRef.current.emit('send_message', msgData);
    setNewMessageText('');
    handleClearFile();
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex overflow-hidden relative">
      {/* Sidebar - Users list */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-200 flex-col bg-white`}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-gray-800 text-lg">Connections</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${
                selectedUser?.id === u.id
                  ? 'bg-emerald-50 border-l-4 border-emerald-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <img
                src={u.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-150"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.title}</p>
              </div>
            </button>
          ))}
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              Connect with users in the Network tab to start chatting!
            </div>
          )}
        </div>
      </div>

      {/* Main chat window */}
      <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-gray-50`}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg md:hidden text-gray-600 transition-colors mr-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.title}</p>
                </div>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => {
                const isMine = msg.sender === currentUser.id;
                return (
                  <div
                    key={msg.id || msg._id || index}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMine
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-850 rounded-tl-none border border-gray-100'
                      }`}
                    >
                      {msg.image && (
                        <div className="mb-2 rounded-lg overflow-hidden max-w-xs">
                          <img
                            src={msg.image}
                            alt="Attachment"
                            className="w-full max-h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          isMine ? 'text-emerald-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {previewUrl && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-24 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    onClick={handleClearFile}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-650 transition-colors shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0"
                  title="Attach Photo"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-10 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={(!newMessageText.trim() && !selectedFile) || isUploading}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isUploading ? '...' : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Your Chat</h3>
            <p className="text-gray-500 max-w-xs">
              Select a connection from the left sidebar to start messaging in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
