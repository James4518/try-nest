import * as bcrypt from 'bcrypt';

async function encryptPasswd(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}
async function comparePasswd(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
export  {
  encryptPasswd,
  comparePasswd
}