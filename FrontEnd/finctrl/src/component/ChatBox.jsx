import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://fin-ctrl-1.onrender.com', {
  transports: ['websocket'],
  timeout: 20000, // 20 seconds timeout
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
});


function ChatBox({ userId, role }) {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in ChatBox:', token);

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('connect_error', (err) => console.error('Socket connection error:', err));
    socket.emit('join', { userId, role });

    const fetchChatList = async () => {
      try {
        const response = await axios.get('https://fin-ctrl-1.onrender.com/chat/chat-list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Chat list fetched:', response.data, 'Length:', response.data.length);
        setChatList(Array.isArray(response.data) ? response.data : []);
        if (response.data.length === 0) console.log('No chats returned from backend');
      } catch (err) {
        console.error('Failed to fetch chat list:', err.response?.status, err.response?.data);
        setError('Failed to load chat list');
      }
    };

    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const response = await axios.get(`https://fin-ctrl-1.onrender.com/chat/messages/${selectedChat._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Messages fetched for chat:', selectedChat._id, response.data);
          setMessages(response.data);
          setChatList((prev) =>
            prev.map((chat) =>
              chat._id === selectedChat._id ? { ...chat, unreadCount: 0 } : chat
            )
          );
        } catch (err) {
          console.error('Failed to fetch messages:', err.response?.status, err.response?.data);
          setError('Failed to load messages');
        }
      }
    };

    fetchChatList();
    fetchMessages();

    socket.on('receiveMessage', (msg) => {
      console.log('Received message:', msg);
      if (msg.sender === userId || msg.receiver === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('newMessageNotification', (notificationData) => {
      console.log('New message notification received:', notificationData);
      if (notificationData.senderId !== selectedChat?._id) {
        setNotification(`New message from ${notificationData.senderId}: ${notificationData.content}`);
        setTimeout(() => setNotification(null), 5000);
        setChatList((prev) =>
          prev.map((chat) =>
            chat._id === notificationData.senderId
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
              : chat
          )
        );
      } else {
        console.log('Message from selected chat, no notification needed');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('receiveMessage');
      socket.off('newMessageNotification');
    };
  }, [userId, role, selectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    const msg = {
      sender: userId,
      receiver: selectedChat._id,
      content: message,
      timestamp: new Date(),
    };
    socket.emit('sendMessage', msg);
    setMessage('');
  };

  const filteredChats = chatList.filter(chat => {
    const contactName = role === 'admin' ? (chat.username || 'User') : (chat.adminName || 'Admin');
    return contactName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat list */}
        <div className="overflow-y-auto flex-grow">
          {error && <p className="p-4 text-red-500">{error}</p>}
          {notification && <div className="mx-4 my-2 p-3 bg-green-100 text-green-800 rounded-lg">{notification}</div>}
          
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {(role === 'admin' ? (chat.username || 'U') : (chat.adminName || 'A')).charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      {role === 'admin' ? chat.username || 'User' : chat.adminName || 'Admin'}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'Start a conversation'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">No chats available</p>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-grow flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {(role === 'admin' ? (selectedChat.username || 'U') : (selectedChat.adminName || 'A')).charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">
                  {role === 'admin' ? selectedChat.username || 'User' : selectedChat.adminName || 'Admin'}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedChat.status === 'online' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
              <div className="flex flex-col space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === userId
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === userId ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-grow px-4 py-2 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a contact from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;