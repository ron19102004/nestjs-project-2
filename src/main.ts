import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerConfig } from './helpers/swagger.help';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT: number = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  SwaggerConfig.configure(app, 'api');
  await app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger configuration loaded on http://localhost:${PORT}/api`);
  });
}
bootstrap();
