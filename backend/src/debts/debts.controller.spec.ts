import { Test, TestingModule } from '@nestjs/testing';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';

describe('DebtsController', () => {
  let controller: DebtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtsController],
      providers: [
        DebtsService,
        {
          provide: getModelToken(Expense.name),
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
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
});
