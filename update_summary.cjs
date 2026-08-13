const fs = require('fs');
let code = fs.readFileSync('src/components/Summary.tsx', 'utf8');
code = code.replace(
  `import { DollarSign, Package, TrendingUp, Download, FileText } from 'lucide-react';`,
  `import { DollarSign, Package, TrendingUp, Download, FileText } from 'lucide-react';\nimport { AIAnalyzer } from './AIAnalyzer';`
);
code = code.replace(
  `{/* Reporte Estructurado */}`,
  `<AIAnalyzer sales={filteredSales} fecha={fechaFiltro} />\n          {/* Reporte Estructurado */}`
);
fs.writeFileSync('src/components/Summary.tsx', code);
