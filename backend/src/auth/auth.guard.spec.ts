import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { Logger } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let userModel: jest.Mocked<Model<User>>;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    jwtService = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    userModel = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Model<User>>;

    authGuard = new AuthGuard(jwtService, userModel);
  });

  const mockContext = (
    headers: Record<string, string | undefined>,
    ip = '127.0.0.1',
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
          ip,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should throw UnauthorizedException if token is missing', async () => {
    const context = mockContext({});
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = mockContext({ 'x-auth-token': 'invalid-token' });
    (jwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const context = mockContext({ 'x-auth-token': 'valid-token' });
    (jwtService.verify as jest.Mock).mockReturnValue({
      userId: '123',
      email: 'test@example.com',
    });
    userModel.findOne.mockResolvedValue(null);

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should authorize and attach user if token and user are valid', async () => {
    const context = mockContext({ 'x-auth-token': 'valid-token' });
    const mockUser = { _id: '123', email: 'test@example.com' };
    (jwtService.verify as jest.Mock).mockReturnValue({
      userId: '123',
      email: 'test@example.com',
    });
    userModel.findOne.mockResolvedValue(mockUser);

    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
