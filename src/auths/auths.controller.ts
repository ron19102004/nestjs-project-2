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
import { RolesGuard } from 'src/guards/role.guard';
import { Public } from './decorators/public.decorator';
import { AuthsPayloads } from './gateways/auths-payload.gateway';

@ApiTags('auths')
@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}
  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authsService.signIn(signInDto);
  }
  @ApiBearerAuth()
  @Public()
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...data } = req.payload;
    const user = await this.authsService.getUserService().findById(data.id);
    return ResponseCustomModule.ok(
      AuthsPayloads[user.role].payload(user),
      'Referenced profile successfully retrieved',
    );
  }
}
