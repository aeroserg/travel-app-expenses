import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';
import { User } from '../users/user.schema';

@Injectable()
export class DebtsService {
  private readonly logger = new Logger(DebtsService.name);

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async calculateDebts(groupId: string) {
    const group = await this.groupModel
      .findById(groupId)
      .populate({ path: 'members', model: User.name, select: 'name' })
      .lean()
      .exec();

    if (!group) throw new NotFoundException('Группа не найдена');

    const expenses = await this.expenseModel
      .find({ groupId: new Types.ObjectId(groupId) }) // Теперь ищем правильно
      .populate({ path: 'paidBy', model: User.name, select: 'name' })
      .populate({ path: 'debtors', model: User.name, select: 'name' })
      .lean()
      .exec();

    if (expenses.length === 0) {
      this.logger.warn(`⚠️ В группе ${group.name} нет расходов`);
      return [];
    }

    this.logger.debug(
      `💰 Найдено ${expenses.length} трат в группе ${group.name}`,
    );

    // Структура для учета долгов по валютам
    const debts: Record<string, Record<string, Record<string, number>>> = {};

    expenses.forEach((expense) => {
      const { currency, amount, paidBy, debtors } = expense;
      const totalDebtors = debtors.length;

      if (!paidBy || totalDebtors === 0) return;

      const paidById = paidBy._id.toString();
      const share = amount / totalDebtors;

      debtors.forEach((debtor) => {
        const debtorId = debtor._id.toString();
        if (debtorId === paidById) return;

        // Инициализируем объекты для хранения долгов
        if (!debts[debtorId]) debts[debtorId] = {};
        if (!debts[debtorId][paidById]) debts[debtorId][paidById] = {};
        if (!debts[paidById]) debts[paidById] = {};
        if (!debts[paidById][debtorId]) debts[paidById][debtorId] = {};

        // Записываем долг с учетом валюты
        debts[debtorId][paidById][currency] =
          (debts[debtorId][paidById][currency] || 0) + share;
        debts[paidById][debtorId][currency] =
          (debts[paidById][debtorId][currency] || 0) - share;
      });
    });

    // Функция для получения имени пользователя
    const getUserName = (userId: string): string => {
      const user = group.members.find((m) => m._id.toString() === userId);
      return (user as unknown as { name: string })?.name ?? 'Неизвестный';
    };

    // Формируем массив долгов с учетом валют
    const finalDebts = Object.entries(debts).flatMap(([fromId, toList]) =>
      Object.entries(toList).flatMap(([toId, currencyDebts]) =>
        Object.entries(currencyDebts)
          .filter(([, amount]) => amount > 0) // Убираем нулевые долги
          .map(([currency, amount]) => ({
            from: { _id: fromId, name: getUserName(fromId) },
            to: { _id: toId, name: getUserName(toId) },
            amount: Math.round(amount * 100) / 100, // Округляем
            currency,
          })),
      ),
    );

    this.logger.log(`📊 Итоговые долги в группе ${group.name}:`, finalDebts);
    return finalDebts;
  }
}
