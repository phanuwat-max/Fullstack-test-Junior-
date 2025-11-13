// app/page.tsx 
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ConversationList from '../../components/ConversationList';
import ChatRoom from '../../components/ChatRoom';
import LoginScreen from '../../components/LoginScreen';

const API_BASE_URL = 'http://localhost:3001';

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

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (userId: string, userName: string) => {
    setAuthUserId(userId);
    setCurrentUser({ id: userId, name: userName }); 
    setError(null);
  }

  const handleLogout = () => {
    setAuthUserId(null);
    setCurrentUser(null);
    setConversations([]);
    setSelectedConversationId(null);
    setError(null);
  }

  const fetchCurrentUser = async () => {
    if (!authUserId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { 'x-user-id': authUserId }, 
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user after login:', err);
      setError('Session expired or invalid user ID.');
      setAuthUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations`, {
        headers: { 'x-user-id': currentUser.id },
      });
      setConversations(response.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations.');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authUserId) {
      fetchCurrentUser();
    }
  }, [authUserId]);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser, fetchConversations]);

  if (!authUserId) {
    return <LoginScreen API_BASE_URL={API_BASE_URL} onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-white font-semibold text-xl mb-2">Loading your workspace...</p>
          <p className="text-gray-400 text-sm">Initializing secure connection</p>
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-md mx-4 animate-[slideUp_0.5s_ease-out]">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-3 text-center">Oops! Something went wrong</h2>
            <p className="text-gray-300 text-center leading-relaxed mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="group relative w-full py-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-gray-400 font-medium bg-white/5 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10">
          Authentication failed.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      {/* Sidebar: Conversation List */}
      <div className="relative z-10 w-96 flex flex-col bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-2xl">
        {/* Header - Modern Glassmorphism */}
        <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-900 rounded-full">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Messages
                  </h1>
                  <div className="flex items-center text-xs text-gray-400 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                    <span className="text-green-400">{currentUser.name}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 active:scale-95 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 backdrop-blur-xl"
                title="Logout"
              >
                <svg className="w-5 h-5 text-red-400 group-hover:text-red-300 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-hidden">
          <ConversationList 
            currentUser={currentUser}
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
            fetchConversations={fetchConversations}
            API_BASE_URL={API_BASE_URL}
          />
        </div>
      </div>

      {/* Main Content: Chat Room */}
      <div className="relative z-10 flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatRoom 
            conversationId={selectedConversationId}
            currentUser={currentUser}
            API_BASE_URL={API_BASE_URL}
            onMessageSent={fetchConversations} 
          />
        ) : (
          <div className="flex items-center justify-center flex-1 relative">
            {/* Background effects for empty state */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 text-center max-w-md px-6 animate-[fadeIn_0.6s_ease-out]">
              {/* 3D Icon Effect */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 rounded-3xl transform rotate-6 animate-[wiggle_3s_ease-in-out_infinite] shadow-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700 rounded-3xl shadow-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                      <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                No Conversation Selected
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                Choose a conversation from the list or start a new chat to begin your messaging experience
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-medium text-white shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-105">
                  💬 Real-time messaging
                </span>
                <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-medium text-white shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-105">
                  🔒 Secure & Private
                </span>
                <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-medium text-white shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-105">
                  ⚡ Lightning fast
                </span>
              </div>

              {/* Animated Arrow */}
              <div className="flex justify-center items-center gap-2">
                <svg className="w-6 h-6 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-gray-500 text-sm font-medium">Select a conversation</span>
              </div>

              {/* Bouncing dots */}
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-lg"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
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

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(6deg);
          }
          50% {
            transform: rotate(-6deg);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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
      `}</style>
    </div>
  );
}