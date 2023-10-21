/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from './auths.guard';
import { ResponseCustomModule } from 'src/helpers/response.help';

@ApiTags('auths')
@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}
  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authsService.signIn(signInDto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthsGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...data } = req.payload;
    return ResponseCustomModule.ok(data,'Referenced profile successfully retrieved');
  }
}
