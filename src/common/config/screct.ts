import { readFileSync } from "fs";
import { join, resolve } from "path";

const JWT_KEY = readFileSync(join(resolve('.'),'src/common/config/keys/jwt.key')).toString('utf-8');
const SESSION_KEY = readFileSync(join(resolve('.'),'src/common/config/keys/jwt.key'));

export {
  JWT_KEY,
  SESSION_KEY
};