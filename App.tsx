import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Story } from "./components/Story";
import { Menu } from "./components/Menu";
import { Testimonials } from "./components/Testimonials";
import { Reservation } from "./components/Reservation";
import { Footer } from "./components/Footer";
import { Ambience } from "./components/Ambience";
import { POSSystem } from "./components/POSSystem";
import { CoffeeAssistant } from "./components/CoffeeAssistant";
import { getMenuItems } from "./services/firestoreService";
import { MenuItem, CartItem } from "./types";

function App() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPOS, setShowPOS] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const items = await getMenuItems();
        setMenu(items);
      } catch (error) { console.error(error); }
    };
    fetchMenu();
  }, []);

  const handleOrderClick = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    // Jangan langsung buka POS agar customer bisa pilih menu lain dulu
    // Tapi kita beri notifikasi kecil nantinya
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(i => i.id !== id));
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#FDFCF8] overflow-x-hidden">
      <Navbar cartCount={cartTotalItems} onCartClick={() => setShowPOS(true)} />
      
      <Hero onOrderClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <Story />
      <Ambience />
      <Menu items={menu} onOrderClick={handleOrderClick} />
      <Testimonials />
      <Reservation />
      <Footer />
      <CoffeeAssistant />

      {/* Keranjang Belanja / POS Overlay */}
      {showPOS && (
        <POSSystem 
          cart={cart} 
          onClose={() => setShowPOS(false)} 
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      )}
    </div>
  );
}

export default App;
