
import React from 'react';

export const Reservation: React.FC = () => {
  return (
    <section id="reservasi" className="py-24 px-6 bg-[#FDFCF8]">
      <div className="max-w-4xl mx-auto border-2 border-kowawa-brown/5 p-8 md:p-16 relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-kowawa-gold" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-kowawa-gold" />
        
        <div className="text-center mb-12">
          <h2 className="text-kowawa-brown font-serif text-5xl mb-4">Pesan Meja Anda</h2>
          <p className="text-gray-500 italic">Karena setiap momen berharga layak mendapatkan tempat terbaik.</p>
        </div>

        <form className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-kowawa-brown">Nama Lengkap</label>
            <input type="text" className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-kowawa-gold outline-none transition-colors" placeholder="Masukkan nama..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-kowawa-brown">Jumlah Orang</label>
            <select className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-kowawa-gold outline-none transition-colors">
              <option>1 - 2 Orang</option>
              <option>3 - 4 Orang</option>
              <option>5+ Orang (Grup)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-kowawa-brown">Tanggal</label>
            <input type="date" className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-kowawa-gold outline-none transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-kowawa-brown">Waktu</label>
            <input type="time" className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-kowawa-gold outline-none transition-colors" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-kowawa-brown">Catatan Khusus</label>
            <textarea className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-kowawa-gold outline-none transition-colors h-24 resize-none" placeholder="Alergi, acara spesial, dsb..." />
          </div>
          
          <button type="button" className="md:col-span-2 bg-kowawa-brown text-white py-4 font-bold uppercase tracking-widest hover:bg-kowawa-gold transition-premium mt-4">
            Konfirmasi Reservasi
          </button>
        </form>
      </div>
    </section>
  );
};
