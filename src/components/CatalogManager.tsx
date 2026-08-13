
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
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${confirmReset ? 'bg-red-900/40 text-red-400 border border-red-500/30' : 'bg-transparent border border-white/20 text-zinc-400 hover:text-zinc-100 hover:border-white/40'}`}
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
                          {item.tipo === 'Porcentaje' ? `${(item.valor * 100).toFixed(0)}%` : `$${item.valor.toLocaleString('es-MX', {minimumFractionDigits: 2})}`}
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
