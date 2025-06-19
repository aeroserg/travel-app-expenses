import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';
import { User } from '../users/user.schema';

interface LeanUser {
  _id: Types.ObjectId | string;
  name: string;
}

@Injectable()
export class DebtsService {
  private readonly logger = new Logger(DebtsService.name);

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async calculateDebts(groupId: string) {
    const group = await this.getGroup(groupId);
    const expenses = await this.getGroupExpenses(groupId, group.name);
    if (expenses.length === 0) return [];

    const debts = this.buildDebtMatrix(expenses);
    return this.formatFinalDebts(debts, group.members, group.name);
  }

  private async getGroup(groupId: string) {
    const group = await this.groupModel
      .findById(groupId)
      .populate({ path: 'members', model: User.name, select: 'name' })
      .lean()
      .exec();

    if (!group) throw new NotFoundException('Группа не найдена');
    return group;
  }

  private async getGroupExpenses(groupId: string, groupName: string) {
    const expenses = await this.expenseModel
      .find({ groupId: new Types.ObjectId(groupId) })
      .populate({ path: 'paidBy', model: User.name, select: 'name' })
      .populate({ path: 'debtors', model: User.name, select: 'name' })
      .lean()
      .exec();

    if (expenses.length === 0) {
      this.logger.warn(`⚠️ В группе ${groupName} нет расходов`);
    } else {
      this.logger.debug(
        `💰 Найдено ${expenses.length} трат в группе ${groupName}`,
      );
    }

    return expenses;
  }

  private buildDebtMatrix(expenses: Expense[]) {
    const debts: Record<string, Record<string, Record<string, number>>> = {};

    for (const expense of expenses) {
      const { currency, amount, paidBy, debtors } = expense;
      const totalDebtors = debtors.length;
      if (!paidBy || totalDebtors === 0) continue;

      const paidById = paidBy._id.toString();
      const share = amount / totalDebtors;

      for (const debtor of debtors) {
        const debtorId = debtor._id.toString();
        if (debtorId === paidById) continue;

        debts[debtorId] ??= {};
        debts[debtorId][paidById] ??= {};
        debts[paidById] ??= {};
        debts[paidById][debtorId] ??= {};

        debts[debtorId][paidById][currency] =
          (debts[debtorId][paidById][currency] ?? 0) + share;

        debts[paidById][debtorId][currency] =
          (debts[paidById][debtorId][currency] ?? 0) - share;
      }
    }

    return debts;
  }

  private formatFinalDebts(
    debts: Record<string, Record<string, Record<string, number>>>,
    members: any[],
    groupName: string,
  ) {
    const getUserName = (userId: string): string => {
      const user = (members as LeanUser[]).find(
        (m) => m._id.toString() === userId,
      );
      return user?.name ?? 'Неизвестный';
    };

    const finalDebts = Object.entries(debts).flatMap(([fromId, toList]) =>
      Object.entries(toList).flatMap(([toId, currencyDebts]) =>
        Object.entries(currencyDebts)
          .filter(([, amount]) => amount > 0)
          .map(([currency, amount]) => ({
            from: { _id: fromId, name: getUserName(fromId) },
            to: { _id: toId, name: getUserName(toId) },
            amount: Math.round(amount * 100) / 100,
            currency,
          })),
      ),
    );

    this.logger.log(`📊 Итоговые долги в группе ${groupName}:`, finalDebts);
    return finalDebts;
  }
}
