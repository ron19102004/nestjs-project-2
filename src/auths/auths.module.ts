import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UserModule } from 'src/modules';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthsGuard } from './auths.guard';
import { TelebotModule } from 'src/modules/telebot/telebot.module';

@Module({
  controllers: [AuthsController],
  providers: [AuthsService, AuthsGuard],
  imports: [
    TelebotModule,
    ConfigModule,
    UserModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthsModule {}
