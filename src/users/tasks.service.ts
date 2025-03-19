import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task-dto';

@Injectable()
export class TasksService {
  private prisma = new PrismaClient();

  async createTask(userId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { Task: { connect: { id: task.id } } },
    });

    return task;
  }

  async getTasks(userId: string) {
    try {
      // Fetch tasks where userId matches and order them by creation date (descending)
      const tasks = await this.prisma.task.findMany({
        where: {
          userId, // Filter tasks by userId
        },
        orderBy: {
          createdAt: 'desc', // Sort tasks by creation date (most recent first)
        },
      });

      return tasks; // Return the list of tasks
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error fetching tasks');
    }
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.delete({ where: { id: taskId } });
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });
  }

  async getImportantTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, important: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompletedTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, complete: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getIncompletedTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId, complete: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}
