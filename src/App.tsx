import React, { useState, useEffect } from 'react';
import { useData } from './hooks/useData';
import { useUsers } from './hooks/useUsers';
import { Tabs } from './components/Tabs';
import { RegisterSale } from './components/RegisterSale';
import { Summary } from './components/Summary';
import { EditSales } from './components/EditSales';
import { CatalogManager } from './components/CatalogManager';
import { UserManager } from './components/UserManager';
import { Login } from './components/Login';
import { Toast, ToastType } from './components/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData(currentUser);
  const { users, isUsersLoaded, addUser, updateUser, deleteUser } = useUsers();
  const [activeTab, setActiveTab] = useState('register');
  const [debugLog, setDebugLog] = useState<string>('');
  
  // Toast state
  const [toast, setToast] = useState<{ id: number; message: string; type: ToastType } | null>(null);
  
  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    console.error = (...args) => {
      setDebugLog(prev => prev + '\nERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      originalError(...args);
    };
    console.warn = (...args) => {
      setDebugLog(prev => prev + '\nWARN: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      originalWarn(...args);
    };
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    }
  }, []);

  if (!isUsersLoaded || (currentUser && !isLoaded)) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4">
        <div className="text-zinc-600 tracking-widest uppercase text-[10px] mb-4">Iniciando...</div>
        {debugLog && <pre className="text-red-500 text-xs max-w-xl overflow-auto p-4 bg-red-950/20 border border-red-900/50 rounded">{debugLog}</pre>}
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} users={users} />;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex font-sans selection:bg-white/20">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={() => {setCurrentUser(null); setActiveTab('register');}} />
      
      <main className="flex-1 min-w-0 md:ml-64 pb-24 md:pb-0 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === 'register' && <RegisterSale catalog={catalog} users={users} addSale={addSale} currentUser={currentUser} showToast={showToast} />}
              {activeTab === 'summary' && <Summary sales={sales} currentUser={currentUser} />}
              {activeTab === 'edit' && <EditSales sales={sales} users={users} deleteSale={deleteSale} updateSale={updateSale} currentUser={currentUser} showToast={showToast} />}
              {activeTab === 'catalog' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} />}
              {activeTab === 'users' && currentUser.role === 'admin' && <UserManager users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} currentUser={currentUser} showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
