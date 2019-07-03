import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    await this.authService.signUp(authCredentialsDto)
    return { message: 'success' }
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    const userName = await this.authService.signIn(authCredentialsDto)

    if (!userName) throw new UnauthorizedException('Invalid credentials')

    return { message: 'success' }
  }
}
