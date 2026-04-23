import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, LayoutDashboard, FileText, Layers, HelpCircle, MessageCircle, User, FileSearch } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/document-chat', label: 'Document Chat', icon: FileSearch },
    { path: '/flashcards', label: 'Flashcards', icon: Layers },
    { path: '/quizzes', label: 'Quizzes', icon: HelpCircle },
    { path: '/chat', label: 'Live Chat', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#22222a] flex flex-col border-r border-gray-800 h-screen shrink-0">
      <div className="flex items-center gap-3 px-6 h-20 shrink-0 border-b border-gray-800">
        <div className="bg-emerald-500 p-1.5 rounded-lg shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-wide truncate">AI Learning Assistant</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          const Icon = link.icon;
          return (
            <Link 
              key={link.path}
              to={link.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-[#2a3f36] text-emerald-400' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2a35]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
