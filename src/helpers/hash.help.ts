/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
interface IHashModule {
  password(pwd: string): Promise<string>;
  compare(password: string, hashCode: string): boolean;
}
class HashModule implements IHashModule {
  private static INSTANCE:HashModule;
  public static getInstance():HashModule{
    return this.INSTANCE ? this.INSTANCE : new HashModule();
  }
  constructor() {}
  compare = (password: string, hashCode: string): boolean => {    
    return bcrypt.compareSync(password, hashCode);
  };
  password = async (pwd: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(pwd, salt);
  };
}
export const HashCustomeModule: IHashModule = HashModule.getInstance();
