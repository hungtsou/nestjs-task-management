import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { TaskEntity } from '../tasks/task.entity'

@Entity()
@Unique(['userName'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string

  @Column()
  password: string

  @Column()
  salt: string

  @OneToMany(type => TaskEntity, task => task.user, { eager: true })
  tasks: TaskEntity[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return this.password === hash
  }
}
