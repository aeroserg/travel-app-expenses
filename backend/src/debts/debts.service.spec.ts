import { Test, TestingModule } from '@nestjs/testing';
import { DebtsService } from './debts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';

describe('DebtsService', () => {
  let service: DebtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtsService,
        {
          provide: getModelToken(Expense.name),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(Group.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DebtsService>(DebtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
