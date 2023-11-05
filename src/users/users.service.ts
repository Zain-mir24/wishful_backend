import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, email, phone_no, accessToken, refreshToken } =
      createUserDto;

    const checkEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    if (checkEmail) {
      return 'User email already exist';
    } else {
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

      const myUser = await this.userRepository.save(user);

      return myUser;
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return  this.userRepository.update(id,updateUserDto);;
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