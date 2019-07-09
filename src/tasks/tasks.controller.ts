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
  ValidationPipe,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TaskStatus } from './task-status.enum'
import CreateTaskDto from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { TaskEntity } from './task.entity'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from '../auth/get-user.decorator'
import { UserEntity } from '../auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity[]> {
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserEntity
  ): Promise<any> {
    return this.tasksService.deleteTask(id, user)
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: UserEntity
  ): Promise<TaskEntity> {
    return this.tasksService.updateTaskStatus(id, status, user)
  }
}
