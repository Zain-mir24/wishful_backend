import { Module } from '@nestjs/common';
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
@Module({
  imports: [
    ConfigModule.forRoot( ),
    TypeOrmModule.forRoot({...typeOrmConfig,
      autoLoadEntities: true,
    }),
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
      }
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    PaymentModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, PaymentService, MailingService],
})
export class AppModule {}
