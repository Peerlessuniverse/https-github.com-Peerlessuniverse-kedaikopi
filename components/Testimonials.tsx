
import React from 'react';

const REVIEWS = [
  { name: 'Aditya Pratama', role: 'Penulis', text: 'Kowawa adalah kantor kedua saya. Kopinya konsisten, tapi yang lebih mahal adalah rasa kekeluargaan yang diberikan baristanya.' },
  { name: 'Saraswati', role: 'Kolektor Seni', text: 'Desainnya sangat elegan namun tidak terasa kaku. Tempat yang sempurna untuk menjamu teman-teman dekat.' },
  { name: 'Bimo Kusuma', role: 'Pengusaha', text: 'Manual brew Aceh Gayo mereka adalah yang terbaik di Jakarta. Benar-benar kualitas premium yang jujur.' },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-kowawa-brown text-white relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-serif italic opacity-[0.03] whitespace-nowrap pointer-events-none">
        Selalu ada Teman
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">Suara Teman Kowawa</h3>
          <h2 className="text-white font-serif text-5xl">Cerita di Balik Cangkir</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {REVIEWS.map((review, i) => (
            <div key={i} className="border border-white/10 p-10 hover:border-kowawa-gold transition-premium bg-white/5 backdrop-blur-sm">
              <div className="text-kowawa-gold text-4xl font-serif mb-6">“</div>
              <p className="text-white/80 italic mb-8 leading-relaxed">
                {review.text}
              </p>
              <div>
                <h4 className="font-bold text-lg tracking-wide">{review.name}</h4>
                <p className="text-kowawa-gold text-xs uppercase tracking-widest mt-1">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
