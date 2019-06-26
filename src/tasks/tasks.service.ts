import { Injectable } from '@nestjs/common'
import { Task, TaskStatus } from './task.model'
import * as uuid from 'uuid/v1'
import CreateTaskDto from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id)
  }

  getFilterTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto
    return this.tasks.filter(
      task => task.status === status || task.title.includes(search)
    )
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }

    this.tasks.push(newTask)

    return newTask
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id != id)
  }

  updateTask(id: string, title: string, description: string): Task[] {
    const tasksCopy = [...this.tasks]
    const taskIndex = this.tasks.findIndex(task => task.id === id)

    tasksCopy[taskIndex] = {
      ...tasksCopy[taskIndex],
      title,
      description
    }

    this.tasks = tasksCopy

    return this.tasks
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id)
    task.status = status
    return task
  }
}
