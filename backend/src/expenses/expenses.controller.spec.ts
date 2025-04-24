import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from './expense.schema';
import { Group } from '../groups/groups.schema';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.schema';

describe('ExpensesController', () => {
  let controller: ExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expense.name),
          useValue: {},
        },
        {
          provide: getModelToken(Group.name),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: 'AuthGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
