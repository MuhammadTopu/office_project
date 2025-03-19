/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constans';  // Make sure to update this with your actual constants import

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard running...');
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('No token found in the request');
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,  // Ensure the secret key is correct
      });

      // console.log('JWT payload verified:', payload);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log('Error verifying token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader);  // Log the authorization header

    if (!authHeader) {
      console.log('Authorization header is missing');
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      console.log('Token type is incorrect or token is missing');
      throw new UnauthorizedException('Bearer token is malformed');
    }

    return token;
  }
}
