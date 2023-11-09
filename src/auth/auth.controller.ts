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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { userDto } from './dto/user-login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';
import { ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    readonly userService: UsersService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() registerUserDto: CreateUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @Get('sign-up/confirm')
  async signUpConfirm(@Req() request: Request) {
    const token = request.headers.authorization;
    return this.authService.verify(token);
  }

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, description: 'Loggedin' })
  create(@Body() userData: userDto) {
    return this.authService.login(userData);
  }

  @Get('/refresh')
  generateToken(@Req() request: Request) {
    const token = request.headers['refresh'];
    return this.authService.generateRefresh(token);
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
