/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
interface IHashModule {
  password(pwd: string): Promise<string>;
  compare(password: string, hashCode: string): boolean;
}
class HashModule implements IHashModule {
  constructor() {}
  compare = (password: string, hashCode: string): boolean => {    
    return bcrypt.compareSync(password, hashCode);
  };
  password = async (pwd: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(pwd, salt);
  };
}
export const HashCustomeModule: IHashModule = new HashModule();
