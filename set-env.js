const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
    production: true,
    backendUrl: '${process.env.NG_PROD_BACKEND_URL || ''}'
};
`;
fs.writeFileSync(targetPath, envConfigFile);
console.log(`Environment file generated at ${targetPath}`);