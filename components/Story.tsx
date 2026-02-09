
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export const Story: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    if (db) {
      const unsub = onSnapshot(doc(db, "settings", "general"), (d) => {
        if (d.exists()) setSettings(d.data() as SiteSettings);
      });
      return () => unsub();
    }
  }, []);

  return (
    <section id="story" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative animate-in slide-in-from-left duration-700">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FDFCF8] -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800" 
              alt="Artisan coffee beans" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl rounded-sm"
            />
            <div className="absolute -bottom-6 -right-6 bg-kowawa-gold p-8 hidden md:block shadow-xl">
              <p className="text-white font-serif italic text-xl">"Kualitas yang jujur dari tanah ibu pertiwi."</p>
            </div>
          </div>

          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <header>
              <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">{settings.storySubtitle || 'Filosofi Seduh'}</h3>
              <h2 className="text-kowawa-brown font-serif text-5xl leading-tight">{settings.storyTitle || 'Antara Kemewahan & Kejujuran Alam'}</h2>
            </header>
            
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
              {settings.storyDescription || 'Kowawa bukan sekadar kedai kopi. Ia adalah manifestasi dari perjalanan panjang biji kopi pilihan dari pegunungan Nusantara hingga sampai ke meja Anda.'}
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-6">
              <div>
                <h4 className="text-kowawa-brown font-bold uppercase tracking-widest text-xs mb-2">{settings.storyPoint1Title || 'Biji Pilihan'}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{settings.storyPoint1Desc || 'Single origin yang dipilih langsung dari petani lokal dengan prinsip fair trade.'}</p>
              </div>
              <div>
                <h4 className="text-kowawa-brown font-bold uppercase tracking-widest text-xs mb-2">{settings.storyPoint2Title || 'Teknik Artisan'}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{settings.storyPoint2Desc || 'Setiap cangkir diseduh dengan presisi tinggi untuk menjaga karakteristik asli rasa.'}</p>
              </div>
            </div>

            <button className="group flex items-center gap-4 text-kowawa-brown font-bold uppercase tracking-widest text-sm">
              <span className="group-hover:text-kowawa-gold transition-colors">Pelajari Lebih Lanjut</span>
              <div className="h-[1px] w-12 bg-kowawa-brown group-hover:bg-kowawa-gold group-hover:w-20 transition-all duration-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
