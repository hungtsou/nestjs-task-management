import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

const PORT = 3000

async function bootstrap() {
  const logger = new Logger('boostrap')
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
  logger.log(`Listening to port: ${PORT}`)
}
bootstrap()
