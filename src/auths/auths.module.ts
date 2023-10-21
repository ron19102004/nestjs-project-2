import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UserModule } from 'src/modules';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthsGuard } from './auths.guard';

@Module({
  controllers: [AuthsController],
  providers: [AuthsService, AuthsGuard],
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthsModule {}
