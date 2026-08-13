const fs = require('fs');

const appTsx = `
import React, { useState } from 'react';
import { useData } from './hooks/useData';
import { Tabs } from './components/Tabs';
import { RegisterSale } from './components/RegisterSale';
import { Summary } from './components/Summary';
import { EditSales } from './components/EditSales';
import { CatalogManager } from './components/CatalogManager';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData();
  const [activeTab, setActiveTab] = useState('register');

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-zinc-600 tracking-widest uppercase text-[10px]">Iniciando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex font-sans selection:bg-white/20">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
              {activeTab === 'register' && <RegisterSale catalog={catalog} addSale={addSale} />}
              {activeTab === 'summary' && <Summary sales={sales} />}
              {activeTab === 'edit' && <EditSales sales={sales} deleteSale={deleteSale} updateSale={updateSale} />}
              {activeTab === 'catalog' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', appTsx.trim() + '\n');
console.log('App.tsx updated');
