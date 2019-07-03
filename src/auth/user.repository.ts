import { Repository, EntityRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UserEntity } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { userName, password } = authCredentialsDto
    const user = new UserEntity()
    const salt = await bcrypt.genSalt()
    user.userName = userName
    user.salt = salt
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save()
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('User already exists')
      else throw new InternalServerErrorException()
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<string> {
    const { userName, password } = authCredentialsDto
    const user = await this.findOne({ userName })

    if (user && (await user.validatePassword(password))) return userName
    else return null
  }
}
