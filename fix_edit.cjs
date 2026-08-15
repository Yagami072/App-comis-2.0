const fs = require('fs');
let code = fs.readFileSync('src/components/EditSales.tsx', 'utf8');

const replacement = `
      <div className="hidden md:block overflow-x-auto">
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
                      \${editForm.comision?.toLocaleString('es-MX', {minimumFractionDigits: 2})}
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
                    <td className="py-4 px-4 text-right text-zinc-300">\${sale.precioTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-4 text-right font-medium text-zinc-200">\${sale.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(sale)} className="text-zinc-500 hover:text-white p-1 transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        {confirmDeleteId === sale.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">¿Seguro?</span>
                            <button onClick={() => { deleteSale(sale.id); if (showToast) showToast('Venta eliminada', 'error'); }} className="text-red-400 hover:text-red-300 p-1 transition-colors"><Check size={16} /></button>
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

      <div className="md:hidden space-y-4">
        {filteredSales.map((sale) => (
          <div key={sale.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
            {editingId === sale.id ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Editando Venta</span>
                  <div className="flex gap-4">
                    <button onClick={saveEdit} className="text-emerald-400 p-1"><Check size={18} /></button>
                    <button onClick={cancelEdit} className="text-zinc-400 p-1"><X size={18} /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Fecha</label>
                    <input type="date" value={editForm.fecha} onChange={e => handleEditChange('fecha', e.target.value)} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Vendedor</label>
                    {currentUser.role === 'seller' ? <div className="py-1 text-zinc-400 text-sm">{editForm.vendedor}</div> : <select value={editForm.vendedor} onChange={e => handleEditChange('vendedor', e.target.value)} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm">
                      {VENDEDORES.map(v => <option key={v} value={v} className="bg-[#111]">{v}</option>)}
                    </select>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Artículo</label>
                  <input type="text" value={editForm.articulo} onChange={e => handleEditChange('articulo', e.target.value)} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Cantidad</label>
                    <input type="number" value={editForm.cantidad} onChange={e => handleEditChange('cantidad', Number(e.target.value))} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Venta ($)</label>
                    <input type="number" value={editForm.precioTotal} onChange={e => handleEditChange('precioTotal', Number(e.target.value))} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 text-right">
                  <span className="text-[10px] uppercase text-zinc-500 mr-2">Nueva Comisión:</span>
                  <span className="text-emerald-400 font-medium">\${editForm.comision?.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-zinc-100 font-medium leading-tight">{sale.articulo}</div>
                    <div className="text-zinc-400 text-[11px] mt-1.5 uppercase tracking-wider">{sale.vendedor} <span className="mx-1">•</span> {sale.fecha}</div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => startEdit(sale)} className="text-zinc-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors"><Edit2 size={14} /></button>
                    {confirmDeleteId === sale.id ? (
                      <div className="flex bg-red-500/10 rounded-full overflow-hidden border border-red-500/20">
                        <button onClick={() => { deleteSale(sale.id); if (showToast) showToast('Venta eliminada', 'error'); }} className="text-red-400 hover:bg-red-500/20 p-2"><Check size={14} /></button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-400 hover:bg-white/10 p-2"><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(sale.id)} className="text-zinc-400 hover:text-red-400 p-2 bg-white/5 rounded-full transition-colors"><Trash2 size={14} /></button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <div className="text-zinc-400 text-xs flex gap-3">
                    <span><span className="text-zinc-500">Cant:</span> {sale.cantidad}</span>
                    <span><span className="text-zinc-500">Venta:</span> \${sale.precioTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="text-emerald-400 font-medium text-sm text-right">
                    Com: \${sale.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>`;

// Replace the overflow-x-auto div
code = code.replace(/<div className="overflow-x-auto">[\s\S]*?<\/table>\s*<\/div>/, replacement);

fs.writeFileSync('src/components/EditSales.tsx', code);
