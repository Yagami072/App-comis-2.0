const fs = require('fs');
let code = fs.readFileSync('src/components/CatalogManager.tsx', 'utf8');

code = code.replace(
  `import { CatalogItem, CommissionType } from '../types';`,
  `import { CatalogItem, CommissionType, User } from '../types';`
);

code = code.replace(
  `interface Props {
  catalog: CatalogItem[];
  saveCatalog: (catalog: CatalogItem[]) => void;
  resetCatalog: () => void;
}`,
  `interface Props {
  catalog: CatalogItem[];
  saveCatalog: (catalog: CatalogItem[]) => void;
  resetCatalog: () => void;
  currentUser: User;
}`
);

code = code.replace(
  `export function CatalogManager({ catalog, saveCatalog, resetCatalog }: Props) {`,
  `export function CatalogManager({ catalog, saveCatalog, resetCatalog, currentUser }: Props) {`
);

fs.writeFileSync('src/components/CatalogManager.tsx', code);
