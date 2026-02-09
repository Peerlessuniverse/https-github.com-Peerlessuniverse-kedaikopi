
import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../services/firestoreService';
import { Testimonial } from '../types';

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getTestimonials();
        if (data.length > 0) {
          setReviews(data);
        } else {
          // Fallback jika database kosong
          setReviews([
            { id: '1', name: 'Aditya Pratama', role: 'Penulis', text: 'Kowawa adalah kantor kedua saya. Kopinya konsisten, tapi yang lebih mahal adalah rasa kekeluargaan yang diberikan baristanya.' },
            { id: '2', name: 'Saraswati', role: 'Kolektor Seni', text: 'Desainnya sangat elegan namun tidak terasa kaku. Tempat yang sempurna untuk menjamu teman-teman dekat.' },
            { id: '3', name: 'Bimo Kusuma', role: 'Pengusaha', text: 'Manual brew Aceh Gayo mereka adalah yang terbaik di Jakarta. Benar-benar kualitas premium yang jujur.' },
          ]);
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 px-6 bg-kowawa-brown text-white relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[15rem] font-serif italic opacity-[0.03] whitespace-nowrap pointer-events-none">
        Selalu ada Teman
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">Suara Teman Kowawa</h3>
          <h2 className="text-white font-serif text-5xl">Cerita di Balik Cangkir</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {reviews.map((review) => (
            <div key={review.id} className="border border-white/10 p-10 hover:border-kowawa-gold transition-all duration-500 bg-white/5 backdrop-blur-sm group">
              <div className="text-kowawa-gold text-4xl font-serif mb-6 group-hover:scale-110 transition-transform">“</div>
              <p className="text-white/80 italic mb-8 leading-relaxed h-32 overflow-y-auto custom-scrollbar">
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
