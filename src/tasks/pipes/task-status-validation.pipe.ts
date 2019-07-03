import {
  PipeTransform,
  Injectable,
  BadRequestException
} from '@nestjs/common'
import { TaskStatus } from '../task-status.enum'

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]
  transform(value: string) {
    value = value.toUpperCase()
    if (!this.validateStatus(value))
      throw new BadRequestException(`${value}: is an invalid status`)
    return value
  }

  validateStatus(status: any) {
    const indx = this.allowedStatuses.indexOf(status)
    return indx !== -1
  }
}
