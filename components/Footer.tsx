
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-kowawa-brown text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center">
                <div className="transform -rotate-45 font-serif text-white font-bold text-lg">K</div>
             </div>
             <div className="flex flex-col">
               <span className="font-serif text-3xl tracking-widest font-bold">KOWAWA</span>
               <span className="text-kowawa-gold text-[10px] tracking-[0.3em] uppercase -mt-1 font-medium">Selalu ada Kopi, Selalu ada teman.</span>
             </div>
          </div>
          <p className="text-white/60 max-w-sm leading-relaxed">
            Membangun komunitas melalui secangkir kopi berkualitas. Kowawa hadir untuk merayakan persahabatan dan keindahan hidup yang membumi.
          </p>
          <div className="flex gap-6 pt-4">
             {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
               <a key={social} href="#" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-kowawa-gold hover:text-kowawa-gold transition-premium pb-1">
                 {social}
               </a>
             ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Navigasi</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li><a href="#" className="hover:text-kowawa-gold transition-colors">Home</a></li>
            <li><a href="#story" className="hover:text-kowawa-gold transition-colors">Filosofi</a></li>
            <li><a href="#ambience" className="hover:text-kowawa-gold transition-colors">Suasana</a></li>
            <li><a href="#menu" className="hover:text-kowawa-gold transition-colors">Menu Pilihan</a></li>
            <li><a href="#reservasi" className="hover:text-kowawa-gold transition-colors">Reservasi</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Lokasi & Jam</h4>
          <div className="space-y-6 text-white/60 text-sm">
            <div>
              <p className="text-white font-medium mb-1">Jakarta Selatan</p>
              <p>Jl. Senopati No. 88, Kebayoran Baru</p>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Jam Operasional</p>
              <p>Senin - Minggu<br/>08:00 - 22:00 WIB</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[10px] tracking-[0.3em] uppercase">
        <p>© 2024 Kedai Kopi Kowawa. All rights reserved.</p>
        <p>Premium Coffee. True Friendship.</p>
      </div>
    </footer>
  );
};
