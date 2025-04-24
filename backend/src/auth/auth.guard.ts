// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';
import { config } from 'dotenv';
config();

interface AuthenticatedRequest extends Request {
  user?: User;
  newToken?: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers['x-auth-token'] as string;
    const ip =
      request.ip || request.headers['x-forwarded-for'] || 'неизвестный';

    this.logger.debug(`🚀 Новый запрос на авторизацию с IP: ${ip as string}`);
    this.logger.debug(
      `🔍 Заголовки запроса: ${JSON.stringify(request.headers)}`,
    );

    if (!token) {
      this.logger.warn('❌ Отсутствует токен, доступ запрещен');
      throw new UnauthorizedException('Требуется аутентификация');
    }

    this.logger.debug(`🔑 Входящий токен: ${token}`);

    try {
      const decoded = this.jwtService.verify<DecodedToken>(token);

      this.logger.debug(`🔓 Расшифрованный токен: ${JSON.stringify(decoded)}`);

      if (!decoded.userId || !decoded.email) {
        this.logger.warn('⚠️ Ошибка в токене: отсутствуют userId или email');
        throw new UnauthorizedException('Неверный токен');
      }

      const user = await this.userModel.findOne({ _id: decoded.userId });
      this.logger.debug(`Пользователь: ${JSON.stringify(user)} `);
      if (!user) {
        this.logger.warn(
          `❌ Пользователь с ID ${decoded.userId} не найден или токен не совпадает`,
        );
        throw new UnauthorizedException('Неверный токен');
      }

      this.logger.log(`✅ Пользователь ${user.email} успешно авторизован`);

      request.user = user;

      return true;
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      this.logger.error(
        `🛑 Ошибка авторизации: ${errMessage}`,
        error instanceof Error ? error.stack : '',
      );
      throw new UnauthorizedException('Ошибка авторизации');
    }
  }
}
