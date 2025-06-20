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
import * as crypto from 'crypto';

export interface ITelegramCallback {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: string;
  hash: string;
}

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

  public async generateToken(user: User) {
    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    await this.userModel.updateOne({ _id: user._id }, { token });
    this.logger.log(`Токен сгенерирован для пользователя ${user.email}`);

    return { token };
  }

  public async telegramLogin(data: ITelegramCallback) {
    const { hash, ...userData } = data;
    const checkString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const secret = crypto
      .createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest();

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(checkString)
      .digest('hex');

    if (hmac !== hash) {
      this.logger.warn('Невалидный Telegram hash');
      return null;
    }

    let user = await this.userModel.findOne({ telegramId: userData.id });

    if (!user) {
      user = await this.userModel.create({
        telegramId: userData.id,
        name: userData.first_name,
        email: `default-${userData.id}@travelapp.com`,
        password: crypto.randomBytes(8).toString('hex'), // пароль не используется
      });
      this.logger.log(`Создан новый пользователь через Telegram: ${user.name}`);
    }

    const token = await this.generateToken(user);
    return { ...token, user };
  }
}
