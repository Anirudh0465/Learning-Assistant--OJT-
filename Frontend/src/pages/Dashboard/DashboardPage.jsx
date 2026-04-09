import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  Bell, 
  UploadCloud,
  File,
  Copy,
  Edit,
  ChevronDown,
  Search,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve user data to display email, fallback to example if not found
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoadingDocs(false);
          return;
        }
        
        const [docsRes, flashRes, quizRes] = await Promise.all([
          axios.get('http://localhost:3400/api/documents', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3400/api/flashcards', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
          axios.get('http://localhost:3400/api/quizzes', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]);
        
        setDocuments(docsRes.data);
        setFlashcards(flashRes.data);
        setQuizzes(quizRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchDashboardData();
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
        if (response.data.fileUrl) {
          setPdfUrl(response.data.fileUrl);
        }
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

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? This will also delete any generated flashcards and quizzes associated with it.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3400/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Document deleted successfully');
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      if (pdfUrl && documents.find(d => d._id === id)?.fileUrl === pdfUrl) setPdfUrl(null);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete document');
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
      <aside className="w-64 bg-[#22222a] flex flex-col border-r border-gray-800">
        <div className="flex items-center gap-3 px-6 h-20 border-b border-gray-800">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-wide">AI Learning Assistant</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/documents" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </Link>
          <Link to="/flashcards" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <Layers className="w-5 h-5" />
            <span className="font-medium">Flashcards</span>
          </Link>
          <Link to="/quizzes" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Quizzes</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-gray-800 bg-[#1a1a21]">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative mx-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-[#22222a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1a1a21] rounded-full"></span>
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-6 border-l border-gray-800 cursor-pointer hover:bg-[#2a2a35] py-2 px-3 rounded-xl transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">{user.email}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a21] border border-gray-800 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-800/60 mb-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account</p>
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

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadCloud className="w-5 h-5" />
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <File className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">{documents.length}</p>
                <p className="text-sm text-gray-400 font-medium">Total Documents</p>
              </div>
            </div>

            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <Copy className="w-7 h-7 text-pink-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">{flashcards.length}</p>
                <p className="text-sm text-gray-400 font-medium">Total Flashcards</p>
              </div>
            </div>

            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Edit className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">{quizzes.length}</p>
                <p className="text-sm text-gray-400 font-medium">Total Quizzes</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#2a2a35] rounded-2xl border border-gray-800/80 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-800/80">
              <h2 className="text-xl font-semibold text-gray-100">Recent Activity</h2>
            </div>
            
            <div className="flex flex-col">
              {isLoadingDocs ? (
                <div className="px-6 py-4 text-gray-400 text-sm">Loading documents...</div>
              ) : documents.length === 0 ? (
                <div className="px-6 py-4 text-gray-400 text-sm">No documents uploaded yet.</div>
              ) : documents.filter(doc => doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())).map((doc) => (
                <div key={doc._id} className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 hover:bg-[#2d2d39] transition-colors last:border-b-0">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-gray-200 mb-1">{doc.originalName}</h3>
                    <p className="text-sm text-gray-500">Document</p>
                  </div>
                  <div className="w-48 text-left">
                    <span className="text-sm text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPdfUrl(doc.fileUrl)}
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20 hover:border-emerald-500">
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc._id)}
                      title="Delete document"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-lg text-sm font-medium transition-colors border border-red-500/20 hover:border-red-500 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {!isLoadingDocs && documents.length > 0 && documents.filter(doc => doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="px-6 py-4 text-gray-400 text-sm">No documents match your search.</div>
              )}
            </div>
          </div>
          {/* PDF Viewer Section */}
          {pdfUrl && (
            <div className="bg-[#2a2a35] rounded-2xl border border-gray-800/80 overflow-hidden shadow-sm mt-8 p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-100 mb-4 w-full border-b border-gray-800/80 pb-4">Document Viewer</h2>
              <div className="w-full max-w-4xl bg-white/5 p-4 rounded-xl flex justify-center overflow-auto max-h-[800px]">
                <Document 
                  file={pdfUrl} 
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-col gap-4"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page 
                      key={`page_${index + 1}`} 
                      pageNumber={index + 1} 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false}
                      className="shadow-lg rounded-md"
                      width={800}
                    />
                  ))}
                </Document>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;