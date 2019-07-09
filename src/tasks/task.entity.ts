import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm'
import { TaskStatus } from './task-status.enum'
import { UserEntity } from '../auth/user.entity'

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

  @ManyToOne(type => UserEntity, user => user.tasks, { eager: false })
  user: UserEntity

  @Column()
  userId: number
}
