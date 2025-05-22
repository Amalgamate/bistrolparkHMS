import React, { useState, useEffect } from 'react';
import { useChat, ChatType } from '../../context/ChatContext';
import { X, Search, Users, MessageCircle, AtSign, Check } from 'lucide-react';

interface NewChatDialogProps {
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({ onClose }) => {
  const { createChat } = useChat();
  
  const [chatType, setChatType] = useState<ChatType>('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock users data - in a real app, this would come from an API
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user2',
      name: 'Dr. Sarah Williams',
      avatar: '/avatars/doctor-female.png',
      role: 'Doctor',
      department: 'Cardiology',
      email: 'sarah.williams@hospital.com',
      phone: '+1234567890'
    },
    {
      id: 'user3',
      name: 'Dr. Michael Chen',
      avatar: '/avatars/doctor-male.png',
      role: 'Doctor',
      department: 'Neurology',
      email: 'michael.chen@hospital.com',
      phone: '+1234567891'
    },
    {
      id: 'user4',
      name: 'Nurse Johnson',
      avatar: '/avatars/nurse-female.png',
      role: 'Nurse',
      department: 'Emergency',
      email: 'nurse.johnson@hospital.com',
      phone: '+1234567892'
    },
    {
      id: 'user5',
      name: 'Dr. Emily Davis',
      avatar: '/avatars/doctor-female.png',
      role: 'Doctor',
      department: 'Pediatrics',
      email: 'emily.davis@hospital.com',
      phone: '+1234567893'
    },
    {
      id: 'user6',
      name: 'Lab Technician Smith',
      avatar: '/avatars/lab-tech.png',
      role: 'Lab Technician',
      department: 'Laboratory',
      email: 'tech.smith@hospital.com',
      phone: '+1234567894'
    }
  ]);
  
  // Filter users based on search query
  const filteredUsers = searchQuery.trim()
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;
  
  // Handle user selection
  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      if (chatType === 'direct' && selectedUsers.length > 0) {
        // For direct chats, only allow one user
        setSelectedUsers([user]);
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };
  
  // Handle chat creation
  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const userIds = selectedUsers.map(user => user.id);
      
      if (chatType === 'direct') {
        // For direct chats, use the user's name
        await createChat(userIds, selectedUsers[0].name, 'direct');
      } else {
        // For group chats, use the provided group name or a default
        const name = groupName.trim() || `Group with ${selectedUsers.map(u => u.name.split(' ')[0]).join(', ')}`;
        await createChat(userIds, name, 'group');
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset selected users when chat type changes
  useEffect(() => {
    setSelectedUsers([]);
  }, [chatType]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">New Conversation</h2>
          <button 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Chat type selector */}
          <div className="flex mb-4 border rounded-lg overflow-hidden">
            <button 
              className={`flex-1 py-2 px-4 flex items-center justify-center ${chatType === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setChatType('direct')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Direct Message
            </button>
            <button 
              className={`flex-1 py-2 px-4 flex items-center justify-center ${chatType === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setChatType('group')}
            >
              <Users className="w-4 h-4 mr-2" />
              Group Chat
            </button>
          </div>
          
          {/* Group name input (for group chats) */}
          {chatType === 'group' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
          
          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          
          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedUsers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <span className="mr-1">{user.name}</span>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => toggleUserSelection(user)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* User list */}
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className={`
                    flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0
                    ${selectedUsers.some(u => u.id === user.id) ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="relative flex-shrink-0 mr-3">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    
                    {selectedUsers.some(u => u.id === user.id) && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{user.role}</span>
                      {user.department && (
                        <span className="mx-1">• {user.department}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button 
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`
              px-4 py-2 bg-blue-500 text-white rounded-md
              ${selectedUsers.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
            `}
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? 'Creating...' : 'Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatDialog;
