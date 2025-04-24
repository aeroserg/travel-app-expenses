import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Logger,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { GroupsService } from './groups.service';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

@Controller('groups')
@UseGuards(AuthGuard) // Защищаем все маршруты
export class GroupsController {
  private readonly logger = new Logger(GroupsController.name);

  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getUserGroups(@Req() req: AuthenticatedRequest) {
    this.logger.log(`Запрос списка групп для пользователя: ${req.user?.email}`);

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.getUserGroups(req.user._id);
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    return this.groupsService.getGroupById(id);
  }

  @Post()
  async createGroup(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name: string },
  ) {
    this.logger.log(
      `Создание группы "${body.name}" пользователем: ${req.user?.email}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.createGroup(req.user._id, body.name);
  }

  @Patch(':id')
  async updateGroup(
    @Req() req: AuthenticatedRequest,
    @Param('id') groupId: string,
    @Body() body: { name: string },
  ) {
    this.logger.log(
      `Пользователь ${req.user?.email} обновляет название группы ${groupId} на "${body.name}"`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.updateGroupName(req.user._id, groupId, body.name);
  }

  @Post(':id/join')
  async joinGroup(
    @Req() req: AuthenticatedRequest,
    @Param('id') groupCode: string,
  ) {
    this.logger.log(
      `Пользователь ${req.user?.email} присоединяется к группе ${groupCode}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.joinGroup(req.user._id, groupCode);
  }

  @Post(':id/leave')
  async leaveGroup(
    @Req() req: AuthenticatedRequest,
    @Param('id') groupId: string,
  ) {
    this.logger.log(
      `Пользователь ${req.user?.email} выходит из группы ${groupId}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.leaveGroup(req.user._id, groupId);
  }

  @Delete(':id')
  async deleteGroup(
    @Req() req: AuthenticatedRequest,
    @Param('id') groupId: string,
  ) {
    this.logger.warn(
      `Пользователь ${req.user?.email} удаляет группу ${groupId}`,
    );

    if (!req.user) {
      throw new Error('Ошибка аутентификации');
    }

    return this.groupsService.deleteGroup(req.user._id, groupId);
  }
}
