
import React, { useState } from 'react';
import { MenuItem, Branch, Order, CartItem } from '../types';

interface StorefrontProps {
  menu: MenuItem[];
  branches: Branch[];
  onOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  onBack: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({ menu, branches, onOrder, onBack }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState(branches.length > 0 ? branches[0].id : '');
  const [isCheckout, setIsCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const newOrder: Omit<Order, 'id'> = {
        items: cart,
        total,
        timestamp: new Date(),
        branchId: selectedBranch,
        type: 'Online',
        status: 'Pending'
      };
      await onOrder(newOrder);
      setCart([]);
      setIsCheckout(true);
    } catch (err) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCheckout) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 text-center shadow-xl border border-kowawa-gold/20">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="font-serif text-3xl text-kowawa-brown mb-2">Pesanan Diterima!</h2>
          <p className="text-gray-500 mb-8 italic">Silakan ambil pesanan Anda di cabang pilihan dalam 15-20 menit.</p>
          <button onClick={onBack} className="bg-kowawa-brown text-white px-8 py-3 uppercase tracking-widest text-xs font-bold w-full hover:bg-kowawa-gold transition-colors">Kembali ke Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="bg-kowawa-brown text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <button onClick={onBack} className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:text-kowawa-gold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" stroke="currentColor"/></svg> Kembali
        </button>
        <span className="font-serif text-xl tracking-widest font-bold">KOWAWA SHOP</span>
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2" stroke="currentColor"/></svg>
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-kowawa-gold text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-kowawa-brown">{cart.length}</span>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 md:gap-12">
        <div className="lg:w-2/3 space-y-12">
          <section>
            <h2 className="font-serif text-3xl text-kowawa-brown mb-6">Pilih Cabang</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {branches.map(b => (
                <button 
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  className={`p-4 text-left border-2 transition-all rounded shadow-sm ${selectedBranch === b.id ? 'border-kowawa-gold bg-kowawa-gold/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <p className="font-bold text-sm text-kowawa-brown">{b.name}</p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-tight">{b.address}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-kowawa-brown mb-6">Menu Online</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {menu.map(item => (
                <div key={item.id} className="bg-white p-4 shadow-sm group border border-gray-50 hover:border-kowawa-gold transition-all flex flex-col rounded">
                  <div className="relative overflow-hidden aspect-video mb-4">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-serif text-xl text-kowawa-brown">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">{item.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 italic">{item.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-kowawa-gold font-bold text-sm">Rp {item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-kowawa-brown text-white px-5 py-2 text-[10px] uppercase font-bold hover:bg-kowawa-gold transition-colors shadow-md active:scale-95"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 md:p-8 shadow-xl sticky top-24 border border-gray-100 rounded">
            <h3 className="font-serif text-2xl text-kowawa-brown mb-6 border-b pb-4 font-bold uppercase tracking-widest">Detail Belanja</h3>
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-kowawa-brown">{item.name}</span>
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-kowawa-brown font-bold">Rp {(item.price * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500">×</button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-gray-400 text-sm italic text-center py-10">Keranjang masih kosong.</p>}
            </div>
            
            <div className="border-t pt-4 space-y-2 mb-8">
               <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold">
                  <span>Subtotal</span>
                  <span>Rp {total.toLocaleString()}</span>
               </div>
               <div className="flex justify-between font-bold text-xl text-kowawa-brown pt-2">
                  <span className="font-serif">TOTAL</span>
                  <span>Rp {total.toLocaleString()}</span>
               </div>
            </div>

            <button 
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
              className="w-full bg-kowawa-brown text-white py-4 uppercase tracking-[0.2em] font-bold text-xs disabled:opacity-50 hover:bg-kowawa-gold transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Bayar Sekarang'}
            </button>
            <div className="mt-6 flex justify-center gap-4 opacity-30 grayscale">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
