import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserRepository } from './user.repository'
import { JwtPayload } from './jwt.payload.interface'
import { UnauthorizedException, Injectable } from '@nestjs/common'
import { UserEntity } from './user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '123queso'
    })
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { userName } = payload
    const user = await this.userRepository.findOne({ userName })

    if (!user) throw new UnauthorizedException()

    return user
  }
}
