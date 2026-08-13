const fs = require('fs');

const tabsTsx = `
import React from 'react';
import { ShoppingCart, BarChart3, Edit3, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs = [
    { id: 'register', label: 'Registrar', icon: ShoppingCart },
    { id: 'summary', label: 'Resumen', icon: BarChart3 },
    { id: 'edit', label: 'Editar', icon: Edit3 },
    { id: 'catalog', label: 'Catálogo', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 z-50 pb-safe">
        <div className="flex justify-around items-center p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`relative flex flex-col items-center justify-center w-full py-2 space-y-1 outline-none \${isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}\`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-white/5 rounded-xl"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                  />
                )}
                <Icon className={\`w-5 h-5 relative z-10 \${isActive ? 'text-zinc-100' : 'text-zinc-500'}\`} />
                <span className="text-[10px] font-medium tracking-wide relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-serif tracking-wide text-zinc-100">
            Primavera<span className="text-zinc-600">.</span>
          </h1>
        </div>
        
        <div className="flex flex-col space-y-2 px-4 mt-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`relative flex items-center w-full px-4 py-3 rounded-xl transition-colors outline-none \${isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}\`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                  />
                )}
                <Icon className={\`w-5 h-5 mr-3 relative z-10 \${isActive ? 'text-zinc-100' : 'text-zinc-500'}\`} />
                <span className="text-sm font-medium tracking-wide relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
`;

fs.writeFileSync('src/components/Tabs.tsx', tabsTsx.trim() + '\n');
console.log('Tabs.tsx updated');
