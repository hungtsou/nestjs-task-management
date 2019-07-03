import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  userName: string

  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, {
    message: 'Password too weak'
  })
  password: string
}
