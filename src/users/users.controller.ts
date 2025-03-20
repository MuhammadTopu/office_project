/* eslint-disable prettier/prettier */
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
 
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
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
  async getProfile(@Request() req) {
    const user = req.user; // Ensure the user object contains 'name', 'email', 'id'
    return {
      id: user.id, // Include id
      name: user.name, // Include name
      email: user.email, // Include email
    };
  }
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user; // Return the user data if found
    } catch (error) {
      // Log the error and throw a more informative response
      console.error(error);
      throw new HttpException(
        'An error occurred while fetching user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
