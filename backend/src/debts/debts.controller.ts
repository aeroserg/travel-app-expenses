import { Controller, Get, UseGuards, Req, Param, Logger } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { DebtsService } from './debts.service';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

@Controller('groups/:groupId/debts')
@UseGuards(AuthGuard)
export class DebtsController {
  private readonly logger = new Logger(DebtsController.name);

  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  async getUserDebts(
    @Req() req: AuthenticatedRequest,
    @Param('groupId') groupId: string,
  ) {
    this.logger.log(
      `Запрос долгов для группы ${groupId} от ${req.user?.email}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.debtsService.calculateDebts(groupId);
  }
}
