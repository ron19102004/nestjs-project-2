/* eslint-disable prettier/prettier */

export interface IValidatorModule {
  isEmail(email: string): boolean;
  isPhoneNumber(phone: string): boolean;
}
export class ValidatorModule implements IValidatorModule {
  private regexValidator = {
    email: /[a-zA-Z0-9_-]+@(vku.udn.vn|gmail.com)/,
    phone: /(0|84)[0-9]{9}/,
  };
  isPhoneNumber(phone: string): boolean {
    return this.regexValidator.phone.test(phone);
  }
  isEmail(email: string): boolean {
    return this.regexValidator.email.test(email);
  }
}
export const ValidatorCustomModule: IValidatorModule = new ValidatorModule();
