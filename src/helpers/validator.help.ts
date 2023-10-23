/* eslint-disable prettier/prettier */

export interface IValidatorModule {
  isEmail(email: string): boolean;
  isPhoneNumber(phone: string): boolean;
  isUrl(url: string): boolean;
}
export class ValidatorModule implements IValidatorModule {
  private regexValidator = {
    email: /[a-zA-Z0-9_-]+@(vku.udn.vn|gmail.com)/,
    phone: /(0|84)[0-9]{9}/,
    url:/^(ftp|http|https):\/\/[^ "]+$/,
  };
  isPhoneNumber(phone: string): boolean {
    return this.regexValidator.phone.test(phone);
  }
  isEmail(email: string): boolean {
    return this.regexValidator.email.test(email);
  }
  isUrl(url: string): boolean {
    return this.regexValidator.url.test(url);
  }
}
export const ValidatorCustomModule: IValidatorModule = new ValidatorModule();
