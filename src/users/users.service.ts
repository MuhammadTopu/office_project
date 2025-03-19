/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO } from './create-user-dto';
import { signUpResponse } from './User';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './login-dto';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();
const saltRounds = 10;

@Injectable()
export class UsersService {
  prisma: PrismaClient;
  constructor(private readonly jwtService: JwtService) {}
  async signup(payload: CreateUserDTO): Promise<signUpResponse> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      } else {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        payload.password = hashedPassword;
        // Save the user into the database
        const user = await prisma.user.create({
          data: {
            email: payload.email,
            password: hashedPassword,
            name: payload.name, // Add the name property
          },
          select: { id: true, email: true, name: true },
        });
        // Return only id and email
        return {
          id: user.id,
          email: user.email,
        };
      }
    } catch (error) {
      throw new Error('Signup failed: ' + error.message);
    }
  }
  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await prisma.user.findUnique({
      where: {
        email: loginDTO.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatched = await this.decpass(loginDTO.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Invalid pass');
    }
    const token = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      { expiresIn: '1d' },
    );
    return { token };
  }
  async decpass(plaintext, hash) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await bcrypt.compare(plaintext, hash);
  }
}
