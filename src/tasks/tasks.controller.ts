import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Task } from './task.model'
import { TasksService } from './tasks.service'
import { TaskStatus } from './task.model'
import CreateTaskDto from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    if (!Object.keys(filterDto).length) {
      return this.tasksService.getAllTasks()
    }

    return this.tasksService.getFilterTasks(filterDto)
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto)
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id)
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string
  ) {
    return this.tasksService.updateTask(id, title, description)
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Task {
    return this.tasksService.updateTaskStatus(id, status)
  }
}
