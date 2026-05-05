import React, { useState, useEffect, useRef, useMemo } from 'react';
import axiosInstance from '../../utiles/axiosInstance';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
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
  ChevronDown,
  HelpCircle,
  Search,
  Loader2,
  MessageCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const DocumentListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState(null);
  const [generatingQuizFor, setGeneratingQuizFor] = useState(null);
  
  const { documents, flashcards, quizzes, isLoading, addDocument, refreshData } = useData();

  // Debouncing State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    // Set a timer to update the debounced term after user STOPS typing for 500ms
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    // If the user types again before 500ms, clear the previous timer and start over!
    // This is the core magic of debouncing.
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredDocs = documents.filter(doc => 
    doc.originalName?.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  const enrichedDocs = useMemo(() => {
    const flashCounts = flashcards.reduce((acc, card) => {
      if (card.document) {
        acc[card.document] = (acc[card.document] || 0) + 1;
      }
      return acc;
    }, {});

    const quizCounts = quizzes.reduce((acc, quiz) => {
      if (quiz.document) {
        acc[quiz.document] = (acc[quiz.document] || 0) + 1;
      }
      return acc;
    }, {});

    return filteredDocs.map(doc => ({
      ...doc,
      flashcardCount: flashCounts[doc._id] || 0,
      quizSectionsCount: quizCounts[doc._id] || 0
    }));
  }, [filteredDocs, flashcards, quizzes]);


  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check if a document with the same name already exists in the local state
    const isDuplicate = documents.some(doc => doc.originalName === file.name);
    if (isDuplicate) {
      toast.error('File already exists', { position: 'top-center' }); // Pop up message 
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success('Document uploaded successfully!');
      
      if (response.data) {
        addDocument(response.data);
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
      
      await axiosInstance.post(`/flashcards/generate/${documentId}`);
      
      toast.success('Flashcards generated', {
        position: 'bottom-center',
        duration: 4000
      });
      refreshData();
    } catch (error) {
      console.error('Flashcard Generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate flashcards.');
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateQuiz = async (documentId) => {
    try {
      setGeneratingQuizFor(documentId);
      const token = localStorage.getItem('token');
      
      const response = await axiosInstance.post(`/quizzes/generate/document/${documentId}`);
      
      toast.success('Quizzes generated', {
        position: 'bottom-center',
        duration: 4000
      });
      
      // Redirect to the Quizzes section in the sidebar
      refreshData();
      navigate('/quizzes');
      
    } catch (error) {
      console.error('Quiz Generation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setGeneratingQuizFor(null);
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
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
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

          <div className="flex items-center gap-4 bg-[#22222a] border border-gray-800 rounded-xl px-4 py-3 mb-8 shadow-sm focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search documents by title... (Protected by Debouncing)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-medium"
            />
            {/* Show a cool spinning loader specifically when debouncing is holding back the update! */}
            {searchTerm !== debouncedTerm && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
          </div>

          {isLoading && <p className="text-gray-400 mb-6 font-medium">Loading documents...</p>}
          {!isLoading && documents.length === 0 && (
            <p className="text-gray-400 mb-6 font-medium">No documents uploaded yet. Start by uploading a PDF!</p>
          )}
          {!isLoading && documents.length > 0 && filteredDocs.length === 0 && (
            <p className="text-gray-400 mb-6 font-medium">No documents match your search.</p>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {enrichedDocs.map((doc) => (
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
                    <Link to="/flashcards" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] uppercase tracking-wider font-semibold hover:bg-emerald-500/20 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                      {doc.flashcardCount || 0} Flashcards
                    </Link>
                    <Link to="/quizzes" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[11px] uppercase tracking-wider font-semibold hover:bg-fuchsia-500/20 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                      {doc.quizSectionsCount || 0} Quizzes
                    </Link>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-6">
                  <div className="flex-1 h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${doc.flashcardCount > 0 ? 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleGenerateQuiz(doc._id)}
                      disabled={generatingQuizFor === doc._id}
                      className="px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0 shadow-lg shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingQuizFor === doc._id ? 'Generating...' : 'Generate Quiz'}
                    </button>
                    
                    <button 
                      onClick={() => handleGenerateFlashcards(doc._id)}
                      disabled={generatingFor === doc._id}
                      className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingFor === doc._id ? 'Generating...' : 'Generate Flashcards'}
                    </button>
                  </div>
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