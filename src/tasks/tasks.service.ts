import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import CreateTaskDto from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskRepository } from './task.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { TaskEntity } from './task.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository
  ) {}

  getTasks(tasksFilterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(tasksFilterDto)
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const foundTask = await this.taskRepository.findOne(id)

    if (!foundTask) throw new NotFoundException(`Task with id: ${id} not found`)

    return foundTask
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto)
  }

  async deleteTask(id: number): Promise<any> {
    const deleteInfo = await this.taskRepository.delete(id)

    if (!deleteInfo.affected)
      throw new NotFoundException(`Task with id: ${id} not found`)

    return deleteInfo
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id)
    task.status = status
    await task.save()
    return task
  }
}
