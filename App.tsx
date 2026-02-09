
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Menu } from './components/Menu';
import { Ambience } from './components/Ambience';
import { Testimonials } from './components/Testimonials';
import { Reservation } from './components/Reservation';
import { Footer } from './components/Footer';
import { CoffeeAssistant } from './components/CoffeeAssistant';
import { Storefront } from './components/Storefront';
import { POSSystem } from './components/POSSystem';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewState, MenuItem, Branch, Order } from './types';
import { getMenu, getBranches, createOrder, subscribeToOrders, seedDatabase } from './services/firestoreService';

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Kowawa Signature Latte', description: 'Double shot espresso with organic palm sugar.', price: 42000, category: 'Signature', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400', stock: 50 },
  { id: '2', name: 'Aceh Gayo V60', description: 'Notes of jasmine and peach.', price: 38000, category: 'Manual Brew', image: 'https://images.unsplash.com/photo-1544787210-2213d84ad960?auto=format&fit=crop&q=80&w=400', stock: 30 },
  { id: '3', name: 'Gold Dust Mocha', description: 'Dark chocolate with gold flakes.', price: 55000, category: 'Signature', image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=400', stock: 20 },
  { id: '4', name: 'Truffle Croissant', description: 'Premium truffle honey glaze.', price: 48000, category: 'Snacks', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400', stock: 15 },
];

const INITIAL_BRANCHES: Branch[] = [
  { id: 'B1', name: 'Kowawa Senopati', address: 'Jl. Senopati No. 88', status: 'Open' },
  { id: 'B2', name: 'Kowawa Kemang', address: 'Jl. Kemang Raya No. 12', status: 'Open' },
  { id: 'B3', name: 'Kowawa Menteng', address: 'Jl. Teuku Umar No. 5', status: 'Open' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('PUBLIC');
  const [scrolled, setScrolled] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Sync
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const initData = async () => {
      try {
        await seedDatabase(INITIAL_MENU, INITIAL_BRANCHES);
        const [m, b] = await Promise.all([getMenu(), getBranches()]);
        if (m.length > 0) setMenu(m);
        if (b.length > 0) setBranches(b);
      } catch (err) {
        console.error("Data init error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dedicated Orders Subscription
  useEffect(() => {
    let unsubscribe = () => {};
    
    // Kita jalankan subscribe setelah database kemungkinan besar siap
    const timeoutId = setTimeout(() => {
      try {
        unsubscribe = subscribeToOrders((newOrders) => {
          setOrders(newOrders);
          console.log("App: Orders state updated");
        });
      } catch (e) {
        console.error("Subscription setup failed:", e);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const handleNewOrder = async (order: Omit<Order, 'id'>) => {
    try {
      await createOrder(order);
      // Data akan otomatis terupdate via onSnapshot (subscribeToOrders)
    } catch (err) {
      console.error("Order process error:", err);
      throw err; // Lempar agar UI bisa menangani error
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FDFCF8] text-kowawa-brown">
        <div className="w-12 h-12 border-4 border-kowawa-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-serif italic text-xl">Menyiapkan Biji Kopi Terbaik...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'STORE':
        return <Storefront menu={menu} onOrder={handleNewOrder} branches={branches} onBack={() => setView('PUBLIC')} />;
      case 'POS':
        return <POSSystem menu={menu} onOrder={handleNewOrder} branches={branches} onBack={() => setView('PUBLIC')} />;
      case 'ADMIN':
        return <AdminDashboard orders={orders} menu={menu} branches={branches} onBack={() => setView('PUBLIC')} />;
      default:
        return (
          <>
            <Hero onOrderClick={() => setView('STORE')} />
            <Story />
            <Ambience />
            <Menu items={menu} />
            <Testimonials />
            <Reservation />
            <Footer />
            <CoffeeAssistant />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-kowawa-gold selection:text-white scroll-smooth font-sans">
      {view === 'PUBLIC' && <Navbar scrolled={scrolled} setView={setView} />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-[150]">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-kowawa-gold/30 flex gap-2">
          {[
            { id: 'PUBLIC', label: 'WEB', color: 'bg-kowawa-brown' },
            { id: 'STORE', label: 'SHOP', color: 'bg-blue-600' },
            { id: 'POS', label: 'POS', color: 'bg-green-600' },
            { id: 'ADMIN', label: 'ADMIN', color: 'bg-kowawa-gold' },
          ].map((v) => (
            <button 
              key={v.id}
              onClick={() => setView(v.id as ViewState)} 
              className={`${v.color} text-[10px] text-white px-3 py-2 rounded-lg font-bold uppercase tracking-wider shadow-sm hover:scale-110 transition-transform ${view === v.id ? 'ring-2 ring-offset-2 ring-kowawa-gold opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              {v.label}
              {v.id === 'ADMIN' && orders.some(o => o.status === 'Pending') && (
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
