
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export const Footer: React.FC = () => {
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
    <footer id="footer" className="bg-kowawa-brown text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             {settings.logoUrl ? (
               <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
             ) : (
               <div className="w-8 h-8 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center">
                  <div className="transform -rotate-45 font-serif text-white font-bold text-lg">K</div>
               </div>
             )}
             <div className="flex flex-col">
               <span className="font-serif text-3xl tracking-widest font-bold uppercase">{settings.siteTitle || 'KOWAWA'}</span>
               <span className="text-kowawa-gold text-[10px] tracking-[0.3em] uppercase -mt-1 font-medium">{settings.footerTagline || 'Selalu ada Kopi, Selalu ada teman.'}</span>
             </div>
          </div>
          <p className="text-white/60 max-w-sm leading-relaxed">
            Membangun komunitas melalui secangkir kopi berkualitas. Kowawa hadir untuk merayakan persahabatan dan keindahan hidup yang membumi.
          </p>
          <div className="flex gap-6 pt-4">
             {settings.instagramUrl && (
               <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-kowawa-gold hover:text-kowawa-gold transition-all pb-1">Instagram</a>
             )}
             {settings.facebookUrl && (
               <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-kowawa-gold hover:text-kowawa-gold transition-all pb-1">Facebook</a>
             )}
             {settings.linkedinUrl && (
               <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-kowawa-gold hover:text-kowawa-gold transition-all pb-1">LinkedIn</a>
             )}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 font-bold tracking-widest uppercase">Lokasi</h4>
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {settings.footerAddress || 'Jl. Senopati No. 88, Kebayoran Baru\nJakarta Selatan'}
          </p>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 font-bold tracking-widest uppercase">Jam Buka</h4>
          <p className="text-white/60 text-sm leading-relaxed">
            {settings.footerHours || 'Senin - Minggu\n08:00 - 22:00 WIB'}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">
        <p>© 2026 Kedai Kopi Kowawa. All rights reserved.</p>
        <p>Premium Coffee. True Friendship.</p>
      </div>
    </footer>
  );
};
