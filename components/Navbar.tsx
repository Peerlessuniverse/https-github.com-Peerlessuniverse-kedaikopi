
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    if (db) {
      const unsub = onSnapshot(doc(db, "settings", "general"), (d) => {
        if (d.exists()) setSettings(d.data() as SiteSettings);
      });
      return () => { unsub(); window.removeEventListener('scroll', handleScroll); };
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 py-4 ${
        scrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <div className={`w-8 h-8 md:w-10 md:h-10 border-2 transform rotate-45 flex items-center justify-center transition-all ${
                scrolled || isMobileMenuOpen ? 'border-kowawa-gold' : 'border-white'
              }`}>
                 <div className={`transform -rotate-45 font-serif font-bold text-lg md:text-xl transition-all ${
                   scrolled || isMobileMenuOpen ? 'text-kowawa-brown' : 'text-white'
                 }`}>K</div>
              </div>
            )}
            <span className={`font-serif text-xl md:text-2xl tracking-widest font-bold transition-all ${
              scrolled || isMobileMenuOpen ? 'text-kowawa-brown' : 'text-white'
            }`}>{settings.siteTitle || 'KOWAWA'}</span>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden lg:flex gap-10 text-[10px] font-bold tracking-[0.3em] uppercase transition-all ${
            scrolled ? 'text-kowawa-brown' : 'text-white'
          }`}>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-kowawa-gold transition-colors">Home</button>
            <button onClick={() => scrollToSection('menu')} className="hover:text-kowawa-gold transition-colors uppercase">Menu</button>
            <button onClick={() => scrollToSection('reservasi')} className="hover:text-kowawa-gold transition-colors uppercase">Reservasi</button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-all ${
                scrolled ? 'text-kowawa-brown hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-kowawa-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => scrollToSection('menu')} className={`hidden sm:block px-6 md:px-8 py-2 text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${
              scrolled ? 'bg-kowawa-gold text-white hover:bg-kowawa-brown' : 'bg-kowawa-gold text-white hover:bg-white hover:text-kowawa-brown'
            }`}>
              Order Online
            </button>
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${scrolled || isMobileMenuOpen ? 'text-kowawa-brown' : 'text-white'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-64 bg-white shadow-2xl p-8 pt-24 flex flex-col gap-6 transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <button onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); setIsMobileMenuOpen(false); }} className="text-left text-xs font-bold uppercase tracking-widest text-kowawa-brown hover:text-kowawa-gold border-b pb-2">Home</button>
          <button onClick={() => scrollToSection('menu')} className="text-left text-xs font-bold uppercase tracking-widest text-kowawa-brown hover:text-kowawa-gold border-b pb-2">Menu Pilihan</button>
          <button onClick={() => scrollToSection('reservasi')} className="text-left text-xs font-bold uppercase tracking-widest text-kowawa-brown hover:text-kowawa-gold border-b pb-2">Reservasi Meja</button>
          <button onClick={() => { onCartClick(); setIsMobileMenuOpen(false); }} className="text-left text-xs font-bold uppercase tracking-widest text-kowawa-brown hover:text-kowawa-gold border-b pb-2 flex justify-between items-center">
            <span>Keranjang</span>
            {cartCount > 0 && <span className="bg-kowawa-gold text-white px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>}
          </button>
          <div className="mt-auto">
            <button onClick={() => { scrollToSection('menu'); setIsMobileMenuOpen(false); }} className="w-full bg-kowawa-brown text-white py-4 text-[10px] font-bold uppercase tracking-widest shadow-lg">Order Sekarang</button>
          </div>
        </div>
      </div>
    </>
  );
};
