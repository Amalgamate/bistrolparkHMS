import React, { useState } from 'react';
import { X, Send, Search } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ isOpen, onClose }) => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Williams',
      content: 'Patient in Room 302 needs immediate attention',
      timestamp: new Date(2024, 0, 6, 14, 30),
      read: false
    },
    {
      id: '2',
      sender: 'Nurse Johnson',
      content: 'Lab results for patient #BR263585643 are ready',
      timestamp: new Date(2024, 0, 6, 14, 15),
      read: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={onClose}
        />
      )}

      {/* Message Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#2B4F60]">Messages</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A5C4D4] focus:border-[#A5C4D4]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.read ? 'bg-gray-50' : 'bg-[#E6F3F7]'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-[#2B4F60]">{message.sender}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A5C4D4] focus:border-[#A5C4D4]"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 text-white bg-[#2B4F60] rounded-md hover:bg-[#1e3b4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A5C4D4]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};