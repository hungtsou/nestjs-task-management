import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { TaskStatus } from './task-status.enum'

@Entity()
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: TaskStatus
}
