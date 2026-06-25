import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';
import { User } from '../../types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AiAssistantProps {
  user: User;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hi ${user.name}! I am your **Global Connect AI Career Coach** 🚀\n\nI can help you build high-converting outreach messages, prepare for coding and behavioral interviews, optimize your profile summary, or give resume feedback.\n\nChoose one of the suggestions below or type your question!`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: 'Suggest general resume tips', query: 'Can you give me some general resume optimization tips?' },
    { text: 'Draft a connection message', query: 'Can you draft a professional connection outreach template for LinkedIn?' },
    { text: 'Simulate a mock interview', query: 'Can you help me prepare for a technical interview using the STAR method?' },
    { text: 'Help with profile summary', query: 'Can you write a short, impactful profile bio for a developer?' }
  ];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          sender: 'ai',
          text: data.response,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      console.error('AI Assistant error:', err);
      const errorMsg: Message = {
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the advice engine. Please try again in a moment!',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Career Coach</h2>
            <p className="text-xs text-emerald-100">Powered by Global Connect AI</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([
            {
              sender: 'ai',
              text: `Hi ${user.name}! I am your **Global Connect AI Career Coach** 🚀\n\nI can help you build high-converting outreach messages, prepare for coding and behavioral interviews, optimize your profile summary, or give resume feedback.\n\nChoose one of the suggestions below or type your question!`,
              timestamp: new Date()
            }
          ])}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors text-white text-xs flex items-center space-x-1"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={index}
              className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                  isAi
                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-150'
                    : 'bg-emerald-600 text-white rounded-tr-none'
                }`}
              >
                {/* Parse simple markdown items (bold, bullets) */}
                <div className="leading-relaxed whitespace-pre-wrap text-sm">
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Check for lists
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return (
                        <div key={lIdx} className="pl-4 my-1 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    // Handle headers/titles (bold)
                    let content: React.ReactNode = line;
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    if (boldRegex.test(line)) {
                      const parts = line.split(boldRegex);
                      content = parts.map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-900">{part}</strong> : part
                      );
                    }
                    return <p key={lIdx} className="mb-1">{content}</p>;
                  })}
                </div>
                <span
                  className={`block text-[9px] mt-1 text-right ${
                    isAi ? 'text-gray-400' : 'text-emerald-100'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 rounded-2xl rounded-tl-none border border-gray-150 px-5 py-3 text-sm shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.query)}
              className="text-xs bg-white text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-250 rounded-full px-3 py-1.5 transition-all duration-205 shadow-sm"
            >
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputText);
            }}
            placeholder="Ask AI Career Coach for guidance..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-10 text-sm"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || loading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
