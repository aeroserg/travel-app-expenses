import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { getModelToken } from '@nestjs/mongoose';
import { Group } from './groups.schema';
import { User } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

const mockUserId = new Types.ObjectId().toString();
const mockGroupId = new Types.ObjectId().toString();

const mockGroupsService = {
  getUserGroups: jest.fn().mockResolvedValue([]),
  getGroupById: jest
    .fn()
    .mockResolvedValue({ _id: mockGroupId, name: 'Test Group' }),
  createGroup: jest
    .fn()
    .mockResolvedValue({ message: 'Группа создана', group: {} }),
  updateGroupName: jest
    .fn()
    .mockResolvedValue({ message: 'Название группы обновлено', group: {} }),
  joinGroup: jest
    .fn()
    .mockResolvedValue({ message: 'Вы присоединились к группе', group: {} }),
  leaveGroup: jest
    .fn()
    .mockResolvedValue({ message: 'Вы покинули группу', group: {} }),
  deleteGroup: jest.fn().mockResolvedValue({ message: 'Группа удалена' }),
};

const mockRequest = {
  user: {
    _id: mockUserId,
    email: 'test@example.com',
  },
};

const mockBody = { name: 'New Group Name' };

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        { provide: GroupsService, useValue: mockGroupsService },
        { provide: getModelToken(Group.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        { provide: JwtService, useValue: {} },
        {
          provide: 'AuthGuard',
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user groups', async () => {
    const result = await controller.getUserGroups(mockRequest as any);
    expect(result).toEqual([]);
    expect(mockGroupsService.getUserGroups).toHaveBeenCalledWith(mockUserId);
  });

  it('should get group by id', async () => {
    const result = await controller.getGroupById(mockGroupId);
    expect(result).toEqual({ _id: mockGroupId, name: 'Test Group' });
    expect(mockGroupsService.getGroupById).toHaveBeenCalledWith(mockGroupId);
  });

  it('should create a group', async () => {
    const result = await controller.createGroup(mockRequest as any, mockBody);
    expect(result).toEqual({ message: 'Группа создана', group: {} });
    expect(mockGroupsService.createGroup).toHaveBeenCalledWith(
      mockUserId,
      mockBody.name,
    );
  });

  it('should update a group name', async () => {
    const result = await controller.updateGroup(
      mockRequest as any,
      mockGroupId,
      mockBody,
    );
    expect(result).toEqual({ message: 'Название группы обновлено', group: {} });
    expect(mockGroupsService.updateGroupName).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
      mockBody.name,
    );
  });

  it('should join a group', async () => {
    const result = await controller.joinGroup(mockRequest as any, mockGroupId);
    expect(result).toEqual({
      message: 'Вы присоединились к группе',
      group: {},
    });
    expect(mockGroupsService.joinGroup).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
    );
  });

  it('should leave a group', async () => {
    const result = await controller.leaveGroup(mockRequest as any, mockGroupId);
    expect(result).toEqual({ message: 'Вы покинули группу', group: {} });
    expect(mockGroupsService.leaveGroup).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
    );
  });

  it('should delete a group', async () => {
    const result = await controller.deleteGroup(
      mockRequest as any,
      mockGroupId,
    );
    expect(result).toEqual({ message: 'Группа удалена' });
    expect(mockGroupsService.deleteGroup).toHaveBeenCalledWith(
      mockUserId,
      mockGroupId,
    );
  });
});
