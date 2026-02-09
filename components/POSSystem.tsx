
import React, { useState } from 'react';
import { MenuItem, CartItem } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface POSProps {
  cart: CartItem[];
  onClose: () => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
}

export const POSSystem: React.FC<POSProps> = ({ cart, onClose, updateQuantity, removeFromCart }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const finalizeOrder = async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      await addDoc(collection(db!, "orders"), {
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        subtotal, tax, total, status: 'pending', createdAt: serverTimestamp()
      });
      alert('Transaksi Berhasil!');
      onClose();
    } catch (err) { alert('Gagal memproses transaksi.'); }
    finally { setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="bg-kowawa-brown p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-serif font-bold tracking-widest uppercase">Keranjang Anda</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 uppercase tracking-[0.3em] font-bold">Keranjang Kosong</div>
          ) : cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
              <div className="flex items-center gap-4">
                <img src={item.image} className="w-16 h-16 object-cover rounded-2xl shadow-sm" />
                <div>
                  <p className="font-bold text-kowawa-brown">{item.name}</p>
                  <p className="text-xs text-kowawa-gold font-bold">Rp {item.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 bg-gray-50 px-4 py-2 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold text-kowawa-brown hover:bg-kowawa-brown hover:text-white transition-all">-</button>
                    <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold text-kowawa-brown hover:bg-kowawa-brown hover:text-white transition-all">+</button>
                 </div>
                 <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 font-bold text-[10px] uppercase">Hapus</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-gray-50 space-y-4">
          <div className="flex justify-between text-xs uppercase font-bold tracking-widest text-gray-400"><span>Subtotal</span><span>Rp {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs uppercase font-bold tracking-widest text-gray-400"><span>Pajak (10%)</span><span>Rp {tax.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-3xl text-kowawa-brown pt-4 border-t">
            <span className="font-serif italic text-2xl">Total</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
          <button onClick={finalizeOrder} disabled={cart.length === 0 || isProcessing} className="w-full mt-6 py-5 bg-kowawa-brown text-white text-xs font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-kowawa-gold transition-all disabled:opacity-30">Konfirmasi Pesanan</button>
        </div>
      </div>
    </div>
  );
};
