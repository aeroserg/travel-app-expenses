import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtHelperService {
  private readonly secret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET') ?? '';
    if (!this.secret) {
      throw new Error('JWT_SECRET не найден в .env');
    }
  }

  verifyToken(token: string): DecodedToken {
    try {
      const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;
      if (!decoded?.userId || !decoded?.email) {
        throw new UnauthorizedException('Неверный токен');
      }
      return { userId: String(decoded.userId), email: String(decoded.email) };
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка верификации токена:', err);
      throw new UnauthorizedException('Ошибка верификации токена');
    }
  }

  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, this.secret, { expiresIn: '24h' });
  }
}
