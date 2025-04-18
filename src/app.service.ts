import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class AppService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly prismaService: PrismaService,
  ) {}

  @RabbitRPC({
    exchange: 'user-exchange',
    routingKey: 'user.created',
  })
  async getHello(data: Record<string, string>) {
    Logger.debug({
      message: 'oki oki ',
      data,
    })
    const user = await this.prismaService.user.create({
      data: {
        email: 'Rodrigo@gmail.com',
        name: 'rodrigo',
      },
    })
    Logger.debug('Msg received from API Gateway')
    Logger.debug({
      user,
      data,
    })
    // await this.amqpConnection.publish('task-exchange', 'task.created', {
    //   message: 'From user-service',
    //   data: {
    //     user,
    //   },
    // })
  }
}
