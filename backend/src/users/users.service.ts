import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(userId: string, newName: string) {
    this.logger.log(`Изменение имени пользователя ${userId} на "${newName}"`);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { name: newName },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { message: 'Имя обновлено', user: updatedUser };
  }

  async deleteUser(userId: string) {
    this.logger.warn(`Удаление пользователя ${userId}`);

    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { message: 'Аккаунт удален' };
  }
}
