/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

class SwaggerConfigModule {
  public configure(app: INestApplication<any>, slugApi: string) {
    const config = new DocumentBuilder()
      .setTitle('TD Hospital Application API Documentation')
      .setDescription('TD Hospital Application API Documentation')
      .setVersion('1.0')
      .addTag('RON')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(slugApi, app, document);
  }
}
export const SwaggerConfig: SwaggerConfigModule = new SwaggerConfigModule();
