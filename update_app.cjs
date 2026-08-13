const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  `import { motion, AnimatePresence } from 'motion/react';\nimport { User } from './types';`,
  `import { motion, AnimatePresence } from 'motion/react';\nimport { User } from './types';\nimport { auth } from './lib/firebase';`
);
code = code.replace(
  `onLogout={() => {setCurrentUser(null); setActiveTab('register');}}`,
  `onLogout={() => {auth.signOut(); setCurrentUser(null); setActiveTab('register');}}`
);
fs.writeFileSync('src/App.tsx', code);
