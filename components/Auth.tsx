
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call the backend API
    // For MVP frontend, we simulate successful auth
    const displayName = name || email.split('@')[0] || 'Maker';
    onLogin(displayName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-arduino-teal p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-arduino-teal font-bold text-2xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold text-white">Arduino AI Mentor</h1>
          <p className="text-arduino-light opacity-90 text-sm mt-1">
            Your intelligent companion for embedded systems
          </p>
        </div>

        <div className="p-8">
          <div className="flex space-x-4 mb-6 border-b border-slate-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                isLogin ? 'text-arduino-teal border-b-2 border-arduino-teal' : 'text-slate-500'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                !isLogin ? 'text-arduino-teal border-b-2 border-arduino-teal' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal focus:border-transparent outline-none"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal focus:border-transparent outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-arduino-teal focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-arduino-teal text-white py-2 rounded-lg font-bold hover:bg-arduino-dark transition-colors shadow-sm mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
