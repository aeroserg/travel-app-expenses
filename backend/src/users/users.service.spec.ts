import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: {
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  beforeEach(async () => {
    mockUserModel = {
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      const userId = new Types.ObjectId().toString();
      mockUserModel.findByIdAndUpdate.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        password: 'hashedpassword',
        token: null,
      });

      const result = await service.updateUser(userId, 'Updated Name');

      expect(result).toEqual({
        message: 'Имя обновлено',
        //eslint-disable-next-line
        user: expect.objectContaining({
          _id: userId,
          name: 'Updated Name',
        }),
      });
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { name: 'Updated Name' },
        { new: true },
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        service.updateUser('non-existent-id', 'Name'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return confirmation', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue({
        _id: 'some-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        token: null,
      });

      const result = await service.deleteUser('some-id');
      expect(result).toEqual({ message: 'Аккаунт удален' });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('some-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteUser('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
