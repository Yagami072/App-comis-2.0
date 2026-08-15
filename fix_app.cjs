const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('useUsers')) {
  code = code.replace(
    `import { useData } from './hooks/useData';`,
    `import { useData } from './hooks/useData';\nimport { useUsers } from './hooks/useUsers';`
  );
}

code = code.replace(
  `const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData(currentUser);`,
  `const { catalog, sales, isLoaded, addSale, deleteSale, saveCatalog, updateSale, resetCatalog } = useData(currentUser);\n  const { users, isUsersLoaded, addUser, updateUser, deleteUser } = useUsers();`
);

code = code.replace(
  `if (currentUser && !isLoaded) {`,
  `if (!isUsersLoaded || (currentUser && !isLoaded)) {`
);

code = code.replace(
  `<Login onLogin={setCurrentUser} />`,
  `<Login onLogin={setCurrentUser} users={users} />`
);

// Add users props to CatalogManager
code = code.replace(
  `<CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} />`,
  `<CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />`
);

fs.writeFileSync('src/App.tsx', code);
