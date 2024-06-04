import * as fs from 'fs';
import * as path from 'path';
console.log(fs.readFileSync(path.resolve(__dirname, "keys/private.key")));
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, "keys/private.key"));

export {
  PRIVATE_KEY
};