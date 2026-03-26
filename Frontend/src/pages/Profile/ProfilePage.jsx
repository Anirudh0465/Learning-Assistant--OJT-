import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  Bell, 
  LogOut,
  ChevronDown
} from 'lucide-react';

const ProfilePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: '', email: '' });

  const [profileForm, setProfileForm] = useState({ name: user.name || user.username || '', email: user.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    // If not in local storage, you could fetch from an endpoint like /api/auth/me
    // but we can trust local storage's user object for initial hydration
    setProfileForm({ name: user.name || user.username || '', email: user.email || '' });
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:3400/api/auth/profile', profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(res.data.message || 'Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords don't match!");
    }
    try {
      setIsSavingPassword(true);
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:3400/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
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
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-[#2a3f36] text-emerald-400 rounded-xl transition-colors">
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
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 border border-gray-700/60 cursor-pointer hover:bg-[#2a2a35] py-2 px-4 rounded-lg transition-colors bg-[#22222a]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-300 border-r border-gray-700/60 pr-3">User profile</span>
                <span className="text-sm font-medium text-gray-100 pl-1">{user.name || user.username}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#17181f]">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-semibold tracking-tight text-[#f1f1f1] mb-6">Profile Settings</h1>
            
            <hr className="border-gray-800/70 mb-8" />
            
            {/* User Information */}
            <form onSubmit={handleProfileSubmit} className="mb-10 block">
              <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-5">User Information</h2>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-[14px] text-gray-200 font-medium mb-2.5">Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    required
                    className="w-full max-w-2xl bg-[#22232c] border border-gray-700/60 rounded-lg px-4 py-3 text-[15px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[14px] text-gray-200 font-medium mb-2.5">Email</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    required
                    className="w-full max-w-2xl bg-[#22232c] border border-gray-700/60 rounded-lg px-4 py-3 text-[15px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <button disabled={isSavingProfile} type="submit" className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-semibold rounded-[8px] transition-colors shadow-lg shadow-emerald-500/10 tracking-wide disabled:opacity-50">
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            
            <hr className="border-gray-800/70 mb-8" />

            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit}>
              <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-5">Change Password</h2>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-[14px] text-gray-200 font-medium mb-2.5">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                    className="w-full max-w-2xl bg-[#22232c] border border-gray-700/60 rounded-lg px-4 py-3 text-[15px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[14px] text-gray-200 font-medium mb-2.5">New Password</label>
                  <input 
                    type="password" 
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                    className="w-full max-w-2xl bg-[#22232c] border border-gray-700/60 rounded-lg px-4 py-3 text-[15px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[14px] text-gray-200 font-medium mb-2.5">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                    className="w-full max-w-2xl bg-[#22232c] border border-gray-700/60 rounded-lg px-4 py-3 text-[15px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              
              <button disabled={isSavingPassword} type="submit" className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-semibold rounded-[8px] transition-colors shadow-lg shadow-emerald-500/10 tracking-wide disabled:opacity-50">
                {isSavingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
