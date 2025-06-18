import { Test, TestingModule } from '@nestjs/testing';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}
describe('DebtsController', () => {
  let controller: DebtsController;
  let calculateDebtsMock: jest.Mock;

  beforeEach(async () => {
    calculateDebtsMock = jest
      .fn()
      .mockResolvedValue([{ user: 'A', amount: 100 }]);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtsController],
      providers: [
        {
          provide: DebtsService,
          useValue: {
            calculateDebts: calculateDebtsMock,
          },
        },
        { provide: getModelToken(Expense.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(Group.name), useValue: {} },
        { provide: JwtService, useValue: {} },
        {
          provide: 'AuthGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    }).compile();

    controller = module.get<DebtsController>(DebtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user debts and call service with correct groupId', async () => {
    const req = {
      user: {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    } as unknown as AuthenticatedRequest;

    const result = await controller.getUserDebts(req, 'group123');

    expect(calculateDebtsMock).toHaveBeenCalledWith('group123');
    expect(result).toEqual([{ user: 'A', amount: 100 }]);
  });

  it('should throw if user is not authenticated', async () => {
    const req = {} as unknown as AuthenticatedRequest;

    await expect(controller.getUserDebts(req, 'group123')).rejects.toThrow(
      'Ошибка аутентификации',
    );
  });
});
