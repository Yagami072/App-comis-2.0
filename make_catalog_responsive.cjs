const fs = require('fs');

let code = fs.readFileSync('src/components/CatalogManager.tsx', 'utf8');

const replacementDesktopTable = `
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">`;

code = code.replace(
  `<div className="overflow-x-auto">\n            <table className="w-full text-sm text-left whitespace-nowrap">`,
  replacementDesktopTable
);

const mobileView = `
          <div className="md:hidden space-y-4 mt-4">
            {catalog.map(item => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Editando Artículo</span>
                      <div className="flex gap-4">
                        <button onClick={saveEdit} className="text-emerald-400 p-1"><Check size={18} /></button>
                        <button onClick={cancelEdit} className="text-zinc-400 p-1"><X size={18} /></button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Nombre</label>
                      <input type="text" value={editForm.articulo} onChange={e => setEditForm({...editForm, articulo: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Tipo</label>
                        <select value={editForm.tipo} onChange={e => setEditForm({...editForm, tipo: e.target.value as CommissionType})} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm">
                          <option value="Porcentaje" className="bg-[#111]">Porcentaje</option>
                          <option value="Monto Fijo" className="bg-[#111]">Fijo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Valor</label>
                        <input type="number" step="0.01" value={editForm.valor} onChange={e => setEditForm({...editForm, valor: Number(e.target.value)})} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="text-zinc-100 font-medium leading-tight pr-4">{item.articulo}</div>
                      {currentUser.role === 'admin' && (
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(item)} className="text-zinc-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors"><Edit2 size={14} /></button>
                          {confirmDeleteId === item.id ? (
                            <div className="flex bg-red-500/10 rounded-full overflow-hidden border border-red-500/20 ml-2">
                              <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:bg-red-500/20 p-2"><Check size={14} /></button>
                              <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-400 hover:bg-white/10 p-2"><X size={14} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(item.id)} className="text-zinc-400 hover:text-red-400 p-2 bg-white/5 rounded-full transition-colors ml-2"><Trash2 size={14} /></button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-white/10 pt-3">
                      <div className="text-zinc-500 text-xs tracking-wider uppercase">{item.tipo}</div>
                      <div className="text-emerald-400 font-medium text-sm">
                        {item.tipo === 'Porcentaje' ? \`\${(item.valor * 100).toFixed(0)}%\` : \`\$\${item.valor.toLocaleString('es-MX', {minimumFractionDigits: 2})}\`}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
`;

code = code.replace(
  /<\/table>\n          <\/div>/,
  `</table>\n          </div>\n${mobileView}`
);

// We need to adjust grid column sizes for mobile since sellers don't see the right column
// Wait, the grid uses `md:col-span-8` and `md:col-span-4`. On mobile it's `col-span-1` which is fine.
// We can make `md:col-span-12` if seller, or just leave it.

fs.writeFileSync('src/components/CatalogManager.tsx', code);
