import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  Bell, 
  LogOut,
  ChevronDown,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';

const FlashcardListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        const grouped = cards.reduce((acc, card) => {
          const docId = card.document;
          if (!docId) return acc;
          
          if (!acc[docId]) {
            acc[docId] = { documentId: docId, cards: [], createdAt: card.createdAt };
          }
          acc[docId].cards.push(card);
          return acc;
        }, {});

        const sets = Object.values(grouped).map((group, index) => {
          const doc = docs.find(d => d._id === group.documentId);
          const dummyProgress = index % 2 === 0 ? 100 : 40; 
          
          // Format date elegantly
          const date = new Date(group.createdAt);
          const formattedDate = date.toLocaleDateString('en-GB') + ', ' + date.toLocaleTimeString('en-GB');
          
          return {
            id: group.documentId,
            title: doc ? doc.originalName : 'Flashcard Set',
            created: formattedDate,
            cards: group.cards.length,
            progress: dummyProgress,
            label: dummyProgress === 100 ? '100%' : 'Progress'
          };
        });

        setFlashcardSets(sets);
      } catch (error) {
        console.error('Failed to fetch flashcards data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedSets = flashcardSets.filter(s => s.progress === 100);
  const pendingSets = flashcardSets.filter(s => s.progress !== 100);

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
            <Link to="/flashcards" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
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

        {/* Flashcards Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#1a1a21]">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#f1f1f1] mb-8">All Flashcard Sets</h1>
          
          {isLoading && <p className="text-gray-400 mb-6 font-medium">Loading flashcards...</p>}
          {!isLoading && flashcardSets.length === 0 && (
            <p className="text-gray-400 mb-6 font-medium">No flashcard sets generated yet. Generate some from a document!</p>
          )}

          {/* Top Grid for completed/mini sets */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {completedSets.map((set) => (
              <div key={set.id} className="bg-[#22222a] border border-gray-800/80 rounded-[14px] p-6 shadow-sm hover:border-gray-700 transition-colors">
                <h3 className="text-[17px] font-semibold text-[#f1f1f1] mb-1.5 tracking-wide">{set.title}</h3>
                <p className="text-[12px] text-[#787883] font-medium tracking-wide uppercase mb-10">CREATED: {set.created}</p>
                
                <div className="flex items-end justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">{set.cards} Cards</span>
                  <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[15px]">
                    <CheckCircle className="w-5 h-5 fill-emerald-500 text-[#22222a]" /> {set.label}
                  </div>
                </div>
                <div className="w-full h-[6px] bg-[#2a2a35] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${set.progress}%` }}></div>
                </div>
                <div className="flex justify-end mt-4">
                  <Link to={`/flashcards/${set.id}`} className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-semibold rounded-[8px] transition-colors shadow-lg shadow-emerald-500/10 tracking-wide">
                    Study Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom stack for full-width continuing sets */}
          <div className="flex flex-col gap-6">
            {pendingSets.map((set) => (
              <div key={set.id} className="bg-[#22222a] border border-gray-800/80 rounded-[14px] p-6 shadow-sm hover:border-gray-700 transition-colors">
                <h3 className="text-[17px] font-semibold text-[#f1f1f1] mb-1.5 tracking-wide">{set.title}</h3>
                <p className="text-[12px] text-[#787883] font-medium tracking-wide uppercase mb-6">CREATED: {set.created}</p>
                
                <div className="flex items-end justify-between mb-3">
                  <span className="text-[15px] font-medium text-[#f1f1f1]">Progress</span>
                  <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[15px]">
                    <CheckCircle className="w-5 h-5 fill-emerald-500 text-[#22222a]" /> {set.label}
                  </div>
                </div>
                <div className="w-full h-[6px] bg-[#2a2a35] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${set.progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[15px] font-medium text-gray-400">{set.cards} Cards</span>
                  <Link to={`/flashcards/${set.id}`} className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-semibold rounded-[8px] transition-colors shadow-lg shadow-emerald-500/10 tracking-wide">
                    Study Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default FlashcardListPage;
