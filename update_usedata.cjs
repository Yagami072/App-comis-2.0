const fs = require('fs');
let code = fs.readFileSync('src/hooks/useData.ts', 'utf8');
code = code.replace(
  `import { CatalogItem, Sale, INITIAL_CATALOG } from '../types';`,
  `import { CatalogItem, Sale, INITIAL_CATALOG, User } from '../types';`
);
code = code.replace(
  `export function useData() {`,
  `export function useData(currentUser: User | null) {`
);
code = code.replace(
  `useEffect(() => {`,
  `useEffect(() => {\n    if (!currentUser) {\n      setIsLoaded(false);\n      setCatalog([]);\n      setSales([]);\n      return;\n    }`
);
code = code.replace(
  `setIsLoaded(true); // Wait for both? Let's say yes, but we can do it here for now`,
  `setIsLoaded(true);`
);
fs.writeFileSync('src/hooks/useData.ts', code);
