
import React, { useState } from 'react';
import { Order, MenuItem, Branch } from '../types';
import { updateOrderStatus } from '../services/firestoreService';

interface AdminProps {
  orders: Order[];
  menu: MenuItem[];
  branches: Branch[];
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminProps> = ({ orders, menu, branches, onBack }) => {
  const [activeMenu, setActiveMenu] = useState<'Overview' | 'Orders' | 'Inventory' | 'Branches' | 'Security'>('Overview');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const onlineOrders = orders.filter(o => o.type === 'Online').length;
  const inStoreOrders = orders.filter(o => o.type === 'In-Store').length;

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert("Gagal memperbarui status.");
    } finally {
      setIsUpdating(null);
    }
  };

  const navItems = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Orders', label: 'Live Orders', isLive: true },
    { id: 'Inventory', label: 'Menu & Stock' },
    { id: 'Branches', label: 'Store Units' },
    { id: 'Security', label: 'Security (Rules)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Mobile/Tablet Header (Visible on screens smaller than 1024px for better tablet UX) */}
      <div className="lg:hidden bg-kowawa-brown text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center">
            <span className="transform -rotate-45 font-serif font-bold">K</span>
          </div>
          <span className="font-serif tracking-widest font-bold">HQ CENTRAL</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Sidebar (Responsive Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-kowawa-brown text-white p-6 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block border-r border-white/5
      `}>
        <div className="hidden lg:flex items-center gap-3 mb-12">
           <div className="w-8 h-8 border-2 border-kowawa-gold transform rotate-45 flex items-center justify-center">
              <div className="transform -rotate-45 font-serif text-white font-bold text-lg">K</div>
           </div>
           <span className="font-serif text-xl tracking-widest font-bold">HQ CENTRAL</span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-[10px] uppercase font-bold tracking-[0.2em] rounded transition-all flex items-center justify-between ${activeMenu === item.id ? 'bg-kowawa-gold text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <span>{item.label}</span>
              {item.isLive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          ))}
          <div className="pt-12 border-t border-white/5 mt-8">
            <button onClick={onBack} className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold tracking-[0.2em] text-red-400 hover:text-red-300">Log Out</button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 overflow-y-auto h-screen w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-kowawa-brown mb-1">{activeMenu}</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Kedai Kopi Kowawa Management</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-grow sm:flex-grow-0 bg-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest border rounded shadow-sm hover:shadow-md transition-all">Export</button>
            <button onClick={() => window.location.reload()} className="flex-grow sm:flex-grow-0 bg-kowawa-brown text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-kowawa-gold transition-colors">Refresh</button>
          </div>
        </header>

        {activeMenu === 'Overview' && (
          <div className="space-y-8 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Omzet', val: `Rp ${totalSales.toLocaleString()}`, color: 'text-kowawa-gold' },
                { label: 'Total Pesanan', val: orders.length, color: 'text-kowawa-brown' },
                { label: 'Pesanan Online', val: onlineOrders, color: 'text-blue-500' },
                { label: 'Pesanan POS', val: inStoreOrders, color: 'text-green-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 shadow-sm border-t-2 border-kowawa-gold">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-8 shadow-sm">
                <h3 className="font-serif text-xl mb-6">Penjualan per Cabang</h3>
                <div className="space-y-4">
                  {branches.map(b => {
                    const branchTotal = orders.filter(o => o.branchId === b.id).reduce((sum, o) => sum + o.total, 0);
                    return (
                      <div key={b.id} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{b.name}</span>
                          <span className="font-bold text-kowawa-brown">Rp {branchTotal.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-kowawa-gold transition-all duration-1000" style={{ width: `${(branchTotal / (totalSales || 1)) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 shadow-sm">
                <h3 className="font-serif text-xl mb-6">Aktivitas Terbaru</h3>
                <div className="space-y-4">
                  {orders.slice(0, 6).map(o => (
                    <div key={o.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${o.type === 'Online' ? 'bg-blue-400' : 'bg-green-400'}`} />
                      <div className="flex-grow">
                        <p className="text-[10px] font-bold text-kowawa-brown">{o.id.substring(0,8)}</p>
                        <p className="text-[10px] text-gray-400">{o.items.length} item • {o.branchId}</p>
                      </div>
                      <span className="text-[10px] font-bold text-kowawa-brown whitespace-nowrap">+Rp {o.total.toLocaleString()}</span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-center text-gray-300 italic text-xs py-8">Belum ada transaksi.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'Orders' && (
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg pb-20">
            <div className="p-4 border-b flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-kowawa-brown">Monitoring Pesanan Real-time</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400">Detail Item</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400">Total</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-kowawa-brown">{order.id.substring(0,8)}</p>
                        <p className="text-[10px] text-gray-400">{new Date(order.timestamp).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] space-y-0.5">
                          {order.items.map((it, idx) => (
                            <p key={idx} className="text-gray-600 truncate max-w-[200px]">• {it.name} (x{it.quantity})</p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-kowawa-brown">Rp {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status === 'Pending' && (
                            <>
                              <button 
                                disabled={isUpdating === order.id}
                                onClick={() => handleStatusChange(order.id, 'Completed')}
                                className="p-2 bg-green-500 text-white rounded shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
                              </button>
                              <button 
                                disabled={isUpdating === order.id}
                                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                className="p-2 bg-red-500 text-white rounded shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ... Other menus ... */}
      </main>

      {/* Overlay for Tablet/Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[105] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
