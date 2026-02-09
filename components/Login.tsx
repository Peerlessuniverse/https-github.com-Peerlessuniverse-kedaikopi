
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Login resmi menggunakan Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError('Login gagal! Periksa email dan password kamu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 font-sans animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-kowawa-brown p-10 text-center text-white">
          <div className="w-12 h-12 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center mx-auto mb-6">
            <span className="transform -rotate-45 font-serif font-bold text-2xl">K</span>
          </div>
          <h2 className="font-serif text-2xl tracking-widest font-bold uppercase">Admin HQ Login</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">Kedai Kopi Kowawa Security</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center border border-red-100 animate-bounce">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-kowawa-gold transition-colors text-sm"
              placeholder="admin@kowawa.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-kowawa-gold transition-colors text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-kowawa-brown text-white text-xs font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-kowawa-gold shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Mengamankan Sesi...' : 'Masuk ke HQ'}
          </button>
        </form>
        
        <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
          <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-kowawa-brown transition-colors">
            ← Kembali ke Website Utama
          </a>
        </div>
      </div>
    </div>
  );
};
