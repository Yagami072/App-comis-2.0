const fs = require('fs');

// 1. Update Tabs.tsx
let tabsCode = fs.readFileSync('src/components/Tabs.tsx', 'utf8');
tabsCode = tabsCode.replace(
  `{ id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin'] }`,
  `{ id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin', 'seller'] }`
);
fs.writeFileSync('src/components/Tabs.tsx', tabsCode);

// 2. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  `{activeTab === 'catalog' && currentUser.role === 'admin' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} />}`,
  `{activeTab === 'catalog' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} />}`
);
fs.writeFileSync('src/App.tsx', appCode);

// 3. Update CatalogManager.tsx
let catalogCode = fs.readFileSync('src/components/CatalogManager.tsx', 'utf8');

// Add currentUser to Props
catalogCode = catalogCode.replace(
  `interface Props {\n  catalog: CatalogItem[];\n  saveCatalog: (c: CatalogItem[]) => void;\n  resetCatalog: () => void;\n}`,
  `import { User } from '../types';\n\ninterface Props {\n  catalog: CatalogItem[];\n  saveCatalog: (c: CatalogItem[]) => void;\n  resetCatalog: () => void;\n  currentUser: User;\n}`
);

// Update component signature
catalogCode = catalogCode.replace(
  `export function CatalogManager({ catalog, saveCatalog, resetCatalog }: Props) {`,
  `export function CatalogManager({ catalog, saveCatalog, resetCatalog, currentUser }: Props) {`
);

// Hide Restaurar Predeterminados
catalogCode = catalogCode.replace(
  `<button \n          onClick={() => {`,
  `{currentUser.role === 'admin' && <button \n          onClick={() => {`
);
catalogCode = catalogCode.replace(
  `Restaurar Predeterminados'}\n        </button>`,
  `Restaurar Predeterminados'}\n        </button>}`
);

// Hide Agregar Articulo column wrapper
catalogCode = catalogCode.replace(
  `{/* Nuevo Artículo Form */}\n        <div className="md:col-span-4">`,
  `{/* Nuevo Artículo Form */}\n        {currentUser.role === 'admin' && <div className="md:col-span-4">`
);
// It ends around line 180... wait, let's use a regex or string replacement carefully
