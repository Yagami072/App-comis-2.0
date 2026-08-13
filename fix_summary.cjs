const fs = require('fs');
let code = fs.readFileSync('src/components/Summary.tsx', 'utf8');
if (!code.includes("import { AIAnalyzer } from './AIAnalyzer';")) {
  code = code.replace(
    `import { User } from '../types';`,
    `import { User } from '../types';\nimport { AIAnalyzer } from './AIAnalyzer';`
  );
  fs.writeFileSync('src/components/Summary.tsx', code);
}
