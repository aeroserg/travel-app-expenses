import { Test, TestingModule } from '@nestjs/testing';
import { DebtsService } from './debts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from '../expenses/expense.schema';
import { Group } from '../groups/groups.schema';
import { NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';

describe('DebtsService', () => {
  let service: DebtsService;

  let groupModelMock: Partial<Record<keyof Model<Group>, jest.Mock>>;
  let expenseModelMock: Partial<Record<keyof Model<Expense>, jest.Mock>>;

  const validGroupId = '507f191e810c19729de860ea';

  beforeEach(async () => {
    groupModelMock = {
      findById: jest.fn(),
    };

    expenseModelMock = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtsService,
        { provide: getModelToken(Expense.name), useValue: expenseModelMock },
        { provide: getModelToken(Group.name), useValue: groupModelMock },
      ],
    }).compile();

    service = module.get<DebtsService>(DebtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty array and warn if no expenses', async () => {
    const mockGroup = {
      _id: validGroupId,
      name: 'Test Group',
      members: [],
    };

    groupModelMock.findById!.mockReturnValue({
      populate: () => ({
        lean: () => ({
          exec: () => mockGroup,
        }),
      }),
    });

    expenseModelMock.find!.mockReturnValue({
      populate: () => ({
        populate: () => ({
          lean: () => ({
            exec: () => [],
          }),
        }),
      }),
    });

    const result = await service.calculateDebts(validGroupId);
    expect(result).toEqual([]);
  });

  it('should calculate debts correctly', async () => {
    const mockGroup = {
      _id: validGroupId,
      name: 'Test Group',
      members: [
        { _id: new Types.ObjectId('507f1f77bcf86cd799439011'), name: 'Alice' },
        { _id: new Types.ObjectId('507f1f77bcf86cd799439012'), name: 'Bob' },
      ],
    };

    const expenses = [
      {
        currency: 'USD',
        amount: 100,
        paidBy: {
          _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
          name: 'Alice',
        },
        debtors: [
          {
            _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
            name: 'Alice',
          },
          { _id: new Types.ObjectId('507f1f77bcf86cd799439012'), name: 'Bob' },
        ],
      },
    ];

    groupModelMock.findById!.mockReturnValue({
      populate: () => ({
        lean: () => ({
          exec: () => mockGroup,
        }),
      }),
    });

    expenseModelMock.find!.mockReturnValue({
      populate: () => ({
        populate: () => ({
          lean: () => ({
            exec: () => expenses,
          }),
        }),
      }),
    });

    const result = await service.calculateDebts(validGroupId);

    expect(result).toEqual([
      {
        from: {
          _id: '507f1f77bcf86cd799439012',
          name: 'Bob',
        },
        to: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Alice',
        },
        amount: 50,
        currency: 'USD',
      },
    ]);
  });

  it('should throw if group not found', async () => {
    groupModelMock.findById!.mockReturnValue({
      populate: () => ({
        lean: () => ({
          exec: () => null,
        }),
      }),
    });

    await expect(service.calculateDebts(validGroupId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
