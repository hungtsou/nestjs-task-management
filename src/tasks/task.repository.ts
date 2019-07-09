import { Repository, EntityRepository } from 'typeorm'
import { TaskEntity } from './task.entity'
import CreateTaskDto from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UserEntity } from '../auth/user.entity'

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
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

    const tasks = await query.getMany()

    return tasks
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
