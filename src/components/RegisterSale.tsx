
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
      comision,
      registradoPor: currentUser.username
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
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              onClick={e => {
                try {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    (e.target as HTMLInputElement).showPicker();
                  }
                } catch (err) {
                  // Ignore
                }
              }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Vendedor</label>
            <select 
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-xl appearance-none cursor-pointer"
              value={vendedor}
              onChange={(e) => setVendedor(e.target.value)}
            >
              {VENDEDORES.map(v => (
                <option key={v} value={v} className="bg-[#111] text-zinc-100">{v}</option>
              ))}
            </select>
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
                  {item.articulo} ({item.tipo === 'Porcentaje' ? `${(item.valor * 100).toFixed(0)}%` : `$${item.valor}`})
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
              <div className={`w-5 h-5 flex items-center justify-center rounded border transition-all ${usarPorcentajePersonalizado ? 'bg-zinc-100 border-zinc-100' : 'border-white/20 group-hover:border-white/50'}`}>
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
              <p className="text-3xl font-serif text-zinc-100 mt-1">${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#fafafa] uppercase tracking-[0.2em]">Comisión</p>
              <p className="text-3xl font-serif text-[#fafafa] mt-1">${comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isCooldown}
            className={`w-full sm:w-auto font-medium py-3.5 px-8 rounded-full transition-all duration-300 text-[11px] tracking-[0.1em] uppercase
              ${isCooldown 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-zinc-100 hover:bg-white text-black active:scale-[0.98]'
              }`}
          >
            {isCooldown ? 'Procesando...' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
}
