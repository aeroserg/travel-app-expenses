import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from './groups.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async getUserGroups(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    return this.groupModel.find({ members: userObjectId });
  }

  async createGroup(userId: string, name: string) {
    const userObjectId = new Types.ObjectId(userId);
    const code = Math.random().toString(36).substr(2, 8);

    const group = new this.groupModel({ name, code, members: [userObjectId] });
    await group.save();

    return { message: 'Группа создана', group };
  }

  async getGroupById(id: string): Promise<Group | null> {
    const res = await this.groupModel
      .findById(id)
      .populate({ path: 'members', model: User.name, select: 'name' })
      .exec();

    return res;
  }

  async joinGroup(userId: string, groupCode: string) {
    const userObjectId = new Types.ObjectId(userId);
    const group = await this.groupModel.findOne({ code: groupCode });
    if (!group) throw new NotFoundException('Группа не найдена');

    if (group.members.some((member) => member.equals(userObjectId))) {
      throw new ConflictException('Вы уже в этой группе');
    }

    group.members.push(userObjectId);
    await group.save();

    return { message: 'Вы присоединились к группе', group };
  }

  async leaveGroup(userId: string, groupId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Группа не найдена');

    group.members = group.members.filter(
      (member) => !member.equals(userObjectId),
    );

    if (group.members.length === 0) {
      await group.deleteOne();
      return {
        message: 'Группа удалена, так как в ней не осталось участников',
      };
    }

    await group.save();
    return { message: 'Вы покинули группу', group };
  }

  async updateGroupName(userId: string, groupId: string, newName: string) {
    const userObjectId = new Types.ObjectId(userId);
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Группа не найдена');

    if (!group.members.some((member) => member.equals(userObjectId))) {
      throw new ForbiddenException('Вы не являетесь участником этой группы');
    }

    group.name = newName;
    await group.save();

    return { message: 'Название группы обновлено', group };
  }

  async deleteGroup(userId: string, groupId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Группа не найдена');

    if (!group.members.some((member) => member.equals(userObjectId))) {
      throw new ForbiddenException('Вы не можете удалить эту группу');
    }

    await group.deleteOne();
    return { message: 'Группа удалена' };
  }
}
