
import React from 'react';

interface HeroProps {
  onOrderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000" 
          alt="Coffee atmosphere" 
          className="w-full h-full object-cover scale-105 animate-[subtle-zoom_20s_infinite]"
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl">
        <h2 className="text-kowawa-gold font-serif italic text-2xl mb-4 tracking-widest animate-pulse">
          Kedai Kopi Kowawa
        </h2>
        <h1 className="text-white font-serif text-6xl md:text-9xl mb-6 leading-none tracking-tighter">
          Selalu ada Kopi,<br/>
          <span className="italic">Selalu ada teman.</span>
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg md:text-xl font-light leading-relaxed tracking-wide">
          Menemukan kehangatan dalam setiap seduhan, merajut cerita dalam setiap pertemuan. Premium dalam rasa, membumi dalam suasana.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button onClick={onOrderClick} className="w-full md:w-auto bg-kowawa-gold text-white px-12 py-4 font-medium tracking-widest uppercase hover:bg-white hover:text-kowawa-brown transition-premium shadow-xl">
            Order Online
          </button>
          <a href="#ambience" className="w-full md:w-auto border border-white/40 text-white px-12 py-4 font-medium tracking-widest uppercase hover:bg-white/10 backdrop-blur-sm transition-premium">
            Lihat Suasana
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] rotate-90 mb-8">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
};
