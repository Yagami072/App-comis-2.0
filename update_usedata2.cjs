const fs = require('fs');
let code = fs.readFileSync('src/hooks/useData.ts', 'utf8');

code = code.replace(
  `} as CatalogItem));`,
  `} as CatalogItem));`
);

// We need to carefully replace the onSnapshot calls to include the error callback
code = code.replace(
  `      setIsLoaded(true);\n    });`,
  `      setIsLoaded(true);\n    }, (error) => {\n      console.warn("Catalog snapshot error:", error);\n    });`
);

code = code.replace(
  `      setSales(salesData);\n    });`,
  `      setSales(salesData);\n    }, (error) => {\n      console.warn("Sales snapshot error:", error);\n    });`
);

fs.writeFileSync('src/hooks/useData.ts', code);
