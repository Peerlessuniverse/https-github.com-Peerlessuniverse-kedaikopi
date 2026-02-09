
import React from 'react';

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800', title: 'The Lounge' },
  { url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=800', title: 'Brew Bar' },
  { url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=800', title: 'Corner of Serenity' },
  { url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=800', title: 'Artisan Workshop' },
];

export const Ambience: React.FC = () => {
  return (
    <section id="ambience" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-5">
            <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">Suasana Kami</h3>
            <h2 className="text-kowawa-brown font-serif text-5xl leading-tight">Ruang di mana Waktu Melambat</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
              Kami merancang Kowawa dengan sentuhan kayu hangat dan aksen emas minimalis untuk menciptakan ruang yang merangkul Anda layaknya rumah seorang sahabat lama.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
          {IMAGES.map((img, i) => (
            <div 
              key={i} 
              className={`relative overflow-hidden group cursor-pointer ${
                i === 0 ? 'md:col-span-2' : ''
              } ${i === 3 ? 'md:col-span-1' : ''}`}
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-premium duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-kowawa-brown/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-serif italic text-2xl tracking-widest">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
