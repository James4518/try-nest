import * as bcrypt from 'bcrypt';

async function encryptPasswd(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export default encryptPasswd