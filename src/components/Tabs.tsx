
import React from 'react';
import { ShoppingCart, BarChart3, Edit3, Settings, LogOut, User as UserIcon, Users as UsersIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
}

export function Tabs({ activeTab, setActiveTab, currentUser, onLogout }: TabsProps) {
  const allTabs = [
    { id: 'register', label: 'Registrar', icon: ShoppingCart, roles: ['admin', 'seller'] },
    { id: 'summary', label: 'Resumen', icon: BarChart3, roles: ['admin', 'seller'] },
    { id: 'edit', label: 'Editar', icon: Edit3, roles: ['admin', 'seller'] },
    { id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin', 'seller'] },
    { id: 'users', label: 'Usuarios', icon: UsersIcon, roles: ['admin'] },
  ];

  const tabs = allTabs.filter(t => t.roles.includes(currentUser.role));

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
                className={`relative flex flex-col items-center justify-center w-full py-2 space-y-1 outline-none ${isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-white/5 rounded-xl"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-medium tracking-wide relative z-10">{tab.label}</span>
              </button>
            );
          })}
          <button onClick={onLogout} className="relative flex flex-col items-center justify-center w-full py-2 space-y-1 outline-none text-zinc-500 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 relative z-10" />
            <span className="text-[10px] font-medium tracking-wide relative z-10">Salir</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-serif tracking-wide text-zinc-100">
            Primavera<span className="text-zinc-600">.</span>
          </h1>
        </div>
        
        <div className="flex flex-col space-y-2 px-4 mt-4 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center w-full px-4 py-3 rounded-xl transition-colors outline-none ${isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-5 h-5 mr-3 relative z-10 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                <span className="text-sm font-medium tracking-wide relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon size={14} className="text-zinc-300" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-zinc-200">{currentUser.username}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl transition-colors outline-none text-zinc-500 hover:text-red-400 hover:bg-white/5"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </>
  );
}
