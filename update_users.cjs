const fs = require('fs');

// 1. types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
typesCode = typesCode.replace(
  `export const USERS: User[] = [`,
  `export const INITIAL_USERS: User[] = [`
);
fs.writeFileSync('src/types.ts', typesCode);

// 2. useData.ts
let useDataCode = fs.readFileSync('src/hooks/useData.ts', 'utf8');

// Add users to state
useDataCode = useDataCode.replace(
  `const [sales, setSales] = useState<Sale[]>([]);`,
  `const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);`
);

// Add INITIAL_USERS import
useDataCode = useDataCode.replace(
  `INITIAL_CATALOG, User } from '../types';`,
  `INITIAL_CATALOG, User, INITIAL_USERS } from '../types';`
);

// Add users subscription (We need this to happen regardless of currentUser because Login needs it)
// Oh, wait, in App.tsx, Login doesn't use `useData`, it imports USERS directly. We need a separate hook for Login, or we can just fetch users in App.tsx and pass them to Login.

