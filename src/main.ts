import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import * as config from 'config'

async function bootstrap() {
  const serverConf = config.get('server')
  const PORT = process.env.PORT || serverConf.port
  const logger = new Logger('boostrap')
  const app = await NestFactory.create(AppModule)

  await app.listen(PORT)
  logger.log(`Listening to port: ${PORT}`)
}
bootstrap()
