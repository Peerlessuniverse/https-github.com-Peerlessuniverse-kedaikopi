
import React from 'react';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FDFCF8] -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800" 
              alt="Artisan coffee beans" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-premium shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-kowawa-gold p-8 hidden md:block">
              <p className="text-white font-serif italic text-xl">"Kualitas yang jujur dari tanah ibu pertiwi."</p>
            </div>
          </div>

          <div className="space-y-8">
            <header>
              <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">Filosofi Seduh</h3>
              <h2 className="text-kowawa-brown font-serif text-5xl leading-tight">Antara Kemewahan & Kejujuran Alam</h2>
            </header>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Kowawa bukan sekadar kedai kopi. Ia adalah manifestasi dari perjalanan panjang biji kopi pilihan dari pegunungan Nusantara hingga sampai ke meja Anda. Kami percaya bahwa kemewahan sejati lahir dari kesederhanaan proses yang dijaga dengan teliti.
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-6">
              <div>
                <h4 className="text-kowawa-brown font-bold uppercase tracking-widest text-xs mb-2">Biji Pilihan</h4>
                <p className="text-gray-500 text-sm">Single origin yang dipilih langsung dari petani lokal dengan prinsip fair trade.</p>
              </div>
              <div>
                <h4 className="text-kowawa-brown font-bold uppercase tracking-widest text-xs mb-2">Teknik Artisan</h4>
                <p className="text-gray-500 text-sm">Setiap cangkir diseduh dengan presisi tinggi untuk menjaga karakteristik asli rasa.</p>
              </div>
            </div>

            <button className="group flex items-center gap-4 text-kowawa-brown font-bold uppercase tracking-widest text-sm">
              <span className="group-hover:text-kowawa-gold transition-colors">Pelajari Lebih Lanjut</span>
              <div className="h-[1px] w-12 bg-kowawa-brown group-hover:bg-kowawa-gold group-hover:w-20 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
