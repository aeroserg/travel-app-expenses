import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

@Controller('users')
@UseGuards(AuthGuard) // Защищаем все маршруты
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    this.logger.log(`Запрос профиля: ${req.user?.email}`);

    if (!req.user) {
      this.logger.warn('Ошибка: пользователь не найден в запросе');
      throw new BadRequestException('Не удалось получить профиль');
    }

    return req.user;
  }

  @Put('me')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name?: string },
  ) {
    this.logger.log(`Обновление профиля пользователя: ${req.user?.email}`);

    if (!req.user) {
      this.logger.warn('Ошибка: пользователь не найден в запросе');
      throw new BadRequestException('Ошибка аутентификации');
    }

    if (!body.name) {
      throw new BadRequestException('Необходимо указать новое имя');
    }

    return this.usersService.updateUser(req.user._id, body.name);
  }

  @Delete('me')
  async deleteProfile(@Req() req: AuthenticatedRequest) {
    this.logger.warn(`Удаление аккаунта: ${req.user?.email}`);

    if (!req.user) {
      this.logger.warn('Ошибка: пользователь не найден в запросе');
      throw new BadRequestException('Ошибка аутентификации');
    }

    return this.usersService.deleteUser(req.user._id);
  }
}
