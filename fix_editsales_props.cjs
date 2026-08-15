const fs = require('fs');
let code = fs.readFileSync('src/components/EditSales.tsx', 'utf8');

code = code.replace(
  `import { User } from '../types';`,
  `import { User } from '../types';\nimport { ToastType } from './Toast';`
);

code = code.replace(
  `interface Props {
  sales: Sale[];
  currentUser: User;
  deleteSale: (id: string) => void;
  updateSale: (id: string, updatedSale: Sale) => void;
}`,
  `interface Props {
  sales: Sale[];
  currentUser: User;
  deleteSale: (id: string) => void;
  updateSale: (id: string, updatedSale: Sale) => void;
  showToast?: (message: string, type?: ToastType) => void;
}`
);

fs.writeFileSync('src/components/EditSales.tsx', code);
