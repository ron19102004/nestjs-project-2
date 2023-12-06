/* eslint-disable prettier/prettier */

export interface ICharactorModule {
  charFirst(str: string): string;
}
export class CharactorModule implements ICharactorModule {
  charFirst(str: string): string {
    let res: string = '';
    for (let i = 0; i < str.length; i++) {
      res += str[i];
      if (str[i + 1] === ' ') break;
    }
    return res;
  }
}
export const CharactorCustomeModule: ICharactorModule = new CharactorModule();
