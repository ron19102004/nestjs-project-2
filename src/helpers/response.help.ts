/* eslint-disable prettier/prettier */
export interface IResObj<Type> {
  success: boolean;
  data: Type;
  message: string;
  status: number;
}
export interface IResponseModule {
  ok(data: any, message: string): IResObj<any>;
  error(message: string, sstCode: number): IResObj<any>;
  warn(data: any, message: string, sttCode: number): IResObj<any>;
  forbidden(message: string): IResObj<any>;
}
export class ResponseModule implements IResponseModule {
  ok(data: any, message: string): IResObj<any> {
    return {
      data: data,
      message: message,
      status: 200,
      success: true,
    };
  }
  error(message: string, sttCode: number): IResObj<any> {
    return {
      data: null,
      message: message,
      status: sttCode,
      success: false,
    };
  }
  warn(data: any, message: string, sttCode: number): IResObj<any> {
    return {
      data: data,
      message: message,
      status: sttCode,
      success: true,
    };
  }
  forbidden(message: string): IResObj<any> {
    return {
      data: null,
      message: message,
      status: 403,
      success: false,
    };
  }
}
export const ResponseCustomModule: IResponseModule = new ResponseModule();
