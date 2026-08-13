import React, { useState } from 'react';
import { Sale, VENDEDORES } from '../types';
import { Trash2, Edit2, X, Check } from 'lucide-react';

import { User } from '../types';
interface Props {
  sales: Sale[];
  currentUser: User;
  deleteSale: (id: string) => void;
  updateSale: (id: string, updatedSale: Sale) => void;
}

export function EditSales({ sales, deleteSale, updateSale, currentUser }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Sale>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const visibleSales = currentUser.role === 'admin' 
    ? sales 
    : sales.filter(s => s.registradoPor === currentUser.username || (!s.registradoPor && s.vendedor === currentUser.username));
  const filteredSales = visibleSales
    .filter(s => 
       s.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
       s.fecha.includes(searchTerm) ||
      s.articulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const startEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setEditForm({ ...sale });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId !== null && editForm.fecha && editForm.vendedor && editForm.articulo) {
      const originalSale = sales.find(s => s.id === editingId);
      if (originalSale) {
        updateSale(editingId, {
          ...originalSale,
          fecha: editForm.fecha,
          vendedor: editForm.vendedor,
          articulo: editForm.articulo,
          cantidad: Number(editForm.cantidad) || 0,
          precioTotal: Number(editForm.precioTotal) || 0,
          tipoComision: editForm.tipoComision || 'Porcentaje',
          valorAplicado: Number(editForm.valorAplicado) || 0,
          comision: Number(editForm.comision) || 0
        });
      }
      setEditingId(null);
      setEditForm({});
    } else {
      alert("No se pudo guardar: verifica que Fecha, Vendedor y Artículo no estén vacíos.");
    }
  };

  const handleEditChange = (field: keyof Sale, value: string | number) => {
    setEditForm(prev => {
      const next = { ...prev, [field]: value };
      
      if (field === 'precioTotal' || field === 'cantidad') {
        const tipo = next.tipoComision || 'Porcentaje';
        const valor = Number(next.valorAplicado) || 0;
        
        if (tipo === 'Porcentaje') {
          next.comision = (Number(next.precioTotal) || 0) * valor;
        } else if (tipo === 'Monto Fijo') {
          next.comision = (Number(next.cantidad) || 0) * valor;
        }
      }
      
      return next;
    });
  };

  if (sales.length === 0) {
    return (
      <div className="max-w-5xl mx-auto pb-10">
        <h2 className="text-3xl font-serif tracking-wide text-zinc-100 mb-8">Historial de Ventas</h2>
        <div className="py-20 border-t border-white/10 text-center text-zinc-500 font-medium">
          Aún no hay ventas registradas.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Historial de Ventas</h2>
          <p className="text-zinc-500 mt-2 font-medium">Administra y edita los registros históricos.</p>
        </div>
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Buscar por vendedor, artículo o fecha..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
              <th className="py-3 px-4 font-semibold">Fecha</th>
              <th className="py-3 px-4 font-semibold">Vendedor</th>
              <th className="py-3 px-4 font-semibold">Artículo</th>
              <th className="py-3 px-4 font-semibold text-center">Cant</th>
              <th className="py-3 px-4 font-semibold text-right">Venta</th>
              <th className="py-3 px-4 font-semibold text-right">Comisión</th>
              <th className="py-3 px-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                {editingId === sale.id ? (
                  <>
                    <td className="py-2 px-4">
                      <input 
                        type="date" 
                        value={editForm.fecha} 
                        onChange={e => handleEditChange('fecha', e.target.value)} 
                        onClick={e => {
                          try {
                            if ('showPicker' in HTMLInputElement.prototype) {
                              (e.target as HTMLInputElement).showPicker();
                            }
                          } catch (err) {
                            // Ignore
                          }
                        }}
                        className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                      />
                    </td>
                    <td className="py-2 px-4">
                      {currentUser.role === 'seller' ? <div className="py-1 text-zinc-400 text-sm">{editForm.vendedor}</div> : <select value={editForm.vendedor} onChange={e => handleEditChange('vendedor', e.target.value)} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm">
                        {VENDEDORES.map(v => <option key={v} value={v} className="bg-[#111]">{v}</option>)}
                      </select>}
                    </td>
                    <td className="py-2 px-4">
                      <input type="text" value={editForm.articulo} onChange={e => handleEditChange('articulo', e.target.value)} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm" />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input type="number" min="1" value={editForm.cantidad} onChange={e => handleEditChange('cantidad', Number(e.target.value))} className="w-16 bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm text-center" />
                    </td>
                    <td className="py-2 px-4 text-right">
                      <input type="number" step="0.01" value={editForm.precioTotal} onChange={e => handleEditChange('precioTotal', Number(e.target.value))} className="w-24 bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm text-right" />
                    </td>
                    <td className="py-2 px-4 text-right text-zinc-400">
                      ${editForm.comision?.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={saveEdit} className="text-zinc-400 hover:text-white p-1 transition-colors"><Check size={16} /></button>
                        <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-4 text-zinc-400">{sale.fecha}</td>
                    <td className="py-4 px-4 text-zinc-100">{sale.vendedor}</td>
                    <td className="py-4 px-4 text-zinc-300 group-hover:text-zinc-100 transition-colors">{sale.articulo}</td>
                    <td className="py-4 px-4 text-center text-zinc-400">{sale.cantidad}</td>
                    <td className="py-4 px-4 text-right text-zinc-300">${sale.precioTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-4 text-right font-medium text-zinc-200">${sale.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(sale)} className="text-zinc-500 hover:text-white p-1 transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        {confirmDeleteId === sale.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">¿Seguro?</span>
                            <button onClick={() => deleteSale(sale.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><Check size={16} /></button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(sale.id)} className="text-zinc-500 hover:text-red-400 p-1 transition-colors" title="Eliminar">
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
  );
}
