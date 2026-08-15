const fs = require('fs');

let code = fs.readFileSync('src/components/RegisterSale.tsx', 'utf8');

// Update Props interface
code = code.replace(
  `interface Props {
  catalog: CatalogItem[];
  addSale: (sale: Sale) => void;
  currentUser: User;
}`,
  `import { ToastType } from './Toast';\n\ninterface Props {
  catalog: CatalogItem[];
  addSale: (sale: Sale) => void;
  currentUser: User;
  showToast?: (message: string, type?: ToastType) => void;
}`
);

// Update component signature
code = code.replace(
  `export function RegisterSale({ catalog, addSale, currentUser }: Props) {`,
  `export function RegisterSale({ catalog, addSale, currentUser, showToast }: Props) {`
);

// Update addSale call
code = code.replace(
  `addSale(newSale);`,
  `addSale(newSale);\n    if (showToast) showToast('Venta registrada exitosamente', 'success');`
);

fs.writeFileSync('src/components/RegisterSale.tsx', code);
