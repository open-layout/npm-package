import fs from 'fs';
import pkg from '../package.json';

console.log('Updating package.json data...');

let config = fs.readFileSync(__dirname + '/../src/globals/config.ts', 'utf8');
config = config
  .replace(/name: .*/, `name: '${pkg.name}',`)
  .replace(/version: .*/, `version: '${pkg.version}',`)
  .replace(/description: .*/, `description: '${pkg.description}',`);

fs.writeFileSync(__dirname + '/../src/globals/config.ts', config);
