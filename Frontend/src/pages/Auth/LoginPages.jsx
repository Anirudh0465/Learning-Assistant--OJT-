import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const LoginPages = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1121] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="absolute bottom-10 right-10 text-gray-500 opacity-40">
        <Sparkles size={40} />
      </div>

      <div className="relative w-full max-w-[420px] z-10 p-4">
        <div className="bg-[#1C2333] border border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative">
          
          <h2 className="text-2xl font-semibold text-white text-center mb-1">Welcome back</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in to continue your journey</p>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0B1121] border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] sm:text-sm transition-colors text-opacity-90"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0B1121] border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] sm:text-sm transition-colors text-opacity-90"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(0,229,153,0.3)] text-sm font-bold text-[#0B1121] bg-[#00E599] hover:bg-[#00c985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C2333] focus:ring-[#00E599] disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-8"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#00E599] hover:text-[#00c985] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 font-medium">
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
}

export default LoginPages;