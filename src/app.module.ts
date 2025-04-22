import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { PrismaModule } from 'nestjs-prisma'
import { ConfigModule, ConfigService } from '@nestjs/config'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        exchanges: [
          {
            name: 'user-exchange',
            type: 'direct',
          },
          {
            name: 'task-exchange',
            type: 'direct',
          },
        ],
        queues: [
          {
            name: 'task-queue',
          },
          {
            name: 'user-queue',
          },
        ],
        uri: ConfigService.getOrThrow<string>('RABBITMQ_URL'),
        connectionInitOptions: {
          wait: true,
          timeout: 5000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
