// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService, ITelegramCallback } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  async telegramLogin(@Body() payload: ITelegramCallback) {
    const result = await this.authService.telegramLogin(payload);
    if (!result) throw new UnauthorizedException('Invalid Telegram login');
    return result;
  }

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    this.logger.log(`Регистрация пользователя: ${body.email}`);

    if (!body.name || !body.email || !body.password) {
      this.logger.warn('Ошибка регистрации: отсутствуют обязательные поля');
      throw new BadRequestException('Все поля обязательны');
    }

    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    this.logger.log(`Попытка входа: ${body.email}`);

    if (!body.email || !body.password) {
      this.logger.warn('Ошибка входа: отсутствуют email или пароль');
      throw new BadRequestException('Email и пароль обязательны');
    }

    return this.authService.login(body.email, body.password);
  }
}
