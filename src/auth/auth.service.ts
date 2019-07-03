import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtPayload } from './jwt-payload.interface'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const userName = await this.userRepository.validateUserPassword(
      authCredentialsDto
    )

    if (!userName) throw new UnauthorizedException('Invalid credentials')

    const payload: JwtPayload = { userName }

    const accessToken = await this.jwtService.sign(payload)

    return { accessToken }
  }
}
