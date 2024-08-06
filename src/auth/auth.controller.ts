import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  UseInterceptors,ClassSerializerInterceptor,
  HttpException,
  HttpCode
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { userDto } from './dto/user-login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Request,Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    readonly userService: UsersService,
  ) {}

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() registerUserDto: CreateUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @Get('sign-up/confirm')
  @HttpCode(200)
  async signUpConfirm(@Req() request: Request) {
    const token = request.headers.authorization;
    return this.authService.verify(token);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, description: 'Loggedin' })
  async create(@Body() userData: userDto) {
    try {
      const userLogin = await this.authService.login(userData);
      return userLogin;

    } catch (e) {
      throw new HttpException(e.response.error, e.response.status)
    }
  }

  @Get('/refresh')
  generateToken(@Req() request: Request) {
    const token = request.headers['refresh'];
    return this.authService.generateRefresh(token);
  }

  @Post("update-password")
  @ApiResponse({ status: HttpStatus.OK, description: 'Password updated'})
  updatePassword(@Req() request:Request){

  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
