
import React, { useState } from 'react';
import { MenuItem, Branch, Order, CartItem } from '../types';

interface POSProps {
  menu: MenuItem[];
  branches: Branch[];
  onOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  onBack: () => void;
}

export const POSSystem: React.FC<POSProps> = ({ menu, branches, onOrder, onBack }) => {
  const [selectedBranch, setSelectedBranch] = useState(branches.length > 0 ? branches[0].id : '');
  const [currentOrder, setCurrentOrder] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCart, setShowCart] = useState(false); // Untuk mobile/tablet view

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];
  const filteredMenu = activeTab === 'All' ? menu : menu.filter(m => m.category === activeTab);

  const addToOrder = (item: MenuItem) => {
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (id: string) => {
    setCurrentOrder(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const finalizeOrder = async () => {
    if (currentOrder.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      const newOrder: Omit<Order, 'id'> = {
        items: currentOrder,
        total,
        timestamp: new Date(),
        branchId: selectedBranch,
        type: 'In-Store',
        status: 'Completed'
      };
      await onOrder(newOrder);
      setCurrentOrder([]);
      setShowCart(false);
      alert('Transaksi Berhasil!');
    } catch (err) {
      alert('Gagal memproses transaksi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row overflow-hidden relative">
      {/* Left: Menu Area */}
      <div className="flex-grow flex flex-col p-4 md:p-6 overflow-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" stroke="currentColor"/></svg>
            </button>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-kowawa-brown uppercase tracking-widest">Kowawa POS</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
              className="flex-grow sm:flex-grow-0 bg-white border rounded px-4 py-2 text-sm focus:outline-kowawa-gold shadow-sm"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {/* Cart Toggle for Mobile/Tablet */}
            <button 
              onClick={() => setShowCart(true)}
              className="md:hidden bg-kowawa-brown text-white p-2 rounded relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2"/></svg>
              {currentOrder.length > 0 && <span className="absolute -top-1 -right-1 bg-kowawa-gold text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{currentOrder.length}</span>}
            </button>
          </div>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 md:px-6 py-2 md:py-3 text-[10px] uppercase font-bold tracking-widest border transition-all whitespace-nowrap ${activeTab === cat ? 'bg-kowawa-brown text-white' : 'bg-white text-gray-500 hover:border-kowawa-gold shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-20 md:pb-0">
          {filteredMenu.map(item => (
            <button 
              key={item.id}
              onClick={() => addToOrder(item)}
              className="bg-white p-3 md:p-4 shadow-sm border-2 border-transparent hover:border-kowawa-gold transition-all flex flex-col text-left group"
            >
              <div className="w-full aspect-square bg-gray-50 mb-3 overflow-hidden rounded-sm">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="font-bold text-xs md:text-sm text-kowawa-brown mb-1 line-clamp-1">{item.name}</p>
              <p className="text-kowawa-gold text-[10px] md:text-xs font-bold">Rp {item.price.toLocaleString()}</p>
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center opacity-60">
                 <span className="text-[8px] uppercase tracking-tighter">Stock: {item.stock}</span>
                 <span className="text-kowawa-brown font-bold text-xs">+</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Order Summary (Drawer on Mobile/Tablet, Sidebar on Desktop) */}
      <div className={`
        fixed inset-y-0 right-0 z-[110] w-full sm:w-80 md:w-96 bg-white shadow-2xl flex flex-col p-6 transition-transform duration-300
        ${showCart ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:static border-l
      `}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-serif text-kowawa-brown font-bold uppercase tracking-widest">Ringkasan</h2>
          <button onClick={() => setShowCart(false)} className="md:hidden text-gray-400 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {currentOrder.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50 space-y-4 py-20">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2"/></svg>
              <p className="text-xs font-medium uppercase tracking-widest">Belum ada pesanan</p>
            </div>
          )}
          {currentOrder.map(item => (
            <div key={item.id} className="flex justify-between items-start group bg-gray-50 p-3 rounded">
              <div className="flex-grow">
                <p className="font-bold text-xs text-kowawa-brown">{item.name}</p>
                <p className="text-[10px] text-gray-400">x{item.quantity} • Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => removeFromOrder(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-6 space-y-3 mt-4">
          <div className="flex justify-between text-gray-500 text-[10px] uppercase font-bold tracking-widest">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            <span>Pajak (10%)</span>
            <span>Rp {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-2xl text-kowawa-brown pt-2 border-t">
            <span className="font-serif">TOTAL</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="py-4 border-2 border-kowawa-brown text-kowawa-brown text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Draft</button>
          <button 
            onClick={finalizeOrder}
            disabled={currentOrder.length === 0 || isProcessing}
            className="py-4 bg-kowawa-brown text-white text-[10px] font-bold uppercase tracking-widest hover:bg-kowawa-gold shadow-lg transition-all disabled:opacity-20 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Selesaikan'}
          </button>
        </div>
      </div>

      {/* Cart Mobile Bottom Bar */}
      {currentOrder.length > 0 && !showCart && (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex justify-between items-center z-[100]">
           <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Pesanan</p>
              <p className="font-bold text-kowawa-brown">Rp {total.toLocaleString()}</p>
           </div>
           <button 
             onClick={() => setShowCart(true)}
             className="bg-kowawa-gold text-white px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest"
           >
             Cek Out ({currentOrder.length})
           </button>
        </div>
      )}
    </div>
  );
};
