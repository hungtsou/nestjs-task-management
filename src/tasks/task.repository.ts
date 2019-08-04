import { Repository, EntityRepository } from 'typeorm'
import { TaskEntity } from './task.entity'
import CreateTaskDto from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UserEntity } from '../auth/user.entity'
import { Logger, InternalServerErrorException } from '@nestjs/common'

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  private logger = new Logger('TaskRepository')

  async getTasks(
    tasksFilterDto: GetTasksFilterDto,
    user: UserEntity
  ): Promise<TaskEntity[]> {
    const { status, search } = tasksFilterDto

    const query = this.createQueryBuilder('task')

    query.where('task.userId = :userId', { userId: user.id })

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` }
      )
    }

    try {
      const tasks = await query.getMany()
      return tasks
    } catch (error) {
      this.logger.error(
        `Failed to get all tasks for user "${
          user.userName
        }". Filters: ${JSON.stringify(tasksFilterDto)}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto
    const newTask = new TaskEntity()

    newTask.title = title
    newTask.description = description
    newTask.status = TaskStatus.OPEN
    newTask.user = user

    await newTask.save()

    delete newTask.user
    return newTask
  }
}
