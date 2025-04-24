// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Ошибка: Email ${email} уже зарегистрирован`);
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword });
    await user.save();

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    this.logger.log(`Попытка входа: ${email}`);

    const user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.warn(`Ошибка входа: Пользователь ${email} не найден`);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.logger.warn(`Ошибка входа: Неверный пароль для ${email}`);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    await this.userModel.updateOne({ _id: user._id }, { token });
    this.logger.log(`Токен сгенерирован для пользователя ${user.email}`);

    return { token };
  }
}
