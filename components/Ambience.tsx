
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { AmbienceItem } from '../types';

export const Ambience: React.FC = () => {
  const [items, setItems] = useState<AmbienceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AmbienceItem | null>(null);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(query(collection(db, "ambience")), (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as AmbienceItem));
      if (fetched.length > 0) setItems(fetched);
    });
    return () => unsub();
  }, []);

  return (
    <section id="ambience" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-20">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-kowawa-gold font-serif italic text-2xl animate-pulse uppercase tracking-widest">Suasana Kami</h3>
            <h2 className="text-kowawa-brown font-serif text-5xl md:text-6xl leading-tight">Ruang di mana Waktu Melambat</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl font-light italic">
              "Kami merancang Kowawa dengan sentuhan kayu hangat dan aksen emas minimalis untuk menciptakan ruang yang merangkul Anda layaknya rumah seorang sahabat lama."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-auto md:h-[600px]">
          {items.map((item, i) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className={`relative overflow-hidden group cursor-pointer h-80 md:h-full rounded-3xl shadow-xl transition-all duration-700 hover:shadow-2xl ${
                i === 0 ? 'sm:col-span-2' : ''
              }`}
            >
              {item.type === 'youtube' ? (
                <div className="w-full h-full relative overflow-hidden bg-gray-100">
                   <img src={`https://img.youtube.com/vi/${item.url}/hqdefault.jpg`} className="w-full h-full object-cover scale-110 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                         <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A.7.7 0 005 3.41v13.18a.7.7 0 001.3.569l10.328-6.59a.7.7 0 000-1.138L6.3 2.841z"/></svg>
                      </div>
                   </div>
                </div>
              ) : item.type === 'video' ? (
                <div className="w-full h-full relative bg-gray-100">
                   <video src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" muted loop playsInline autoPlay />
                </div>
              ) : (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-kowawa-brown/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <p className="text-kowawa-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-1">Experience</p>
                <h4 className="text-white font-serif italic text-2xl tracking-widest">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-500 bg-black">
             <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             {selectedItem.type === 'youtube' ? (
                <iframe src={`https://www.youtube.com/embed/${selectedItem.url}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen frameBorder="0" />
             ) : selectedItem.type === 'video' ? (
                <video src={selectedItem.url} className="w-full h-full" autoPlay controls />
             ) : (
                <img src={selectedItem.url} className="w-full h-full object-contain" alt="" />
             )}
          </div>
        </div>
      )}
    </section>
  );
};
