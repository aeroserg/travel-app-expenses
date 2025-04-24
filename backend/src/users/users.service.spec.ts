import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findByIdAndUpdate: jest.fn().mockImplementation((id, update) => ({
              //eslint-disable-next-line
              _id: id,
              email: 'test@example.com',
              //eslint-disable-next-line
              name: update.name,
              password: 'hashedpassword',
              token: null,
            })),
            findByIdAndDelete: jest.fn().mockResolvedValue({
              _id: 'some-id',
              email: 'test@example.com',
              name: 'Test User',
              password: 'hashedpassword',
              token: null,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
