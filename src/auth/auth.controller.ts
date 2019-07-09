import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from './get-user.decorator'
import { UserEntity } from './user.entity'

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
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto)
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: UserEntity) {
    return console.log(user)
  }
}
