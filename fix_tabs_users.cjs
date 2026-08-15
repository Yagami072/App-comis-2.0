const fs = require('fs');
let code = fs.readFileSync('src/components/Tabs.tsx', 'utf8');

// First check if Users is already imported, we need Users icon.
if (!code.includes('UsersIcon')) {
  code = code.replace(
    `import { ShoppingCart, BarChart3, Edit3, Settings, LogOut, User as UserIcon } from 'lucide-react';`,
    `import { ShoppingCart, BarChart3, Edit3, Settings, LogOut, User as UserIcon, Users as UsersIcon } from 'lucide-react';`
  );
}

// Add the users tab
code = code.replace(
  `{ id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin', 'seller'] },`,
  `{ id: 'catalog', label: 'Catálogo', icon: Settings, roles: ['admin', 'seller'] },\n    { id: 'users', label: 'Usuarios', icon: UsersIcon, roles: ['admin'] },`
);

fs.writeFileSync('src/components/Tabs.tsx', code);
