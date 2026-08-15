const fs = require('fs');
let code = fs.readFileSync('src/components/EditSales.tsx', 'utf8');

// Add pagination states
code = code.replace(
  `const [searchTerm, setSearchTerm] = useState('');`,
  `const [searchTerm, setSearchTerm] = useState('');\n  const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 20;`
);

code = code.replace(
  `onChange={e => setSearchTerm(e.target.value)}`,
  `onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}`
);

// Calculate sliced sales
code = code.replace(
  `.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());`,
  `.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());\n\n  const totalPages = Math.max(1, Math.ceil(filteredSales.length / itemsPerPage));\n  const currentSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);`
);

// Replace mapping
code = code.replace(
  `{filteredSales.map((sale) => (`,
  `{currentSales.map((sale) => (`
);
code = code.replace( // for mobile too
  `{filteredSales.map((sale) => (`,
  `{currentSales.map((sale) => (`
);

// Add Chevron imports
if (!code.includes('ChevronLeft')) {
  code = code.replace(
    `import { Trash2, Edit2, X, Check } from 'lucide-react';`,
    `import { Trash2, Edit2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';`
  );
}

// Add Pagination Controls at the bottom
const paginationUI = `
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 border-t border-white/10 pt-6">
          <p className="text-zinc-500 text-xs">
            Mostrando <span className="text-zinc-300">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="text-zinc-300">{Math.min(currentPage * itemsPerPage, filteredSales.length)}</span> de <span className="text-zinc-300">{filteredSales.length}</span> registros
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-zinc-300 px-2">
              Pág. {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`;

// The file ends with:
//         ))}
//       </div>
//     </div>
//   );
// }

// Replace the end of the file
code = code.replace(
  /<\/div>\n    <\/div>\n  \);\n}/,
  paginationUI
);

// wait, the previous code had:
//       </div>`; (for mobile view replacement)
// So let's just do a string replacement on the last </div></div>);
// Or better, just regex replace the last `</div>    </div>  );}`
const lastDivIndex = code.lastIndexOf('</div>\n    </div>\n  );');
if (lastDivIndex !== -1) {
  code = code.substring(0, lastDivIndex) + paginationUI;
} else {
  // Let's use regex
  code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}\s*$/, paginationUI);
}

fs.writeFileSync('src/components/EditSales.tsx', code);
