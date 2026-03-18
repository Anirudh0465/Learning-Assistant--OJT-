import React from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  // Retrieve user data to display email, fallback to example if not found
  const user = JSON.parse(localStorage.getItem('user')) || { email: 'you@example.com' };

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
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <Layers className="w-5 h-5" />
            <span className="font-medium">Flashcards</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35] rounded-xl transition-colors">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 flex items-center justify-end px-8 border-b border-gray-800 bg-[#1a1a21]">
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
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 shadow-emerald-500/20">
              <UploadCloud className="w-5 h-5" />
              Upload Document
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <File className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">2</p>
                <p className="text-sm text-gray-400 font-medium">Total Documents</p>
              </div>
            </div>

            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <Copy className="w-7 h-7 text-pink-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">2</p>
                <p className="text-sm text-gray-400 font-medium">Total Flashcards</p>
              </div>
            </div>

            <div className="bg-[#2a2a35] rounded-2xl p-6 flex items-center gap-5 border border-gray-800/80 hover:border-gray-700 transition-colors shadow-sm">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Edit className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1 text-gray-100">0</p>
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
              {[
                { title: 'Document #1: Rules for Writing', type: 'Document', date: 'Aug 3, 2023 ago' },
                { title: 'Document #1: Immerse in Applon Medicine', type: 'Document', date: 'Aug 3, 2023 ago' },
                { title: 'Document #2: Request in Quizze 1', type: 'Document', date: 'Aug 3, 2023 ago' },
                { title: 'Document #2: Preparation Quizze 2', type: 'Document', date: 'Aug 3, 2023 ago' },
                { title: 'Document #2: Discover Document', type: 'Document', date: 'Aug 3, 2023 ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 hover:bg-[#2d2d39] transition-colors last:border-b-0">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-gray-200 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <div className="w-48 text-left">
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>
                  <div>
                    <button className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20 hover:border-emerald-500">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;