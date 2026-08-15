const fs = require('fs');

let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  `import { User, USERS } from '../types';`,
  `import { User } from '../types';`
).replace(
  `import { User, INITIAL_USERS } from '../types';`,
  `import { User } from '../types';`
);

code = code.replace(
  `interface Props {\n  onLogin: (user: User) => void;\n}`,
  `interface Props {\n  onLogin: (user: User) => void;\n  users: User[];\n}`
);

code = code.replace(
  `export function Login({ onLogin }: Props) {
  const [selectedUser, setSelectedUser] = useState(USERS[0].username);`,
  `export function Login({ onLogin, users }: Props) {
  const [selectedUser, setSelectedUser] = useState(users.length > 0 ? users[0].username : '');`
);
// In case the initial state evaluates before users are loaded, we can use a useEffect to set it.
// Actually it's better to just use `users[0]?.username`.

code = code.replace(
  `const user = USERS.find(u => u.username === selectedUser);`,
  `const user = users.find(u => u.username === selectedUser);`
);

code = code.replace(
  `{USERS.map(u => (`,
  `{users.map(u => (`
);

fs.writeFileSync('src/components/Login.tsx', code);
