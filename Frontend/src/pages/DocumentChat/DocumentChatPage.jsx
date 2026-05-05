import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utiles/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  Bot, 
  User, 
  Bell, 
  ChevronDown,
  MessageSquare,
  Send,
  FileSearch
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const DocumentChatPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };
  
  const { documents } = useData();
  const [selectedPdf, setSelectedPdf] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (documents.length > 0 && !selectedPdf) {
      setSelectedPdf(documents[0]._id);
    }
  }, [documents, selectedPdf]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuery.trim() || !selectedPdf) return;

    const query = currentQuery.trim();
    setCurrentQuery('');
    setChatHistory(prev => [...prev, { text: query, sender: 'user' }]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/chat/ask', {
        documentId: selectedPdf,
        question: query
      });
      
      const answer = response.data?.answer || 'No answer provided.';
      setChatHistory(prev => [...prev, { text: answer, sender: 'ai' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { text: 'Failed to fetch response. Please try again.', sender: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1a1a21] text-white font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex-shrink-0 flex items-center justify-end px-8 border-b border-gray-800 bg-[#1a1a21]">
          <div className="flex items-center gap-6">

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

        <div className="flex-1 overflow-hidden flex transform flex-col p-8 pb-10 bg-[#1a1a21]">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h1 className="text-[22px] font-semibold tracking-tight text-[#f1f1f1]">Document Chat</h1>
            
            <div className="w-64 relative">
              <select 
                value={selectedPdf} 
                onChange={(e) => {
                  setSelectedPdf(e.target.value);
                  setChatHistory([]); // Clear chat history when switching documents
                }}
                className="w-full bg-[#2a2a35] text-sm text-gray-200 border border-gray-700/80 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-emerald-500 shadow-inner appearance-none cursor-pointer"
              >
                {documents.length === 0 && <option value="">No documents available</option>}
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.originalName}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[#22222a] border border-gray-800/80 rounded-t-[14px] p-6 flex flex-col gap-4 shadow-sm relative">
            {documents.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-80">
                 <FileSearch className="w-12 h-12 mb-3" />
                 <p>Upload a document to start chatting!</p>
               </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-80">
                <MessageSquare className="w-12 h-12 mb-3" />
                <p>Ask a question about the selected document.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => {
                const isUser = msg.sender === 'user';
                const isError = msg.sender === 'error';
                
                return (
                  <div key={index} className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'} transition-all duration-300`}>
                    <div className="flex items-center gap-2 mb-1.5 mx-1">
                      {isUser ? (
                        <span className="text-[11px] text-[#787883] font-medium tracking-wide">You</span>
                      ) : (
                        <>
                          <Bot size={12} className={isError ? "text-red-400" : "text-emerald-400"} />
                          <span className="text-[11px] text-[#787883] font-medium tracking-wide">AI Assistant</span>
                        </>
                      )}
                    </div>
                    <div className={`px-5 py-3.5 rounded-2xl ${
                      isUser 
                        ? 'bg-emerald-500 text-white rounded-br-sm shadow-emerald-500/10 shadow-lg' 
                        : isError
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-bl-sm'
                          : 'bg-[#2a2a35] text-gray-200 border border-gray-700/50 rounded-bl-sm'
                    }`}>
                      <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex flex-col max-w-[80%] self-start items-start transition-all duration-300">
                <div className="flex items-center gap-2 mb-1.5 mx-1">
                  <Bot size={12} className="text-emerald-400" />
                  <span className="text-[11px] text-[#787883] font-medium tracking-wide">AI Assistant</span>
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-[#2a2a35] text-gray-200 border border-gray-700/50 rounded-bl-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <p className="text-[15px] leading-relaxed">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="pb-2" />
          </div>
          
          <form onSubmit={handleSubmit} className="bg-[#22222a] border-x border-b border-gray-800/80 rounded-b-[14px] p-4 flex gap-3 shrink-0 items-center justify-center relative shadow-lg">
             <input
               type="text"
               value={currentQuery}
               onChange={(e) => setCurrentQuery(e.target.value)}
               placeholder="Ask a question about your document..."
               disabled={documents.length === 0 || isLoading}
               className="flex-1 bg-[#1a1a21] border border-gray-700/50 rounded-[10px] px-5 py-3 text-[#f1f1f1] outline-none focus:border-emerald-500/50 transition-colors shadow-inner disabled:opacity-50"
             />
             <button
               type="submit"
               disabled={!currentQuery.trim() || documents.length === 0 || isLoading}
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

export default DocumentChatPage;
