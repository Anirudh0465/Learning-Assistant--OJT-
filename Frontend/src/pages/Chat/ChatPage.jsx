import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utiles/axiosInstance';
import API_BASE_URL from '../../utiles/apiPath';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  Bell, 
  LogOut,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Send,
  Loader2
} from 'lucide-react';

const ChatPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    // Determine socket URL from API string
    const socketUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Setup listeners
    newSocket.on('receiveMessage', (message) => {
      // Socket.io sends the same message to sender too. We don't want duplicates if we already know about it,
      // but waiting for the socket response is better for guaranteed delivery sync.
      setMessages((prev) => {
        // Prevent duplicate appending if the socket connection fired twice for same object
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const response = await axiosInstance.get('/chat/history');
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !user._id) return;

    socket.emit('sendMessage', {
      senderId: user._id,
      content: inputText.trim()
    });
    
    setInputText('');
  };

  return (
    <div className="min-h-screen flex bg-[#1a1a21] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#22222a] flex flex-col justify-between border-r border-gray-800 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-6 h-20 border-b border-gray-800">
            <div className="bg-emerald-500 p-1.5 rounded-lg w-8 h-8 flex flex-shrink-0 items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-wide text-gray-100">AI Learning Assistant</span>
          </div>
          
          <nav className="py-6 px-4 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-[15px]">Dashboard</span>
            </Link>
            <Link to="/documents" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium text-[15px]">Documents</span>
            </Link>
            <Link to="/flashcards" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <Layers className="w-5 h-5" />
              <span className="font-medium text-[15px]">Flashcards</span>
            </Link>
            <Link to="/quizzes" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium text-[15px]">Quizzes</span>
            </Link>
            <Link to="/chat" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-[15px]">Live Chat</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium text-[15px]">Profile</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="px-4 pb-6">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-end px-8 border-b border-gray-800 bg-[#1a1a21]">
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 border border-[#1a1a21] rounded-full"></span>
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-6 border-l border-gray-800 cursor-pointer hover:bg-[#2a2a35] py-2 px-3 rounded-xl transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a21] border border-gray-800 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-800/60 mb-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden flex transform flex-col p-8 pb-10 bg-[#1a1a21]">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#f1f1f1] mb-6 shrink-0">Live Community Chat</h1>
          
          <div className="flex-1 overflow-y-auto bg-[#22222a] border border-gray-800/80 rounded-t-[14px] p-6 flex flex-col gap-4 shadow-sm relative">
            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
               </div>
            )}
            {!isLoading && messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-80">
                <MessageCircle className="w-12 h-12 mb-3" />
                <p>No messages yet. Be the first to say hi!</p>
              </div>
            )}
            {!isLoading && messages.map((msg, index) => {
              const isMine = msg.sender?._id === user._id || msg.sender === user._id;
              const senderName = msg.sender?.username || msg.sender?.name || msg.sender?.email?.split('@')[0] || 'Anonymous';
              
              return (
                <div key={index} className={`flex flex-col max-w-[70%] ${isMine ? 'self-end items-end' : 'self-start items-start'} transition-all duration-300`}>
                  <span className="text-[11px] text-[#787883] font-medium tracking-wide mb-1.5 mx-1">{isMine ? 'Me' : senderName}</span>
                  <div className={`px-5 py-3.5 rounded-2xl ${isMine ? 'bg-emerald-500 text-white rounded-br-sm shadow-emerald-500/10 shadow-lg' : 'bg-[#2a2a35] text-gray-200 border border-gray-700/50 rounded-bl-sm'}`}>
                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="pb-2" />
          </div>
          
          <form onSubmit={handleSendMessage} className="bg-[#22222a] border-x border-b border-gray-800/80 rounded-b-[14px] p-4 flex gap-3 shrink-0 items-center justify-center relative shadow-lg">
             <input
               type="text"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Type your message..."
               className="flex-1 bg-[#1a1a21] border border-gray-700/50 rounded-[10px] px-5 py-3 text-[#f1f1f1] outline-none focus:border-emerald-500/50 transition-colors shadow-inner"
             />
             <button
               type="submit"
               disabled={!inputText.trim()}
               className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white p-3.5 rounded-[10px] transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center shrink-0"
             >
               <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
             </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
