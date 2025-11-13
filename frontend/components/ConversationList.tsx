// components/ConversationList.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
}

interface ConversationInfo {
  id: string;
  otherParticipant: User;
  lastMessage: string | null;
  lastMessageTimestamp: number | null;
}

interface ConversationListProps {
  currentUser: User;
  conversations: ConversationInfo[];
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string) => void;
  fetchConversations: () => void;
  API_BASE_URL: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  currentUser,
  conversations,
  selectedConversationId,
  setSelectedConversationId,
  fetchConversations,
  API_BASE_URL,
}) => {
  const [newChatUserId, setNewChatUserId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatUserId.trim() || isCreating) return;

    try {
      setIsCreating(true);
      const response = await axios.post(
        `${API_BASE_URL}/conversations`, 
        { otherUserId: newChatUserId.trim() }, 
        { headers: { 'x-user-id': currentUser.id } }
      );

      fetchConversations();
      setSelectedConversationId(response.data.conversationId);
      setNewChatUserId('');
      setShowNewChatForm(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error starting new conversation:', error);
      alert('Failed to start conversation. Check user ID and ensure it is not yourself.');
      setIsCreating(false);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate gradient color based on name
  const getGradientForName = (name: string) => {
    const gradients = [
      'from-blue-500 via-blue-600 to-indigo-600',
      'from-purple-500 via-purple-600 to-pink-600',
      'from-green-500 via-emerald-600 to-teal-600',
      'from-orange-500 via-red-500 to-red-600',
      'from-cyan-500 via-blue-500 to-blue-600',
      'from-violet-500 via-purple-600 to-purple-600',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>

      {/* Search & New Chat Section */}
      <div className="relative z-10 p-4 space-y-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
        {/* User Info Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-2xl">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{currentUser.name}</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400">Online</span>
            </p>
          </div>
        </div>

        {/* Search bar with glass effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity"></div>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full pl-12 pr-10 py-3 bg-white/10 border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/15 transition-all duration-200 text-sm placeholder:text-gray-400 text-white backdrop-blur-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* New Chat Button with gradient */}
        <button
          onClick={() => setShowNewChatForm(!showNewChatForm)}
          className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg className={`relative w-5 h-5 transition-transform duration-300 ${showNewChatForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative">{showNewChatForm ? 'Cancel' : 'New Conversation'}</span>
        </button>

        {/* New Chat Form with animation */}
        {showNewChatForm && (
          <div className="space-y-2 animate-[slideDown_0.3s_ease-out]">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within/input:opacity-20 blur transition-opacity"></div>
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="Enter User ID (e.g., user2, user3)"
                value={newChatUserId}
                onChange={(e) => setNewChatUserId(e.target.value)}
                className="relative w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/15 transition-all duration-200 text-sm placeholder:text-gray-400 text-white backdrop-blur-xl"
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              onClick={handleStartNewChat}
              disabled={isCreating || !newChatUserId.trim()}
              className="group relative w-full px-4 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-2xl disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isCreating ? (
                <span className="relative flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                <span className="relative">Start Conversation</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-[fadeIn_0.5s_ease-out]">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? 'No matches found' : 'No Conversations Yet'}
            </h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {searchQuery 
                ? `Try searching for a different name` 
                : 'Start a new conversation to begin messaging'}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filteredConversations.map((conv, index) => {
              const isSelected = selectedConversationId === conv.id;
              const gradient = getGradientForName(conv.otherParticipant.name);
              
              return (
                <li
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`relative group cursor-pointer transition-all duration-300 animate-[slideIn_0.3s_ease-out] ${
                    isSelected 
                      ? 'bg-white/10 backdrop-blur-xl' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Selection indicator with gradient */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-r shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 blur-sm"></div>
                    </div>
                  )}

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none rounded-r"></div>

                  <div className="relative flex items-center gap-4 px-5 py-4">
                    {/* Avatar with gradient and animation */}
                    <div className="relative flex-shrink-0 group/avatar">
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-md opacity-60 group-hover/avatar:opacity-100 transition-opacity`}></div>
                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-2xl transform group-hover/avatar:scale-110 transition-all duration-300 border border-white/20 ${
                        isSelected ? 'scale-110 ring-2 ring-white/30' : ''
                      }`}>
                        {conv.otherParticipant.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Online indicator with pulse */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-slate-900 rounded-full shadow-lg z-10">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`font-bold truncate transition-colors ${
                          isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        }`}>
                          {conv.otherParticipant.name}
                        </h3>
                        <span className={`text-xs flex-shrink-0 ml-3 font-medium px-2 py-1 rounded-full backdrop-blur-xl border transition-colors ${
                          isSelected 
                            ? 'text-blue-300 bg-blue-500/20 border-blue-400/30' 
                            : 'text-gray-400 bg-white/5 border-white/10'
                        }`}>
                          {formatTimestamp(conv.lastMessageTimestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate flex-1 transition-colors ${
                          isSelected ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                        }`}>
                          {conv.lastMessage || (
                            <span className="italic text-gray-500">No messages yet</span>
                          )}
                        </p>
                        
                        {/* Unread indicator */}
                        {!isSelected && conv.lastMessage && (
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-500 rounded-full blur-sm animate-pulse"></div>
                            <div className="relative w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chevron for selected */}
                    {isSelected && (
                      <div className="flex-shrink-0 animate-[slideInRight_0.3s_ease-out]">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 blur-md opacity-50"></div>
                          <svg className="relative w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.4;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
};

export default ConversationList;