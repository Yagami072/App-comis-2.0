const fs = require('fs');
let code = fs.readFileSync('src/components/Summary.tsx', 'utf8');

// Replace standard imports
if (!code.includes('CalendarRange')) {
  code = code.replace(
    `import { FileText, Download, DollarSign, Package, TrendingUp } from 'lucide-react';`,
    `import { FileText, Download, DollarSign, Package, TrendingUp, CalendarRange, Trophy, Star } from 'lucide-react';`
  );
}

// Add state for date ranges
code = code.replace(
  `const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);`,
  `const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({ start: today, end: today });
  
  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };`
);

// Filter by date range instead of strict equality
code = code.replace(
  `const filteredSales = visibleSales.filter(s => s.fecha === fechaFiltro);`,
  `const filteredSales = visibleSales.filter(s => s.fecha >= dateRange.start && s.fecha <= dateRange.end);`
);

// Add top articles calculation
code = code.replace(
  `// Group by vendor for the PDF-like view`,
  `// Top Items
  const itemsMap = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.articulo]) acc[sale.articulo] = { cantidad: 0, ingresos: 0 };
    acc[sale.articulo].cantidad += sale.cantidad;
    acc[sale.articulo].ingresos += sale.precioTotal;
    return acc;
  }, {} as Record<string, {cantidad: number, ingresos: number}>);
  
  const topItems = Object.entries(itemsMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  // Group by vendor for the PDF-like view`
);

// Update Header to show the date range selector
code = code.replace(
  `<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Resumen Financiero</h2>
          <p className="text-zinc-500 mt-2 font-medium">Reporte de ventas y comisiones de un día específico.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">Fecha</label>
          <input 
            type="date" 
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
            onClick={e => {
              try {
                if ('showPicker' in HTMLInputElement.prototype) {
                  (e.target as HTMLInputElement).showPicker();
                }
              } catch (err) {
                // Ignore if it fails or is not supported
              }
            }}
            className="bg-transparent border-b border-white/20 px-2 py-2 outline-none focus:border-white transition-colors text-zinc-100 font-medium cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>`,
  `<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Resumen Financiero</h2>
          <p className="text-zinc-500 mt-2 font-medium">Reporte de ventas y comisiones por periodo.</p>
        </div>
        
        <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
          <div className="flex gap-2">
            <button onClick={() => handleQuickFilter(0)} className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Hoy</button>
            <button onClick={() => handleQuickFilter(7)} className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">7 Días</button>
            <button onClick={() => handleQuickFilter(30)} className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">30 Días</button>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
            <CalendarRange className="text-zinc-500 ml-2" size={16} />
            <input 
              type="date" 
              value={dateRange.start}
              onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))}
              className="bg-transparent border-none outline-none text-zinc-300 font-medium text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <span className="text-zinc-600">-</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))}
              className="bg-transparent border-none outline-none text-zinc-300 font-medium text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>
        </div>
      </div>`
);

// Update Empty State
code = code.replace(
  `No hay ventas registradas para el {fechaFiltro}.`,
  `No hay ventas registradas en el periodo seleccionado.`
);

// Update Report date
code = code.replace(
  `Blancos Primavera • {fechaFiltro} {currentUser.role === 'seller' && \`• \${currentUser.username}\`}`,
  `Blancos Primavera • {dateRange.start} al {dateRange.end} {currentUser.role === 'seller' && \`• \${currentUser.username}\`}`
);

// Inject Top Items into the view
const newStatsSection = `
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden mt-8">
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-semibold text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2"><Trophy size={14} className="text-emerald-500/70" /> Desglose por Vendedor (Comisión)</h3>
              <div className="h-64 w-full bg-white/5 border border-white/10 rounded-2xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                    <Tooltip 
                      cursor={{fill: '#18181b'}}
                      contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px', fontSize: '12px'}}
                      formatter={(value: number) => [\`\$\${value.toFixed(2)}\`, 'Comisión']}
                    />
                    <Bar dataKey="comision" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={index === 0 ? '#10b981' : '#52525b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
               <h3 className="text-[11px] font-semibold text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2"><Star size={14} className="text-yellow-500/70" /> Artículos Más Vendidos</h3>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 overflow-y-auto">
                 {topItems.length > 0 ? (
                   <div className="space-y-4">
                     {topItems.map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold \${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-zinc-400'}\`}>
                             {i + 1}
                           </div>
                           <div className="text-sm font-medium text-zinc-200 line-clamp-1">{item.name}</div>
                         </div>
                         <div className="text-right">
                           <div className="text-sm text-zinc-300">{item.cantidad} <span className="text-[10px] text-zinc-500">uds</span></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-zinc-500 text-sm h-full flex items-center justify-center">Sin datos</div>
                 )}
               </div>
            </div>
          </div>
`;

// Replace the old chart container
code = code.replace(
  /<div className="print:hidden">\s*<h3 className="text-\[11px\].*?<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/s,
  newStatsSection
);

// Fix AI Analyzer props
code = code.replace(
  `<AIAnalyzer sales={filteredSales} fecha={fechaFiltro} />`,
  `<AIAnalyzer sales={filteredSales} fecha={\`\${dateRange.start} al \${dateRange.end}\`} />`
);


fs.writeFileSync('src/components/Summary.tsx', code);
