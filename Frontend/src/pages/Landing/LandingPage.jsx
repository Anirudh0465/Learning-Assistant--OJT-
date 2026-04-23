import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Layers, CheckSquare, BarChart, ArrowRight, Menu } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a21] text-white font-display overflow-x-hidden selection:bg-[#10b981] selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 py-6 px-8 md:px-16 flex items-center justify-between backdrop-blur-md bg-[#1a1a21]/80 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#10b981] rounded-tl-lg rounded-br-lg flex items-center justify-center">
            <span className="font-bold text-[#1a1a21]">LH</span>
          </div>
          <span className="font-bold text-xl tracking-wider">LEARNHUB</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-gray-400">
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-white transition-colors">ABOUT</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors">FEATURES</a>
          <a href="#demo" onClick={(e) => scrollToSection(e, 'demo')} className="hover:text-white transition-colors">DEMO</a>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2 bg-[#10b981] text-[#1a1a21] font-bold rounded-full hover:bg-green-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">
            SIGN IN
          </button>
          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Abstract Concentric Circles Background */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] opacity-30 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <circle cx="50" cy="50" r="10" fill="none" stroke="#10b981" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#10b981" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="0.15" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="0.15" />
            <circle cx="50" cy="50" r="50" fill="none" stroke="#10b981" strokeWidth="0.2" />
          </svg>
        </div>

        <div className="container mx-auto px-8 md:px-16 relative z-10 flex flex-col items-center text-center justify-center">
          <div className="flex flex-col items-center w-full max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-none">
              Welcome.
            </h1>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-2 pl-6 mb-8 w-full max-w-md backdrop-blur-sm mx-auto">
              <input 
                type="text" 
                placeholder="Transform Your PDFs into Smart Study Sessions" 
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                readOnly
              />
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Search size={20} className="text-white" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-[#10b981] text-[#1a1a21] font-bold rounded-full hover:bg-green-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              >
                FREE TRIAL
              </button>
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors duration-300">
                see more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 md:px-16 bg-[#15151b] relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">AI-powered tools designed to reinforce learning and track your progress seamlessly.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MessageSquare size={28} />, title: 'AI Chat', desc: 'Ask questions directly from your notes and get contextual answers instantly.' },
              { icon: <Layers size={28} />, title: 'Smart Flashcards', desc: 'Auto-generated flashcards from your documents for quick and efficient revision.' },
              { icon: <CheckSquare size={28} />, title: 'Quizzes & Summaries', desc: 'Practice quizzes and concise summaries built to reinforce your knowledge.' }
            ].map((feature, i) => (
              <div key={i} className="bg-[#1a1a21] border border-white/5 p-8 rounded-2xl hover:-translate-y-2 hover:border-[#10b981]/30 transition-all duration-300 group shadow-lg">
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-[#10b981] mb-6 group-hover:bg-[#10b981] group-hover:text-[#1a1a21] transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / Demo Section */}
      <section id="demo" className="py-24 px-8 md:px-16 container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             {/* Abstract Mockup Frame */}
             <div className="aspect-[4/3] bg-gradient-to-br from-[#15151b] to-[#1a1a21] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group hover:border-[#10b981]/30 transition-colors duration-500">
               <div className="absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               {/* Decorative dots */}
               <div className="flex gap-2 mb-6">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
               </div>
               {/* Mock Content */}
               <div className="space-y-4">
                 <div className="h-8 bg-white/5 rounded-lg w-3/4 animate-pulse"></div>
                 <div className="h-32 bg-white/5 rounded-lg w-full"></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg"></div>
                    <div className="h-20 bg-white/5 rounded-lg"></div>
                 </div>
               </div>
             </div>
             {/* Floating badge */}
             <div className="absolute -bottom-6 -right-6 bg-[#1a1a21] border border-white/10 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
               <div className="w-10 h-10 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#10b981]">
                 <CheckSquare size={20} />
               </div>
               <div>
                 <p className="text-sm text-gray-400">PDF Processed</p>
                 <p className="font-bold">42 Flashcards Ready</p>
               </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">All-in-One Study Hub</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              No need to juggle multiple apps. We integrate chat, flashcards, quizzes, and tracking into a single, cohesive platform. Adaptive AI ensures the content matches your pace and style.
            </p>
            <ul className="space-y-4">
              {['Scalable & Secure architecture', 'Personalized Learning path', 'Deployable on Vercel'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                    <CheckSquare size={14} />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials & CTA */}
      <section className="py-24 px-8 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#10b981]/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto relative z-10 max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Perfect for students, educators, and lifelong learners.</h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands who are transforming the way they study.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-4 bg-[#10b981] text-[#1a1a21] font-bold rounded-full hover:bg-green-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start For Free <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/20 font-bold rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI LearnHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
