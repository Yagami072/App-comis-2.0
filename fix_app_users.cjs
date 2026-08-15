const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('UserManager')) {
  code = code.replace(
    `import { CatalogManager } from './components/CatalogManager';`,
    `import { CatalogManager } from './components/CatalogManager';\nimport { UserManager } from './components/UserManager';`
  );
}

code = code.replace(
  `{activeTab === 'catalog' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />}`,
  `{activeTab === 'catalog' && <CatalogManager catalog={catalog} saveCatalog={saveCatalog} resetCatalog={resetCatalog} currentUser={currentUser} />}\n              {activeTab === 'users' && currentUser.role === 'admin' && <UserManager users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} currentUser={currentUser} showToast={showToast} />}`
);

fs.writeFileSync('src/App.tsx', code);
