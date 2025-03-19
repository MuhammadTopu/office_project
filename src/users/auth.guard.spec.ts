import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' }); // Create a mock JwtService
    authGuard = new AuthGuard(jwtService); // Pass it to AuthGuard
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
