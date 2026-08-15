const fs = require('fs');
let code = fs.readFileSync('src/components/Summary.tsx', 'utf8');

const tableDesktop = `
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead>
                          <tr className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                            <th className="py-3 pr-4 font-semibold w-16">Cant</th>
                            <th className="py-3 px-4 font-semibold">Artículo</th>
                            <th className="py-3 px-4 font-semibold text-right">Venta</th>
                            <th className="py-3 pl-4 font-semibold text-right">Comisión</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {vendorSales.map((s, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="py-4 pr-4 text-zinc-400">{s.cantidad}</td>
                              <td className="py-4 px-4 text-zinc-300 group-hover:text-zinc-100 transition-colors">{s.articulo}</td>
                              <td className="py-4 px-4 text-right text-zinc-400">\${s.precioTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                              <td className="py-4 pl-4 text-right font-medium text-zinc-200">\${s.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                            </tr>
                          ))}
                          <tr className="bg-transparent border-t border-white/10">
                            <td colSpan={3} className="py-6 px-4 text-right font-semibold text-zinc-500 uppercase tracking-widest text-[10px]">Total a pagar</td>
                            <td className="py-6 pl-4 text-right font-serif text-xl text-zinc-100">
                              \${totalVendor.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-4">
                      {vendorSales.map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                           <div className="text-zinc-100 font-medium leading-tight">{s.articulo}</div>
                           <div className="flex justify-between items-center border-t border-white/10 pt-3">
                              <div className="text-zinc-400 text-xs">Cant: {s.cantidad} <span className="mx-1">•</span> Venta: \${s.precioTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
                              <div className="text-emerald-400 font-medium text-sm">Com: \${s.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
                           </div>
                        </div>
                      ))}
                      <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex justify-between items-center mt-2">
                        <div className="text-zinc-300 font-semibold uppercase tracking-widest text-[10px]">Total a pagar</div>
                        <div className="font-serif text-xl text-white">\${totalVendor.toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
                      </div>
                    </div>`;

// Replace the overflow-x-auto div
code = code.replace(/<div className="overflow-x-auto">[\s\S]*?<\/table>\s*<\/div>/, tableDesktop);

fs.writeFileSync('src/components/Summary.tsx', code);
