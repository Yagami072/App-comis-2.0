const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  `import React, { useState } from 'react';`,
  `import React, { useState, useEffect } from 'react';`
);

code = code.replace(
  `const [selectedUser, setSelectedUser] = useState(users.length > 0 ? users[0].username : '');`,
  `const [selectedUser, setSelectedUser] = useState(users.length > 0 ? users[0].username : '');\n  useEffect(() => {\n    if (users.length > 0 && !selectedUser) {\n      setSelectedUser(users[0].username);\n    }\n  }, [users]);`
);

fs.writeFileSync('src/components/Login.tsx', code);
