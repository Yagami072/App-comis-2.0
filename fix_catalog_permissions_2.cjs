const fs = require('fs');

let code = fs.readFileSync('src/components/CatalogManager.tsx', 'utf8');

// The Actions column in the header should be hidden for sellers
code = code.replace(
  `<th className="py-3 pl-4 font-semibold text-center">Acciones</th>`,
  `{currentUser.role === 'admin' && <th className="py-3 pl-4 font-semibold text-center">Acciones</th>}`
);

// The Actions td should be hidden for sellers
code = code.replace(
  `<td className="py-4 pl-4">
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
                        </td>`,
  `{currentUser.role === 'admin' && <td className="py-4 pl-4">
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
                        </td>}`
);

// Close the wrapper for 'Agregar Artículo' form
code = code.replace(
  `Agregar\n              </button>\n            </form>\n          </div>\n        </div>`,
  `Agregar\n              </button>\n            </form>\n          </div>\n        </div>}`
);

// We need to also add responsive cards for the catalog on mobile, like we did for Summary and EditSales!
// So let's replace the whole table structure with a responsive version.

fs.writeFileSync('src/components/CatalogManager.tsx', code);
