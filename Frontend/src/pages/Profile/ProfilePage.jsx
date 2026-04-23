import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utiles/axiosInstance';
import Sidebar from '../../components/Sidebar';

import { toast } from 'react-hot-toast';
import { 
  Bot, LayoutDashboard, FileText, Layers, User, Bell, LogOut, ChevronDown, 
  HelpCircle, MessageCircle, Camera, CheckCircle2, Shield, BellRing, 
  Eye, ToggleLeft, ToggleRight, Briefcase
} from 'lucide-react';

const ProfilePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize with the standard user or the provided fallbacks
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState({
    name: storedUser.name || 'shashank',
    email: storedUser.email || 'ayush.945484658@gmail.com'
  });

  const [profileForm, setProfileForm] = useState({ 
    name: user.name,
    username: 'shashank_ai',
    pronouns: 'He/Him',
    email: user.email,
    secondaryEmail: '',
    timeZone: 'UTC+05:30 (India Standard Time)',
    preferredLanguage: 'English (US)',
    bio: 'Student of Data Science and AI enthusiast',
    headline: 'Continuous Learner | Aspiring AI Researcher',
    phoneCode: '+91',
    phone: '',
    dob: '',
    role: 'Student',
    institution: 'XYZ University',
    studyArea: 'Deep Learning and NLP',
    isPublic: true,
    marketing: true
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTogglePublic = () => {
    setProfileForm(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      // Simulating heavy functional API push since not all these fields exist in backend yet
      // const res = await axiosInstance.put('/auth/profile', profileForm);
      await new Promise(resolve => setTimeout(resolve, 800)); // fake delay for aesthetics
      
      const updatedUser = { ...user, name: profileForm.name, email: profileForm.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!', { position: 'bottom-center' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords don't match!", { position: 'bottom-center' });
    }
    try {
      setIsSavingPassword(true);
      const res = await axiosInstance.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success(res.data.message || 'Password changed successfully!', { position: 'bottom-center' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password', { position: 'bottom-center' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Reusable input style
  const inputClassName = "w-full bg-[#1a1a21] border border-gray-700/60 rounded-xl px-4 py-3 text-[15px] text-[#f1f1f1] placeholder-gray-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner";
  const selectClassName = "w-full bg-[#1a1a21] border border-gray-700/60 rounded-xl px-4 py-3 text-[15px] text-[#f1f1f1] focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner appearance-none";
  const labelClassName = "block text-[14px] text-gray-400 font-medium mb-2 pl-1";

  return (
    <div className="min-h-screen flex bg-[#1a1a21] text-white font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-end px-8 border-b border-gray-800 bg-[#1a1a21] shadow-sm relative z-20">
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 border border-[#1a1a21] rounded-full"></span>
            </button>
            <div className="relative">
              <div 
                className="flex items-center gap-3 border border-gray-700/60 cursor-pointer hover:bg-[#2a2a35] py-2 px-4 rounded-xl transition-colors bg-[#22222a]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-7 h-7 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                   <User className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm font-semibold text-gray-200 tracking-wide">{user.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a21] border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-800/60 mb-1">
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#17181f]">
          <div className="max-w-[1000px] mx-auto pb-10">
            <div className="mb-10">
              <h1 className="text-[28px] font-bold tracking-tight text-[#f1f1f1] mb-2">Profile Settings</h1>
              <p className="text-gray-400 text-[15px]">Manage your personal information, preferences, and security.</p>
            </div>
            
            {/* Form wrapping all the profile panels */}
            <form onSubmit={handleProfileSubmit}>
              
              {/* PANEL 1: Edit Profile */}
              <div className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/80"></div>
                <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-8 flex items-center gap-2"><User className="w-5 h-5 text-emerald-500" /> Edit Profile</h2>
                
                {/* Profile Picture Area */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-8 border-b border-gray-700/40">
                  <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-[#22222a] shadow-xl flex items-center justify-center overflow-hidden">
                       <span className="text-4xl font-bold text-gray-400 tracking-wider uppercase">{profileForm.name.charAt(0)}</span>
                    </div>
                    {/* Pencil Edit Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-full border-[3px] border-[#22222a] shadow-lg">
                      <Camera className="w-4 h-4 text-[#1a1a21]" />
                    </div>
                  </div>
                  <div className="flex-1 mt-3 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-100 mb-1">{profileForm.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">Acceptable formats: JPG, PNG, GIF. Max size 5MB.</p>
                    <button type="button" className="px-4 py-2 bg-[#2a2a35] hover:bg-[#32323e] border border-gray-700 text-sm font-semibold rounded-lg transition-colors shadow-sm">
                      Upload New Picture
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <div>
                    <label className={labelClassName}>Full Name</label>
                    <input type="text" name="name" value={profileForm.name} onChange={handleChange} required className={inputClassName} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 pl-1">
                      <label className="text-[14px] text-gray-400 font-medium">Username</label>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-wider uppercase mb-0.5">Available</span>
                    </div>
                    <input type="text" name="username" value={profileForm.username} onChange={handleChange} className={inputClassName} />
                  </div>
                  
                  <div>
                    <label className={labelClassName}>Pronouns</label>
                    <div className="relative">
                      <select name="pronouns" value={profileForm.pronouns} onChange={handleChange} className={selectClassName}>
                        <option>They/Them</option>
                        <option>She/Her</option>
                        <option>He/Him</option>
                        <option>Other / Prefer not to say</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClassName}>Time Zone</label>
                    <div className="relative">
                      <select name="timeZone" value={profileForm.timeZone} onChange={handleChange} className={selectClassName}>
                        <option>UTC-08:00 (Pacific Time)</option>
                        <option>UTC-05:00 (Eastern Time)</option>
                        <option>UTC+00:00 (Greenwich Mean Time)</option>
                        <option>UTC+05:30 (India Standard Time)</option>
                        <option>UTC+09:00 (Japan Standard Time)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 pl-1">
                      <label className="text-[14px] text-gray-400 font-medium">Primary Email Address</label>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-wider uppercase mb-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <input type="email" name="email" value={profileForm.email} onChange={handleChange} required className={inputClassName} />
                  </div>
                  <div>
                    <label className={labelClassName}>Secondary Email Address</label>
                    <input type="email" name="secondaryEmail" value={profileForm.secondaryEmail} onChange={handleChange} placeholder="Alternative email..." className={inputClassName} />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClassName}>Preferred Language</label>
                    <div className="relative w-full md:w-1/2 md:pr-4">
                      <select name="preferredLanguage" value={profileForm.preferredLanguage} onChange={handleChange} className={selectClassName}>
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish (Español)</option>
                        <option>Hindi (हिन्दी)</option>
                        <option>French (Français)</option>
                      </select>
                      <ChevronDown className="absolute right-8 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: Personal Information */}
              <div className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-8 mb-8 shadow-sm">
                <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-500" /> Personal Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={labelClassName}>Profile Headline</label>
                    <input type="text" name="headline" value={profileForm.headline} onChange={handleChange} className={inputClassName} placeholder="e.g. Continuous Learner | Aspiring AI Researcher" />
                  </div>
                  <div>
                    <label className={labelClassName}>Short Biography / About Me</label>
                    <textarea name="bio" rows="4" value={profileForm.bio} onChange={handleChange} className={`${inputClassName} resize-y min-h-[100px]`} placeholder="Tell us about yourself..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClassName}>Phone Number</label>
                      <div className="flex gap-2">
                        <div className="relative w-1/3">
                          <select name="phoneCode" value={profileForm.phoneCode} onChange={handleChange} className={selectClassName}>
                            <option>+1</option>
                            <option>+44</option>
                            <option>+91</option>
                            <option>+61</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                        <input type="tel" name="phone" value={profileForm.phone} onChange={handleChange} className={`${inputClassName} w-2/3`} placeholder="(555) 000-0000" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClassName}>Date of Birth</label>
                      <input type="date" name="dob" value={profileForm.dob} onChange={handleChange} className={inputClassName} />
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: Learning & Professional */}
              <div className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-8 mb-8 shadow-sm">
                <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-500" /> Learning & Professional</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className={labelClassName}>Current Role</label>
                    <div className="relative">
                      <select name="role" value={profileForm.role} onChange={handleChange} className={selectClassName}>
                        <option>Student</option>
                        <option>Educator</option>
                        <option>Professional</option>
                        <option>Researcher</option>
                        <option>Hobbyist</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClassName}>Institution or Organization</label>
                    <input type="text" name="institution" value={profileForm.institution} onChange={handleChange} className={inputClassName} />
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>Primary Area of Study / Research</label>
                  <textarea name="studyArea" rows="2" value={profileForm.studyArea} onChange={handleChange} className={`${inputClassName} resize-y min-h-[80px]`} placeholder="e.g. Deep Learning and NLP"></textarea>
                </div>
              </div>

              {/* PANEL 4: Preferences & Privacy */}
              <div className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-8 mb-8 shadow-sm">
                <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Preferences & Privacy</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#1a1a21] border border-gray-700/50 rounded-xl shadow-inner">
                    <div className="pr-4">
                      <h4 className="text-[15px] font-semibold text-gray-200 mb-1">Public Profile Visibility</h4>
                      <p className="text-[13px] text-gray-400">Allow other learners to see your basic profile and achievements.</p>
                    </div>
                    <button type="button" onClick={handleTogglePublic} className="focus:outline-none transition-transform active:scale-95 shrink-0">
                      {profileForm.isPublic 
                        ? <ToggleRight className="w-10 h-10 text-emerald-500" /> 
                        : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-transparent hover:border-gray-700/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-center mt-1 shrink-0">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          name="marketing" 
                          id="marketing"
                          checked={profileForm.marketing} 
                          onChange={handleChange} 
                          className="peer appearance-none w-5 h-5 border-2 border-gray-500 rounded bg-[#1a1a21] checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-colors"
                        />
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1a1a21] absolute left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="marketing" className="text-[15px] font-semibold text-gray-200 cursor-pointer block mb-0.5">Marketing Newsletter</label>
                      <p className="text-[13px] text-gray-400">Receive weekly updates on new AI features and platform events.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON FOR PROFILE */}
              <div className="flex justify-end mb-12">
                <button 
                  disabled={isSavingProfile} 
                  type="submit" 
                  className="px-8 py-3.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#10b981] hover:to-[#047857] text-white text-[15px] font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 tracking-wide disabled:opacity-50 active:scale-95 flex items-center gap-2"
                >
                  {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

            <hr className="border-gray-800/80 mb-10" />

            {/* PANEL 5: Change Password */}
            <div className="bg-[#22222a] border border-gray-800/80 rounded-2xl p-8 mb-8 shadow-sm">
              <h2 className="text-[19px] font-semibold text-[#f1f1f1] mb-6 flex items-center gap-2"><LockIcon className="w-5 h-5 text-emerald-500" /> Security & Password</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6 mb-8 max-w-2xl">
                  <div>
                    <label className={labelClassName}>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                      className={inputClassName}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClassName}>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Create a new password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                      className={inputClassName}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClassName}>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Type the new password again"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>
                
                <button 
                  disabled={isSavingPassword} 
                  type="submit" 
                  className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white text-[15px] font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/10 tracking-wide disabled:opacity-50 active:scale-95"
                >
                  {isSavingPassword ? 'Updating Lock...' : 'Change Password'}
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

// Mini lock icon SVG component to fit lucide style
const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default ProfilePage;
