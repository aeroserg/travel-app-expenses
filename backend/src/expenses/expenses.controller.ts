import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { ExpensesService } from './expenses.service';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

@Controller('groups/:groupId/expenses')
@UseGuards(AuthGuard) // Защищаем все маршруты
export class ExpensesController {
  private readonly logger = new Logger(ExpensesController.name);

  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getExpenses(
    @Req() req: AuthenticatedRequest,
    @Param('groupId') groupId: Types.ObjectId,
  ) {
    this.logger.log(
      `Запрос трат для группы ${JSON.stringify(groupId)} от ${req.user?.email}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.expensesService.getExpenses(groupId);
  }

  @Post()
  async addExpense(
    @Req() req: AuthenticatedRequest,
    @Param('groupId') groupId: string,
    @Body()
    body: {
      name: string;
      amount: number;
      currency: 'RUB' | 'USD' | 'EUR';
      debtors: string[];
    },
  ) {
    this.logger.log(
      `Добавление траты в группу ${groupId} от ${req.user?.email}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.expensesService.addExpense(req.user._id, groupId, body);
  }

  @Delete(':expenseId')
  async deleteExpense(
    @Req() req: AuthenticatedRequest,
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
  ) {
    this.logger.warn(
      `Удаление траты ${expenseId} из группы ${groupId} пользователем ${req.user?.email}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.expensesService.deleteExpense(req.user._id, groupId, expenseId);
  }
}
