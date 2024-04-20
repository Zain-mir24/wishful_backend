import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { userDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Exception } from 'handlebars';
let stripe = require('stripe')(process.env.Stripe_Key);
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async signUp(userData: CreateUserDto) {
    try {
      let user = await this.usersService.findByEmail(userData.email);
      if(user&&!!user.verified){
        throw new Error("User already exists")
      }
      const accessToken = jwt.sign(
        { user_email: userData.email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );

      const refreshToken = jwt.sign(
        { user_email: userData.email },
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: '17h' },
      );

      userData.accessToken = accessToken;
      userData.refreshToken = refreshToken;

      await this.usersService.create(userData);

      await this.mailerService
        .sendMail({
          to: userData.email, // list of receivers
          from: 'zainnaeemk10@gmail.com', // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: `Yelo apna token{accessToken}`, // plaintext body
          html: `<a href="http://localhost:3000/signup-verify/${accessToken}/${refreshToken}">Click here to verify your account</a>`, // HTML body content
        })
        .then((r) => {
          console.log(r, 'SEND RESPONSE');
        })
        .catch((e) => {
          console.log(e, 'ERRRORR');
        });
      return {
        Message: 'Check email to verify your signup',
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message || e,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: e.message || e,
        },
      );
    }
  }

  async verify(token: string) {
    try {
      console.log(process.env.Stripe_Key);
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      if (verify) {
        const email = verify.user_email;
        let userData = await this.usersService.findByEmail(email);
        userData.verified = true;
        const customer = await stripe.customers.create({
          name: userData.username,
          email: email,
        });
        if (!customer) {
          throw new Error('Error adding user to stripe');
        }
        const update = await this.usersService.update(userData.id, userData);
        //create stripe user here

        if (!update) {
          throw new Error('Error updating data');
        }
        return {
          message: 'User Verified',
        };
      } else {
        throw new Exception('Token expireed');
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message || e,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: e.message || e,
        },
      );
    }
  }

  async login(userData: userDto) {
    try {
      let user = await this.usersService.findByEmail(userData.email);
      
      if (user && user.verified) {
        const validate = await bcrypt.compare(userData.password, user.password);
        console.log(validate);
        if (validate) {
          const accessToken = jwt.sign(
            { user_email: userData.email },
            process.env.SECRET_KEY,
            { expiresIn: '1d' },
          );
          const refreshToken = jwt.sign(
            { user_email: userData.email },
            process.env.SECRET_REFRESH_KEY,
            { expiresIn: '1d' },
          );
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;

          await this.usersService.update(user.id, user);

          delete user.password;
          return {
            MESSAGE: 'SUCCESSFULLY LOGGED IN',
            User: user,
          };
        } else {
          return 'INCORRECT CREDENTIAL';
        }
      }
      return 'USER NOT VERIFIED';
    } catch (e) {
      return 'INCORRECT CREDENTIAL';
    }
  }

  async generateRefresh(token) {
    try {
      const verify = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
      if (!verify) {
        return 'Login again:  Refresh token expired';
      }
      const email = verify.user_email;
      let userData = await this.usersService.findByEmail(email);
      const accessToken = jwt.sign(
        { user_email: userData.email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );
      userData.accessToken = accessToken;
      await this.usersService.update(userData.id, userData);
      return accessToken;
    } catch (e) {
      return e;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: number) {
    return this.usersService.remove(id);
  }
}
