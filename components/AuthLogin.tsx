
import React, { useState } from 'react';
import { BrainCircuit, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { User, PlanType } from '../types';

interface AuthLoginProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate Network Request
    setTimeout(() => {
      if (email === 'admin@demo.com' && password === 'admin') {
        onLoginSuccess({
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@demo.com',
          role: 'admin',
          plan: 'Gelişmiş'
        });
      } else if (email && password) {
         // Mock User Login
         onLoginSuccess({
          id: 'user-1',
          name: 'Demo Kullanıcı',
          email: email,
          role: 'user',
          plan: 'Free'
        });
      } else {
        setError("Geçersiz e-posta veya şifre.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
             <BrainCircuit className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Hesabınıza Giriş Yapın
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Veya{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-indigo-600 hover:text-indigo-500">
            ücretsiz deneme başlatın
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">E-posta Adresi</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ornek@email.com"
                />
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Şifre</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Demo Hesapları</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
               <div className="text-xs text-center p-2 bg-slate-50 rounded border border-slate-200">
                 <span className="font-bold">Admin:</span> admin@demo.com / admin
               </div>
               <div className="text-xs text-center p-2 bg-slate-50 rounded border border-slate-200">
                 <span className="font-bold">User:</span> user@demo.com / 1234
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
