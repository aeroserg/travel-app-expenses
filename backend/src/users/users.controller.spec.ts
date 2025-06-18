import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest, UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Document } from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    _id: 'user-id-123',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockRequest = {
    user: mockUser,
  } as unknown as Request & { user: typeof mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const result = controller.getProfile(mockRequest);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user name', async () => {
      const updatedUser = {
        _id: mockUser._id,
        name: 'Updated Name',
        email: mockUser.email,
        __v: 0,
        // eslint-disable-next-line
      } as unknown as Document<unknown, {}, User> &
        User &
        Required<{ _id: unknown }> & { __v: number };

      const updateUserSpy = jest
        .spyOn(usersService, 'updateUser')
        .mockResolvedValue({ message: 'Имя обновлено', user: updatedUser });

      const result = await controller.updateProfile(mockRequest, {
        name: 'Updated Name',
      });

      expect(updateUserSpy).toHaveBeenCalledWith(mockUser._id, 'Updated Name');
      expect(result).toEqual({ message: 'Имя обновлено', user: updatedUser });
    });

    it('should throw if name is missing', async () => {
      await expect(
        controller.updateProfile(mockRequest, {} as any),
      ).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    it('should throw if user not found in request', () => {
      const requestWithoutUser: AuthenticatedRequest = {
        user: undefined,
        headers: {},
        body: {},
        query: {},
        params: {},
        get: () => '',
      } as unknown as AuthenticatedRequest;
      requestWithoutUser.user = undefined;
      expect(() => controller.getProfile(requestWithoutUser)).toThrow(
        'Не удалось получить профиль',
      );
    });
  });

  describe('updateProfile', () => {
    it('should throw if user not found in request', async () => {
      const requestWithoutUser: AuthenticatedRequest = {
        user: undefined,
        headers: {},
        body: {},
        query: {},
        params: {},
        get: () => '',
      } as unknown as AuthenticatedRequest;
      requestWithoutUser.user = undefined;
      await expect(
        controller.updateProfile(requestWithoutUser, { name: 'New Name' }),
      ).rejects.toThrow('Ошибка аутентификации');
    });

    it('should throw if name is missing', async () => {
      const body = {};
      await expect(
        controller.updateProfile(mockRequest, body as { name?: string }),
      ).rejects.toThrow('Необходимо указать новое имя');
    });
  });

  describe('deleteProfile', () => {
    it('should throw if user not found in request', async () => {
      const requestWithoutUser: AuthenticatedRequest = {
        user: undefined,
        headers: {},
        body: {},
        query: {},
        params: {},
        get: () => '',
      } as unknown as AuthenticatedRequest;
      requestWithoutUser.user = undefined;
      await expect(
        controller.deleteProfile(requestWithoutUser),
      ).rejects.toThrow('Ошибка аутентификации');
    });
  });

  describe('deleteProfile', () => {
    it('should delete user profile', async () => {
      const deleteUserSpy = jest
        .spyOn(usersService, 'deleteUser')
        .mockResolvedValue({ message: 'Аккаунт удален' });

      const result = await controller.deleteProfile(mockRequest);

      expect(deleteUserSpy).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual({ message: 'Аккаунт удален' });
    });
  });
});
