import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useAuthUser } from './AppContext';
import { firebaseEnabled } from './firebase';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Lifecycle } from './pages/Lifecycle';
import { Login } from './pages/Login';
import './index.css';

function App() {
  const user = useAuthUser();
  if (user === undefined) return <p className="p-8 text-sm text-slate-500">Memeriksa sesi…</p>;
  // Dengan Firebase aktif, data hanya bisa dibuka setelah login.
  if (firebaseEnabled && !user) return <Login />;
  return (
    <AppProvider user={user}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventaris" element={<Inventory />} />
          <Route path="siklus" element={<Lifecycle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
