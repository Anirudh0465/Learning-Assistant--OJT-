import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  Bell, 
  LogOut,
  Copy,
  Edit,
  ChevronDown
} from 'lucide-react';

const DocumentListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        const [docsRes, flashRes] = await Promise.all([
          axios.get('http://localhost:3400/api/documents', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3400/api/flashcards', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]);
        
        const docs = docsRes.data || [];
        const cards = flashRes.data || [];
        
        const counts = cards.reduce((acc, card) => {
          if (card.document) {
            acc[card.document] = (acc[card.document] || 0) + 1;
          }
          return acc;
        }, {});
        
        const enrichedDocs = docs.map(doc => ({
          ...doc,
          flashcardCount: counts[doc._id] || 0
        }));
        
        setDocuments(enrichedDocs);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:3400/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      toast.success('Document uploaded successfully!');
      
      if (response.data) {
        setDocuments(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateFlashcards = async (documentId) => {
    try {
      setGeneratingFor(documentId);
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:3400/api/flashcards/generate/${documentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('✨ AI Flashcards generated successfully! Go to the Flashcards tab to study them.', {
        duration: 4000
      });
    } catch (error) {
      console.error('Flashcard Generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate flashcards.');
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
            <Link to="/documents" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium text-[15px]">Documents</span>
            </Link>
            <Link to="/flashcards" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
              <Layers className="w-5 h-5" />
              <span className="font-medium text-[15px]">Flashcards</span>
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

        {/* Documents Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#1a1a21]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#f1f1f1] mb-1.5">My Documents</h1>
              <p className="text-[#a0a0ab] text-[15px]">Manage and organize your learning materials.</p>
            </div>
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf" 
              className="hidden" 
            />
            {/* Action Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-emerald-500 hover:bg-emerald-600 font-medium text-white px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>

          {isLoading && <p className="text-gray-400 mb-6 font-medium">Loading documents...</p>}
          {!isLoading && documents.length === 0 && (
            <p className="text-gray-400 mb-6 font-medium">No documents uploaded yet. Start by uploading a PDF!</p>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc._id} className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-6 shadow-sm hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e342b] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-semibold text-[#f1f1f1] mb-1 tracking-wide line-clamp-1">{doc.originalName}</h3>
                      <p className="text-[13px] text-[#787883] font-medium">PDF Document • {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] uppercase tracking-wider font-semibold">
                      <Copy className="w-3.5 h-3.5" />
                      {doc.flashcardCount || 0} Flashcards
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[11px] uppercase tracking-wider font-semibold">
                      <Edit className="w-3.5 h-3.5" />
                      0 Quizzes
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-6">
                  <div className="flex-1 h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${doc.flashcardCount > 0 ? 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  <button 
                    onClick={() => handleGenerateFlashcards(doc._id)}
                    disabled={generatingFor === doc._id}
                    className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingFor === doc._id ? 'Generating AI...' : 'Generate Flashcards'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentListPage;