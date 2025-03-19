/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { LoginDTO } from './login-dto';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  async create(
    @Body()
    createUserDTO: CreateUserDTO,
  ) {
    return await this.userService.signup(createUserDTO);
  }
  @Post('login')
  async login(
    @Body()
    loginDto: LoginDTO,
  ) {
    return await this.userService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  // eslint-disable-next-line @typescript-eslint/require-await
  async getprofile(@Request() req) {
    return req.user;
  }
}
