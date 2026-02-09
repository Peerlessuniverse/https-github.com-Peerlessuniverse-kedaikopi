
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MenuItem, ReservationDetails, AmbienceItem, SiteSettings } from '../types';
import { Login } from './Login';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations' | 'orders' | 'ambience' | 'settings'>('menu');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<ReservationDetails[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ambienceItems, setAmbienceItems] = useState<AmbienceItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  
  const [newItem, setNewItem] = useState({ name: '', price: 0, description: '', category: 'Espresso', image: '' });
  const [newAmbience, setNewAmbience] = useState({ url: '', title: '', type: 'image' as 'image' | 'video' | 'youtube' });

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => { setUser(u); setLoading(false); });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    onSnapshot(query(collection(db, "menu")), (snap) => setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem))));
    onSnapshot(query(collection(db, "reservations"), orderBy("date", "desc")), (snap) => setReservations(snap.docs.map(d => ({ id: d.id, ...d.data() } as any))));
    onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as any))));
    onSnapshot(query(collection(db, "ambience")), (snap) => setAmbienceItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as AmbienceItem))));
    onSnapshot(doc(db, "settings", "general"), (d) => { if (d.exists()) setSettings(d.data() as SiteSettings); });
  }, [user]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db!, "orders", orderId), { status: newStatus });
      alert(`Status pesanan diperbarui ke ${newStatus}`);
    } catch (e) { alert("Gagal update status!"); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db!, "settings", "general"), settings, { merge: true });
      alert("✅ Pengaturan berhasil disimpan!");
    } catch (error: any) { alert(`❌ Gagal: ${error.message}`); }
  };

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddAmbience = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = newAmbience.url;
    if (newAmbience.type === 'youtube') {
       const id = getYouTubeID(newAmbience.url);
       if (id) finalUrl = id;
       else { alert("URL YouTube tidak valid!"); return; }
    }
    try {
      await addDoc(collection(db!, "ambience"), { ...newAmbience, url: finalUrl });
      setNewAmbience({ url: '', title: '', type: 'image' });
      alert("✅ Suasana berhasil ditambahkan!");
    } catch (e: any) { alert(e.message); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-kowawa-brown animate-pulse italic uppercase tracking-widest text-xl">Kowawa HQ Loading...</div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-kowawa-brown text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center"><span className="transform -rotate-45 font-serif font-bold">K</span></div>
          <span className="font-serif tracking-widest font-bold">ADMIN HQ</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={isSidebarOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} strokeWidth="2" /></svg>
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-64 bg-kowawa-brown text-white p-8 flex flex-col transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block shadow-2xl`}>
        <div className="hidden lg:flex items-center gap-3 mb-12">
          <div className="w-10 h-10 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center shadow-lg"><span className="transform -rotate-45 font-serif font-bold text-xl text-white">K</span></div>
          <h1 className="font-serif text-xl tracking-widest font-bold uppercase tracking-[0.2em]">HQ ADMIN</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {['menu', 'reservations', 'orders', 'ambience', 'settings'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab as any); setIsSidebarOpen(false); }} className={`text-left px-5 py-4 text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-kowawa-gold shadow-lg translate-x-1' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}>Kelola {tab}</button>
          ))}
        </nav>
        <div className="pt-8 border-t border-white/5 space-y-4">
          <a href="/" className="block text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-colors">← Website Depan</a>
          <button onClick={() => signOut(auth)} className="block text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest">Keluar HQ</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <header className="mb-8 md:mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <h2 className="text-3xl md:text-4xl font-serif text-kowawa-brown capitalize leading-tight">{activeTab} Management</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2 font-bold italic">Dashboard Control Pusat</p>
           </div>
           <div className="text-right hidden md:block"><p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest mb-1">Authenticated</p><p className="text-xs font-bold text-kowawa-gold">{user.email}</p></div>
        </header>

        <div className="animate-in slide-in-from-bottom-5 duration-500 pb-24">
          {activeTab === 'ambience' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
               <div className="bg-white p-8 rounded-2xl shadow-sm h-fit border border-gray-100">
                  <h3 className="font-serif text-xl mb-6 text-kowawa-brown uppercase font-bold tracking-widest">Tambah Suasana</h3>
                  <form onSubmit={handleAddAmbience} className="space-y-4">
                    <input type="text" placeholder="Judul Suasana" className="w-full p-4 bg-gray-50 border rounded-xl text-xs" value={newAmbience.title} onChange={e => setNewAmbience({...newAmbience, title: e.target.value})} required />
                    <select className="w-full p-4 bg-gray-50 border rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400" value={newAmbience.type} onChange={e => setNewAmbience({...newAmbience, type: e.target.value as any, url: ''})}>
                      <option value="image">Gambar (Photo)</option>
                      <option value="youtube">YouTube Video</option>
                      <option value="video">MP4 Direct Link</option>
                    </select>
                    <textarea placeholder="URL / Link YouTube" className="w-full p-4 bg-gray-50 border rounded-xl text-xs h-24" value={newAmbience.url} onChange={e => setNewAmbience({...newAmbience, url: e.target.value})} required />
                    <button type="submit" className="w-full bg-kowawa-brown text-white py-5 font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:bg-kowawa-gold">Simpan ke Galeri</button>
                  </form>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ambienceItems.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group">
                      <div className="w-full h-44 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                        {item.type === 'youtube' ? (
                           <img src={`https://img.youtube.com/vi/${item.url}/mqdefault.jpg`} className="w-full h-full object-cover opacity-60" />
                        ) : item.type === 'video' ? (
                           <span className="text-white text-[8px] uppercase font-bold opacity-40">MP4 Active</span>
                        ) : (
                           <img src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[8px] text-white font-bold uppercase tracking-widest">{item.type}</div>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className="font-bold text-[11px] uppercase tracking-widest text-kowawa-brown">{item.title}</span>
                        <button onClick={() => deleteDoc(doc(db!, "ambience", item.id))} className="text-red-300 hover:text-red-500 font-bold uppercase text-[9px]">Hapus</button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
             <form onSubmit={handleSaveSettings} className="space-y-12 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                      <h3 className="font-serif text-xl border-b pb-2 text-kowawa-brown uppercase font-bold tracking-widest">Utama & AI</h3>
                      <div className="space-y-4 text-xs font-bold text-gray-400">
                         <div className="space-y-1">
                           <label>GEMINI AI API KEY</label>
                           <input type="password" placeholder="Key" className="w-full p-4 bg-gray-50 border rounded-xl" value={settings.geminiApiKey || ''} onChange={e => setSettings({...settings, geminiApiKey: e.target.value})} />
                         </div>
                         <input type="text" placeholder="URL Logo" className="w-full p-4 bg-gray-50 border rounded-xl" value={settings.logoUrl || ''} onChange={e => setSettings({...settings, logoUrl: e.target.value})} />
                         <input type="text" placeholder="Judul Situs" className="w-full p-4 bg-gray-50 border rounded-xl text-kowawa-brown font-bold" value={settings.siteTitle || ''} onChange={e => setSettings({...settings, siteTitle: e.target.value})} />
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                      <h3 className="font-serif text-xl border-b pb-2 text-kowawa-brown uppercase font-bold tracking-widest">Sosial Media</h3>
                      <div className="space-y-4 text-xs font-bold text-gray-400">
                         <input type="text" placeholder="Instagram URL" className="w-full p-4 bg-gray-50 border rounded-xl" value={settings.instagramUrl || ''} onChange={e => setSettings({...settings, instagramUrl: e.target.value})} />
                         <input type="text" placeholder="Facebook URL" className="w-full p-4 bg-gray-50 border rounded-xl" value={settings.facebookUrl || ''} onChange={e => setSettings({...settings, facebookUrl: e.target.value})} />
                      </div>
                   </div>
                </div>
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                   <h3 className="font-serif text-xl border-b pb-2 text-kowawa-brown uppercase font-bold tracking-widest mb-6">Footer Content</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <textarea placeholder="Store Address" className="w-full p-4 bg-gray-50 border rounded-xl text-xs h-32 leading-relaxed" value={settings.footerAddress || ''} onChange={e => setSettings({...settings, footerAddress: e.target.value})} />
                      <div className="space-y-6">
                         <input type="text" placeholder="Hours" className="w-full p-4 bg-gray-50 border rounded-xl text-xs" value={settings.footerHours || ''} onChange={e => setSettings({...settings, footerHours: e.target.value})} />
                         <input type="text" placeholder="Tagline" className="w-full p-4 bg-gray-50 border rounded-xl text-xs font-bold text-kowawa-gold" value={settings.footerTagline || ''} onChange={e => setSettings({...settings, footerTagline: e.target.value})} />
                      </div>
                   </div>
                </div>
                <button type="submit" className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 bg-kowawa-gold text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 flex items-center gap-3">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>
                   <span>Simpan Semua Perubahan</span>
                </button>
             </form>
          )}

          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
               <div className="bg-white p-8 rounded-2xl shadow-sm h-fit border border-gray-100">
                  <h3 className="font-serif text-xl mb-6 text-kowawa-brown uppercase font-bold tracking-widest">Tambah Menu</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    await addDoc(collection(db!, "menu"), newItem);
                    setNewItem({ name: '', price: 0, description: '', category: 'Espresso', image: '' });
                  }} className="space-y-4">
                    <input type="text" placeholder="Nama Menu" className="w-full p-4 bg-gray-50 border rounded-xl text-xs" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                    <input type="number" placeholder="Harga" className="w-full p-4 bg-gray-50 border rounded-xl text-xs" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} required />
                    <textarea placeholder="Deskripsi" className="w-full p-4 bg-gray-50 border rounded-xl text-xs h-24" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                    <input type="text" placeholder="URL Foto" className="w-full p-4 bg-gray-50 border rounded-xl text-xs" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                    <button type="submit" className="w-full bg-kowawa-brown text-white py-5 font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:bg-kowawa-gold">Add to Menu</button>
                  </form>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border group">
                      <div className="flex items-center gap-4">
                        {item.image && <img src={item.image} className="w-14 h-14 object-cover rounded-xl" />}
                        <div><p className="font-bold text-sm text-kowawa-brown">{item.name}</p><p className="text-xs text-kowawa-gold font-bold">Rp {item.price.toLocaleString()}</p></div>
                      </div>
                      <button onClick={() => deleteDoc(doc(db!, "menu", item.id))} className="text-red-200 hover:text-red-500 transition-colors p-2 text-[10px] font-bold uppercase">X</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'orders' && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-gray-50 border-b text-[10px] uppercase tracking-widest text-gray-400 font-bold"><tr><th className="px-6 py-5">Order ID</th><th className="px-6 py-5">Item</th><th className="px-6 py-5">Total</th><th className="px-6 py-5">Status</th><th className="px-6 py-5">Aksi</th></tr></thead>
                   <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                         <tr key={order.id} className="hover:bg-gray-50/30 transition-colors text-xs">
                            <td className="px-6 py-5 font-mono text-gray-400">{order.id.substring(0,8)}</td>
                            <td className="px-6 py-5">{order.items?.map((it:any, idx:number) => (<div key={idx}>• {it.name} <span className="font-bold">x{it.quantity}</span></div>))}</td>
                            <td className="px-6 py-5 font-bold text-kowawa-brown">Rp {order.total?.toLocaleString()}</td>
                            <td className="px-6 py-5"><span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-50 text-green-500' : order.status === 'processing' ? 'bg-blue-50 text-blue-500' : 'bg-yellow-50 text-yellow-600'}`}>{order.status}</span></td>
                            <td className="px-6 py-5 flex gap-2">
                               <button onClick={() => updateStatus(order.id, 'processing')} className="p-2 bg-blue-500 text-white rounded text-[8px] font-bold">PROSES</button>
                               <button onClick={() => updateStatus(order.id, 'completed')} className="p-2 bg-green-500 text-white rounded text-[8px] font-bold">SELESAI</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {activeTab === 'reservations' && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                   <thead className="bg-gray-50 border-b text-[10px] uppercase tracking-widest text-gray-400 font-bold"><tr><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Schedule</th><th className="px-6 py-5">Action</th></tr></thead>
                   <tbody className="divide-y divide-gray-50">
                      {reservations.map(res => (
                         <tr key={res.id} className="hover:bg-gray-50/30 transition-colors text-xs"><td className="px-6 py-5"><b>{res.name}</b><br/>{res.phone}</td><td className="px-6 py-5">{res.date} @ {res.time} <span className="font-bold">({res.guests} PAX)</span></td><td className="px-6 py-5"><button onClick={() => deleteDoc(doc(db!, "reservations", res.id!))} className="text-red-300 font-bold uppercase text-[9px]">Selesai</button></td></tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </div>
      </main>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] lg:hidden transition-all duration-500" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};
