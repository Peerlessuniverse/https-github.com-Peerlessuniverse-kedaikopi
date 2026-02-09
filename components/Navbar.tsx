
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  scrolled: boolean;
  setView: (v: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, setView }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-premium px-6 py-4 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('PUBLIC')}>
          <div className={`w-10 h-10 border-2 transform rotate-45 flex items-center justify-center transition-premium ${
            scrolled ? 'border-kowawa-gold' : 'border-white'
          }`}>
             <div className={`transform -rotate-45 font-serif font-bold text-xl transition-premium ${
               scrolled ? 'text-kowawa-brown' : 'text-white'
             }`}>K</div>
          </div>
          <span className={`font-serif text-2xl tracking-widest font-bold transition-premium ${
            scrolled ? 'text-kowawa-brown' : 'text-white'
          }`}>KOWAWA</span>
        </div>

        <div className={`hidden lg:flex gap-10 text-[10px] font-bold tracking-[0.3em] uppercase transition-premium ${
          scrolled ? 'text-kowawa-brown' : 'text-white'
        }`}>
          <a href="#" className="hover:text-kowawa-gold transition-colors">Home</a>
          <button onClick={() => setView('STORE')} className="hover:text-kowawa-gold transition-colors uppercase">Shop Online</button>
          <a href="#menu" className="hover:text-kowawa-gold transition-colors">Menu</a>
          <button onClick={() => setView('ADMIN')} className="hover:text-kowawa-gold transition-colors uppercase">Portal Admin</button>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setView('STORE')} className={`px-8 py-2 text-[10px] tracking-[0.2em] uppercase font-bold transition-premium ${
            scrolled ? 'bg-kowawa-gold text-white hover:bg-kowawa-brown' : 'bg-kowawa-gold text-white hover:bg-white hover:text-kowawa-brown'
          }`}>
            Order Online
          </button>
        </div>
      </div>
    </nav>
  );
};
