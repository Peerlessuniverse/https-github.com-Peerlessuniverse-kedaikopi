
import React, { useState } from 'react';
import { MenuItem } from '../types';

// Use items from props instead of hardcoded MENU_ITEMS constant
interface MenuProps {
  items: MenuItem[];
}

export const Menu: React.FC<MenuProps> = ({ items }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Espresso', 'Manual Brew', 'Signature', 'Snacks'];

  // Filter items based on the active category selected from props
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 px-6 bg-[#FDFCF8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-kowawa-gold font-serif italic text-2xl mb-2">Curated Selection</h3>
          <h2 className="text-kowawa-brown font-serif text-5xl mb-8">Menu Pilihan Kami</h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs tracking-[0.2em] uppercase font-bold py-2 border-b-2 transition-premium ${
                  activeCategory === cat ? 'border-kowawa-gold text-kowawa-brown' : 'border-transparent text-gray-400 hover:text-kowawa-brown'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredItems.map(item => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-6 aspect-square">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-premium duration-700"
                />
                <div className="absolute inset-0 bg-kowawa-brown/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-serif text-2xl text-kowawa-brown group-hover:text-kowawa-gold transition-colors">{item.name}</h4>
                {/* Numeric price formatted with toLocaleString */}
                <span className="text-kowawa-gold font-medium">Rp {item.price.toLocaleString()}</span>
              </div>
              <p className="text-gray-500 text-sm italic font-light">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
