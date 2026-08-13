const fs = require('fs');

// 1. types.ts
const typesData = fs.readFileSync('src/types.ts', 'utf8');
const newTypesData = typesData + `
export type UserRole = 'admin' | 'seller';
export interface User {
  username: string;
  role: UserRole;
  pin: string;
}
export const USERS: User[] = [
  { username: 'QUEEN', role: 'admin', pin: 'Primavera2026' },
  { username: 'PACO', role: 'seller', pin: '1234' },
  { username: 'YAEL', role: 'seller', pin: '1234' },
  { username: 'ARELY', role: 'seller', pin: '1234' },
  { username: 'DYLAN', role: 'seller', pin: '1234' },
  { username: 'FERNANDO', role: 'seller', pin: '1234' },
  { username: 'PATRICIA SOTO', role: 'seller', pin: '1234' },
];
`;
fs.writeFileSync('src/types.ts', newTypesData);

// 2. Login.tsx
const loginTsx = `import React, { useState } from 'react';
import { USERS, User } from '../types';
import { Lock } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState(USERS[0].username);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username);
    if (user && user.pin === pin) {
      onLogin(user);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 selection:bg-white/20">
      <div className="max-w-sm w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Lock className="text-zinc-100" size={24} />
          </div>
          <h1 className="text-3xl font-serif tracking-wide text-zinc-100">Primavera<span className="text-zinc-600">.</span></h1>
          <p className="text-zinc-500 mt-3 font-medium text-[11px] tracking-[0.2em] uppercase">Portal de Ventas</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-8">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Usuario</label>
            <select
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-lg appearance-none cursor-pointer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            >
              {USERS.map(u => (
                <option key={u.username} value={u.username} className="bg-[#111] text-zinc-100">{u.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Contraseña</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-lg tracking-widest"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
            />
            {error && <p className="text-red-400 text-[10px] mt-2 uppercase tracking-widest font-semibold">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full font-semibold py-3.5 px-8 rounded-full transition-all duration-300 text-[11px] tracking-[0.1em] uppercase bg-zinc-100 hover:bg-white text-black mt-2"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/Login.tsx', loginTsx);

// 3. App.tsx
const appTsx = `
import React, { useState } from 'react';
import { useData } from './hooks/useData';
import { Tabs } from './components/Tabs';
import { RegisterSale } from './components/RegisterSale';
import { Summary } from './components/Summary';
import { EditSales } from './components/EditSales';
import { CatalogManager } from './components/CatalogManager';
import { Login } from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './types';

export default function App() {
  const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData();
  const [activeTab, setActiveTab] = useState('register');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-zinc-600 tracking-widest uppercase text-[10px]">Iniciando...</div>;
  }

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
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
              {activeTab === 'register' && <RegisterSale catalog={catalog} addSale={addSale} currentUser={currentUser} />}
              {activeTab === 'summary' && <Summary sales={sales} currentUser={currentUser} />}
              {activeTab === 'edit' && <EditSales sales={sales} deleteSale={deleteSale} updateSale={updateSale} currentUser={currentUser} />}
              {activeTab === 'catalog' && currentUser.role === 'admin' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/App.tsx', appTsx);

// 4. Tabs.tsx
const tabsTsx = `
import React from 'react';
import { ShoppingCart, BarChart3, Edit3, Settings, LogOut, User as UserIcon } from 'lucide-react';
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
    { id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin'] },
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
`;
fs.writeFileSync('src/components/Tabs.tsx', tabsTsx);

// 5. RegisterSale.tsx
const registerTsx = `
import React, { useState, useEffect } from 'react';
import { CatalogItem, Sale, VENDEDORES, User } from '../types';

interface Props {
  catalog: CatalogItem[];
  addSale: (sale: Sale) => void;
  currentUser: User;
}

export function RegisterSale({ catalog, addSale, currentUser }: Props) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [vendedor, setVendedor] = useState(currentUser.role === 'seller' ? currentUser.username : VENDEDORES[0]);
  const [articuloId, setArticuloId] = useState(catalog[0]?.id || '');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState<number | ''>('');
  
  const [usarPorcentajePersonalizado, setUsarPorcentajePersonalizado] = useState(false);
  const [porcentajePersonalizado, setPorcentajePersonalizado] = useState<number | ''>('');
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    if (catalog.length > 0 && !catalog.find(c => c.id === articuloId)) {
      setArticuloId(catalog[0].id);
    }
  }, [catalog, articuloId]);

  const selectedItem = catalog.find(i => i.id === articuloId) || catalog[0];
  const total = cantidad * (Number(precioUnitario) || 0);
  
  let comision = 0;
  let tipoComision = selectedItem?.tipo || 'Porcentaje';
  let valorAplicado = selectedItem?.valor || 0;

  if (usarPorcentajePersonalizado) {
    let customVal = Number(porcentajePersonalizado) || 0;
    customVal = customVal > 1 ? customVal / 100 : customVal;
    
    comision = total * customVal;
    tipoComision = 'Porcentaje';
    valorAplicado = customVal;
  } else if (selectedItem) {
    if (selectedItem.tipo === 'Porcentaje') {
      comision = total * selectedItem.valor;
    } else {
      comision = cantidad * selectedItem.valor;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !precioUnitario || isCooldown) return;

    if (usarPorcentajePersonalizado && (porcentajePersonalizado === '' || Number(porcentajePersonalizado) <= 0)) {
      alert('Ingresa un porcentaje válido.');
      return;
    }

    const newSale: Sale = {
      id: crypto.randomUUID(),
      fecha,
      vendedor,
      articulo: selectedItem.articulo,
      cantidad,
      precioUnitario: Number(precioUnitario),
      precioTotal: total,
      tipoComision,
      valorAplicado,
      comision
    };

    addSale(newSale);
    
    setCantidad(1);
    setPrecioUnitario('');
    setUsarPorcentajePersonalizado(false);
    setPorcentajePersonalizado('');
    
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-12">
        <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Registrar Venta</h2>
        <p className="text-zinc-500 mt-2 font-medium">Ingresa los detalles de la venta para calcular la comisión.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Fecha de venta</label>
            <input 
              type="date" 
              required
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Vendedor</label>
            {currentUser.role === 'seller' ? (
              <div className="w-full border-b border-white/10 py-2 text-zinc-400 text-xl select-none">
                {currentUser.username}
              </div>
            ) : (
              <select 
                className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl appearance-none cursor-pointer"
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
              >
                {VENDEDORES.map(v => (
                  <option key={v} value={v} className="bg-[#111] text-zinc-100">{v}</option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Artículo</label>
            <select 
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl appearance-none cursor-pointer"
              value={articuloId}
              onChange={(e) => setArticuloId(e.target.value)}
              required
            >
              <option value="" disabled className="bg-[#111] text-zinc-500">Selecciona un artículo</option>
              {catalog.map(item => (
                <option key={item.id} value={item.id} className="bg-[#111] text-zinc-100">
                  {item.articulo} ({item.tipo === 'Porcentaje' ? \`\${(item.valor * 100).toFixed(0)}%\` : \`$\${item.valor}\`})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Cantidad</label>
            <input 
              type="number" 
              min="1"
              required
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Precio Unitario</label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">$</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                required
                className="w-full bg-transparent border-b border-white/20 pl-6 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6 pt-2">
            <label className="flex items-center gap-4 cursor-pointer group w-max">
              <div className={\`w-5 h-5 flex items-center justify-center rounded border transition-all \${usarPorcentajePersonalizado ? 'bg-zinc-100 border-zinc-100' : 'border-white/20 group-hover:border-white/50'}\`}>
                {usarPorcentajePersonalizado && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6.5L5 9L9.5 3.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={usarPorcentajePersonalizado}
                onChange={(e) => setUsarPorcentajePersonalizado(e.target.checked)}
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors">Personalizar porcentaje de comisión</span>
            </label>
            
            {usarPorcentajePersonalizado && (
              <div className="w-full md:w-1/2 relative">
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Porcentaje (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="Ej. 7 o 0.07"
                    required={usarPorcentajePersonalizado}
                    className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl"
                    value={porcentajePersonalizado}
                    onChange={(e) => setPorcentajePersonalizado(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex gap-12">
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Total Venta</p>
              <p className="text-3xl font-serif text-zinc-100 mt-1">\${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#fafafa] uppercase tracking-[0.2em]">Comisión</p>
              <p className="text-3xl font-serif text-[#fafafa] mt-1">\${comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isCooldown}
            className={\`w-full sm:w-auto font-medium py-3.5 px-8 rounded-full transition-all duration-300 text-[11px] tracking-[0.1em] uppercase
              \${isCooldown 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-100 hover:bg-white text-black active:scale-[0.98]'
              }\`}
          >
            {isCooldown ? 'Procesando...' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
}
`;
fs.writeFileSync('src/components/RegisterSale.tsx', registerTsx);

// 6. Summary.tsx
let summaryTsx = fs.readFileSync('src/components/Summary.tsx', 'utf8');
summaryTsx = summaryTsx.replace(
  'interface Props {\n  sales: Sale[];\n}', 
  'import { User } from \'../types\';\ninterface Props {\n  sales: Sale[];\n  currentUser: User;\n}'
);
summaryTsx = summaryTsx.replace(
  'export function Summary({ sales }: Props) {',
  'export function Summary({ sales, currentUser }: Props) {'
);
summaryTsx = summaryTsx.replace(
  'const filteredSales = sales.filter(s => s.fecha === fechaFiltro);',
  'const visibleSales = currentUser.role === \'admin\' ? sales : sales.filter(s => s.vendedor === currentUser.username);\n  const filteredSales = visibleSales.filter(s => s.fecha === fechaFiltro);'
);
summaryTsx = summaryTsx.replace(
  'Blancos Primavera • {fechaFiltro}',
  'Blancos Primavera • {fechaFiltro} {currentUser.role === \'seller\' && `• ${currentUser.username}`}'
);
fs.writeFileSync('src/components/Summary.tsx', summaryTsx);

// 7. EditSales.tsx
let editSalesTsxFile = fs.readFileSync('src/components/EditSales.tsx', 'utf8');
editSalesTsxFile = editSalesTsxFile.replace(
  'interface Props {\n  sales: Sale[];',
  'import { User } from \'../types\';\ninterface Props {\n  sales: Sale[];\n  currentUser: User;'
);
editSalesTsxFile = editSalesTsxFile.replace(
  'export function EditSales({ sales, deleteSale, updateSale }: Props) {',
  'export function EditSales({ sales, deleteSale, updateSale, currentUser }: Props) {'
);
editSalesTsxFile = editSalesTsxFile.replace(
  'const filteredSales = sales\n    .filter',
  'const visibleSales = currentUser.role === \'admin\' ? sales : sales.filter(s => s.vendedor === currentUser.username);\n  const filteredSales = visibleSales\n    .filter'
);
editSalesTsxFile = editSalesTsxFile.replace(
  '<select value={editForm.vendedor}',
  '{currentUser.role === \'seller\' ? <div className="py-1 text-zinc-400 text-sm">{editForm.vendedor}</div> : <select value={editForm.vendedor}'
);
editSalesTsxFile = editSalesTsxFile.replace(
  '</select>\n                    </td>',
  '</select>}\n                    </td>'
);
fs.writeFileSync('src/components/EditSales.tsx', editSalesTsxFile);

// 8. CatalogManager.tsx
const catalogManagerTsx = `
import React, { useState } from 'react';
import { CatalogItem, CommissionType } from '../types';
import { Trash2, Plus, Edit2, Check, X, RotateCcw } from 'lucide-react';

interface Props {
  catalog: CatalogItem[];
  saveCatalog: (catalog: CatalogItem[]) => void;
  resetCatalog: () => void;
}

export function CatalogManager({ catalog, saveCatalog, resetCatalog }: Props) {
  const [newItem, setNewItem] = useState({
    articulo: '',
    tipo: 'Porcentaje' as CommissionType,
    valor: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CatalogItem>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.articulo || !newItem.valor) return;

    let parsedVal = Number(newItem.valor);
    if (newItem.tipo === 'Porcentaje' && parsedVal > 1) {
      parsedVal = parsedVal / 100;
    }

    const newCatalog = [...catalog, {
      id: crypto.randomUUID(),
      articulo: newItem.articulo,
      tipo: newItem.tipo,
      valor: parsedVal
    }];

    saveCatalog(newCatalog);
    setNewItem({ articulo: '', tipo: 'Porcentaje', valor: '' });
  };

  const startEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setEditForm({ ...item, valor: item.tipo === 'Porcentaje' ? item.valor * 100 : item.valor });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId !== null && editForm.articulo && editForm.valor !== undefined) {
      let parsedVal = Number(editForm.valor);
      if (editForm.tipo === 'Porcentaje' && parsedVal > 1) {
        parsedVal = parsedVal / 100;
      }
      
      const newCatalog = catalog.map(item => 
        item.id === editingId ? { ...item, articulo: editForm.articulo!, tipo: editForm.tipo!, valor: parsedVal } : item
      );
      saveCatalog(newCatalog);
      setEditingId(null);
      setEditForm({});
    }
  };

  const deleteItem = (id: string) => {
    saveCatalog(catalog.filter(i => i.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Catálogo</h2>
          <p className="text-zinc-500 mt-2 font-medium">Administra los artículos y sus reglas de comisión.</p>
        </div>
        <button 
          onClick={() => {
            if (confirmReset) {
              resetCatalog();
              setConfirmReset(false);
            } else {
              setConfirmReset(true);
            }
          }}
          className={\`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all \${confirmReset ? 'bg-red-900/40 text-red-400 border border-red-500/30' : 'bg-transparent border border-white/20 text-zinc-400 hover:text-zinc-100 hover:border-white/40'}\`}
        >
          <RotateCcw size={14} />
          {confirmReset ? '¿Restaurar valores de fábrica?' : 'Restaurar Predeterminados'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Lista del Catálogo */}
        <div className="md:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="py-3 pr-4 font-semibold">Artículo</th>
                  <th className="py-3 px-4 font-semibold text-center">Tipo</th>
                  <th className="py-3 px-4 font-semibold text-right">Comisión</th>
                  <th className="py-3 pl-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {catalog.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    {editingId === item.id ? (
                      <>
                        <td className="py-3 pr-4">
                          <input type="text" value={editForm.articulo} onChange={e => setEditForm({...editForm, articulo: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm" />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select value={editForm.tipo} onChange={e => setEditForm({...editForm, tipo: e.target.value as CommissionType})} className="bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm appearance-none text-center">
                            <option value="Porcentaje" className="bg-[#111]">Porcentaje</option>
                            <option value="Monto Fijo" className="bg-[#111]">Fijo</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input type="number" step="0.01" value={editForm.valor} onChange={e => setEditForm({...editForm, valor: Number(e.target.value)})} className="w-20 bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm text-right" />
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={saveEdit} className="text-zinc-400 hover:text-white p-1 transition-colors"><Check size={16} /></button>
                            <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 pr-4 text-zinc-100">{item.articulo}</td>
                        <td className="py-4 px-4 text-center text-zinc-500 text-xs tracking-wider uppercase">{item.tipo}</td>
                        <td className="py-4 px-4 text-right font-medium text-zinc-200">
                          {item.tipo === 'Porcentaje' ? \`\${(item.valor * 100).toFixed(0)}%\` : \`\$\${item.valor.toLocaleString('es-MX', {minimumFractionDigits: 2})}\`}
                        </td>
                        <td className="py-4 pl-4">
                          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(item)} className="text-zinc-500 hover:text-white p-1 transition-colors" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            {confirmDeleteId === item.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">¿Borrar?</span>
                                <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><Check size={16} /></button>
                                <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDeleteId(item.id)} className="text-zinc-500 hover:text-red-400 p-1 transition-colors" title="Eliminar">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nuevo Artículo Form */}
        <div className="md:col-span-4">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl sticky top-24">
            <h3 className="text-sm font-serif tracking-wide text-zinc-100 mb-6">Agregar Artículo</h3>
            <form onSubmit={handleAddItem} className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Nombre</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm"
                  value={newItem.articulo}
                  onChange={e => setNewItem({...newItem, articulo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Tipo</label>
                <select 
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm appearance-none"
                  value={newItem.tipo}
                  onChange={e => setNewItem({...newItem, tipo: e.target.value as CommissionType})}
                >
                  <option value="Porcentaje" className="bg-[#111]">Porcentaje</option>
                  <option value="Monto Fijo" className="bg-[#111]">Monto Fijo</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Valor ({newItem.tipo === 'Porcentaje' ? '%' : '$'})</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  placeholder={newItem.tipo === 'Porcentaje' ? "Ej. 7 o 0.07" : "Ej. 50.00"}
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm"
                  value={newItem.valor}
                  onChange={e => setNewItem({...newItem, valor: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-full transition-all duration-300 text-[10px] tracking-[0.1em] uppercase bg-zinc-100 hover:bg-white text-black mt-4"
              >
                <Plus size={14} />
                Agregar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/CatalogManager.tsx', catalogManagerTsx);

