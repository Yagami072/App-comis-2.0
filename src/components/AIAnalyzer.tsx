import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Sale } from '../types';

interface Props {
  sales: Sale[];
  fecha: string;
}

export function AIAnalyzer({ sales, fecha }: Props) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');
    try {
      const summaryData = sales.map(s => ({
        vendedor: s.vendedor,
        articulo: s.articulo,
        cantidad: s.cantidad,
        precioTotal: s.precioTotal,
        comision: s.comision
      }));

      const prompt = `Analiza los siguientes datos de ventas del día ${fecha} y genera un breve y conciso reporte gerencial resaltando tendencias, vendedor destacado, artículo más vendido y sugerencias rápidas. Sé muy profesional y directo.\n\nDatos de ventas: ${JSON.stringify(summaryData)}`;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setAnalysis(data.text);
    } catch (err) {
      setAnalysis('Ocurrió un error al generar el análisis. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 mb-12 print:hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Sparkles className="text-zinc-100" size={18} />
          </div>
          <div>
            <h3 className="text-lg font-serif text-zinc-100">Análisis de Inteligencia Artificial</h3>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Con tecnología Gemini</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || sales.length === 0}
          className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Generar Reporte'}
        </button>
      </div>

      {analysis && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}
