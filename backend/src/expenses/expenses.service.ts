import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from './expense.schema';
import { Group } from '../groups/groups.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async getExpenses(groupId: Types.ObjectId) {
    groupId = new Types.ObjectId(groupId);
    const expenses = await this.expenseModel
      .find({ groupId })
      .populate({ path: 'paidBy', model: User.name, select: 'name' })
      .populate({ path: 'debtors', model: User.name, select: 'name' })
      .exec();
    return expenses;
  }

  async addExpense(
    userId: string,
    groupId: string,
    body: {
      name: string;
      amount: number;
      currency: 'RUB' | 'USD' | 'EUR';
      debtors: string[];
    },
  ) {
    console.log(1);
    const userObjectId = new Types.ObjectId(userId);
    console.log(2);
    const group = await this.groupModel.findById(groupId);
    console.log(3);
    if (!group) throw new NotFoundException('Группа не найдена');
    if (!group.members.some((member) => member.equals(userObjectId))) {
      throw new ForbiddenException('Вы не состоите в этой группе');
    }

    const debtorsObjectIds = body.debtors.map((id) => new Types.ObjectId(id));

    const expense = new this.expenseModel({
      groupId: new Types.ObjectId(groupId),
      name: body.name,
      amount: body.amount,
      currency: body.currency,
      paidBy: userObjectId,
      debtors: debtorsObjectIds,
    });

    await expense.save();
    return { message: 'Трата добавлена', expense };
  }

  async deleteExpense(userId: string, groupId: string, expenseId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const expense = await this.expenseModel.findById(expenseId);

    if (!expense) throw new NotFoundException('Трата не найдена');
    if (!expense.paidBy.equals(userObjectId)) {
      throw new ForbiddenException('Вы не можете удалить эту трату');
    }

    await expense.deleteOne();
    return { message: 'Трата удалена' };
  }
}
