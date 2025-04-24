import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers['x-auth-token'] as string;

      if (
        !token &&
        (req.originalUrl.includes('login') ||
          req.originalUrl.includes('register'))
      ) {
        this.logger.debug('Нет токена в запросе, пропускаем middleware');
        return next();
      }

      const decoded = this.jwtService.verify<{ userId: string; email: string }>(
        token,
      );

      if (!decoded.userId || !decoded.email) {
        this.logger.warn('Ошибка в токене, запрос заблокирован');
        throw new UnauthorizedException('Неверный токен');
      }

      const user = await this.userModel.findById(decoded.userId);
      if (!user || user.token !== token) {
        this.logger.warn('Пользователь не найден или токен устарел');
        throw new UnauthorizedException('Неверный токен');
      }

      // const newToken = this.jwtService.sign({
      //   userId: user._id,
      //   email: user.email,
      // });
      // // await this.userModel.updateOne({ _id: user._id }, { token: newToken });

      // // this.logger.log(`Обновленный токен для ${user.email}`);

      // res.setHeader('X-Auth-Token', newToken);
      req.user = user; // Прокидываем пользователя дальше

      next();
    } catch (error) {
      this.logger.error(
        `Ошибка обновления токена: ${error instanceof Error ? error.message : error}`,
      );
      throw new UnauthorizedException('Ошибка авторизации');
    }
  }
}
