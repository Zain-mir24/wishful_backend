import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const {
      username,
      password,
      email,
      phone_no,
      accessToken,
      refreshToken,
      role,
    } = createUserDto;

    const checkEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    let userData = checkEmail;
    console.log(checkEmail);
    console.log(username, email);
    if (username === '' || password === '' || email === '') {
      throw new Error('Empty values are not accepted');
    }
    if (checkEmail && checkEmail.verified) {
      throw new Error('User email already exist');
    } else if (checkEmail && !checkEmail.verified) {
      userData.accessToken = accessToken;

      userData.refreshToken = refreshToken;

      await this.userRepository.update(checkEmail.id, userData);
      console.log('HERER');
      return checkEmail;
    } else {
      console.log('ELSE HERE');
      const salt = await bcrypt.genSalt();

      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User();

      user.username = username;

      user.password = hashedPassword;

      user.email = email;

      user.phone_no = phone_no;

      user.verified = false;

      user.accessToken = accessToken;

      user.refreshToken = refreshToken;

      user.role = role;
      const myUser = await this.userRepository.save(user);

      return myUser;
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  // Getting user detail
  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const objectToRemove = await this.userRepository.findOne({
      where: { id: id },
    });
    if (objectToRemove) {
      await this.userRepository.remove(objectToRemove);
      return 'deleted';
    } else {
      // Handle the case where the object doesn't exist.
      throw new NotFoundException('Object not found');
    }
  }
}
