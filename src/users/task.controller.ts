/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task-dto';
import { AuthGuard } from './auth.guard';
import { AuthenticatedRequest } from './express-request';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/create')
  async createTask(@Request() req: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.id, dto);
  }

  @Get('/all')
  async getTasks(@Request() req: AuthenticatedRequest) {
    return this.tasksService.getTasks(req.user.id);
  }

  @Delete('/delete/:id')
  async deleteTask(@Request() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId, req.user.id);
  }

  @Put('/update/:id')
  async updateTask(@Request() req: AuthenticatedRequest, @Param('id') taskId: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(taskId, dto);
  }

  @Get('/important')
  async getImportantTasks(@Request() req: AuthenticatedRequest) {
    return this.tasksService.getImportantTasks(req.user.id);
  }

  @Get('/completed')
  async getCompletedTasks(@Request() req: AuthenticatedRequest) {
    return this.tasksService.getCompletedTasks(req.user.id);
  }

  @Get('/incompleted')
  async getIncompletedTasks(@Request() req: AuthenticatedRequest) {
    return this.tasksService.getIncompletedTasks(req.user.id);
  }


  @Put('/updateImportant/:id')
  async updateImportant(@Request() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.updateImportantStatus(taskId, req.user.id);
  }

  @Put('/updateComplete/:id')
  async updateComplete(@Request() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.updateCompleteStatus(taskId, req.user.id);
  }

  @Put('/updateIncomplete/:id')
  async updateIncomplete(@Request() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.updateIncompleteStatus(taskId, req.user.id);
  }
}
