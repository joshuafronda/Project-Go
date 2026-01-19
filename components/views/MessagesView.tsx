import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { User, UserRole } from '../../types';
import { Card } from '../ui/Card';
import { Send, Hash, User as UserIcon } from 'lucide-react';

interface MessagesViewProps {
  currentUser: User;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ currentUser }) => {
  const { messages, addMessage, projects } = useProject();
  const [activeChannel, setActiveChannel] = useState('general');
  const [inputText, setInputText] = useState('');

  // Filter messages for current channel
  const channelMessages = messages.filter(m => m.channelId === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addMessage({
      id: Date.now().toString(),
      channelId: activeChannel,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar - Channels */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
            Channels
          </div>
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveChannel('general')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors
                ${activeChannel === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Hash size={16} className="mr-2 opacity-70" />
              General
            </button>
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveChannel(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors
                  ${activeChannel === p.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Hash size={16} className="mr-2 opacity-70" />
                {p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Team Online</h4>
             <div className="flex items-center space-x-2 text-sm text-gray-600">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
               <span>Marcus Ford</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
               <span>Emily Dao</span>
             </div>
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col h-full overflow-hidden !p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
           <div className="flex items-center">
             <Hash size={20} className="text-gray-400 mr-2" />
             <h3 className="font-bold text-gray-900">
               {activeChannel === 'general' ? 'General' : projects.find(p => p.id === activeChannel)?.name || 'Unknown Channel'}
             </h3>
           </div>
           <span className="text-xs text-gray-500">{channelMessages.length} messages</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {channelMessages.map(msg => {
            const isMe = msg.userId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                   <img src={msg.userAvatar} className="w-8 h-8 rounded-full border border-gray-200 mt-1 flex-shrink-0" alt="" />
                   <div className={`mx-3 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="flex items-baseline space-x-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">{msg.userName}</span>
                        <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
                        {msg.content}
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
          {channelMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No messages yet in this channel.</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              placeholder={`Message #${activeChannel === 'general' ? 'General' : projects.find(p => p.id === activeChannel)?.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
