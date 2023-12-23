import { Module, MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './Products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailingService } from './mailing/mailing.service';
import { LoggerMiddleware } from './common/middleware/login.middleware';
import { RolesGuard } from './common/guard/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ ...typeOrmConfig, autoLoadEntities: true }),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: process.env.MY_EMAIL,
          pass: 'rxdj nweq qncm rzaf',
        },
      },
      defaults: {
        from: process.env.MY_EMAIL,
      },
    }), 
    MulterModule.register({
      dest: './assets', // Specify the destination folder
      limits: {
        files: 5, // Maximum number of files
      },
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    PaymentModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PaymentService, MailingService,  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.POST },
      );
  }
}
