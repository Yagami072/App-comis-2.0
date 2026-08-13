const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  `  const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData();\n  const [activeTab, setActiveTab] = useState('register');\n  const [currentUser, setCurrentUser] = useState<User | null>(null);`,
  `  const [currentUser, setCurrentUser] = useState<User | null>(null);\n  const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData(currentUser);\n  const [activeTab, setActiveTab] = useState('register');`
);
code = code.replace(
  `  if (!isLoaded) {\n    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-zinc-600 tracking-widest uppercase text-[10px]">Iniciando...</div>;\n  }\n\n  if (!currentUser) {\n    return <Login onLogin={setCurrentUser} />;\n  }`,
  `  if (currentUser && !isLoaded) {\n    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-zinc-600 tracking-widest uppercase text-[10px]">Iniciando...</div>;\n  }\n\n  if (!currentUser) {\n    return <Login onLogin={setCurrentUser} />;\n  }`
);
fs.writeFileSync('src/App.tsx', code);
