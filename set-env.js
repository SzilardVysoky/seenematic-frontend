const fs = require('fs');

const devPath = './src/environments/environment.dev.ts';
const prodPath = './src/environments/environment.prod.ts';

const devConfigFile = `
export const environment = {
    production: false,
    backendUrl: '${process.env.DEV_BACKEND_URL || 'http://localhost:3000'}'
};
`;

const prodConfigFile = `
export const environment = {
    production: true,
    backendUrl: '${process.env.NG_PROD_BACKEND_URL || ''}'
};
`;

if (!fs.existsSync(devPath)) {
    fs.writeFileSync(devPath, devConfigFile);
    console.log(`Development environment file generated at ${devPath}`);
}

fs.writeFileSync(prodPath, prodConfigFile);
console.log(`Production environment file generated at ${prodPath}`);