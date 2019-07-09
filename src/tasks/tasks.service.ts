import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import CreateTaskDto from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskRepository } from './task.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { TaskEntity } from './task.entity'
import { UserEntity } from '../auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getTasks(
    tasksFilterDto: GetTasksFilterDto,
    user: UserEntity
  ): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(tasksFilterDto, user)
  }

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, userId: user.id }
    })

    if (!foundTask) throw new NotFoundException(`Task with id: ${id} not found`)

    return foundTask
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity
  ): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async deleteTask(id: number, user: UserEntity): Promise<any> {
    const deleteInfo = await this.taskRepository.delete({
      id: id.toString(),
      userId: user.id
    })

    if (!deleteInfo.affected)
      throw new NotFoundException(`Task with id: ${id} not found`)

    return deleteInfo
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: UserEntity
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user)
    task.status = status
    await task.save()
    return task
  }
}
