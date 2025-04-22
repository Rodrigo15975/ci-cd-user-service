import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoadSecrets } from './config/load'
import './config/load'

LoadSecrets()
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 5000)
}
void bootstrap()
