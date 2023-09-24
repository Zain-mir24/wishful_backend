import { Controller, Get, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/users')
  sayHello():string{
    return this.appService.getHello()
  }
}
