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
let stripe = require('stripe')(process.env.STRIPE_KEY);
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
          from: process.env.MY_EMAIL, // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: `Yelo apna token{accessToken}`, // plaintext body
          html: `<a href="http://localhost:5173/signup-verify/${accessToken}/${refreshToken}">Click here to verify your account</a>`, // HTML body content
        })
        .then((r) => {
          console.log(r, 'SEND RESPONSE');
        })
        .catch((e) => {
          console.log(e, 'ERRRORR');
        });
      return {
        message: 'Check email to verify your signup',
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
      console.log(process.env.STRIPE_KEY);
      console.log(process.env.STRIPE_TEST_KEY);
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      const email = verify.user_email;
      let userData = await this.usersService.findByEmail(email);
      if(!!userData.verified)
         return {
        message:"user already verified",
        status:HttpStatus.CONFLICT
      }
      if (verify) {
        userData.verified = true;
        const customer = await stripe.customers.create({
          name: userData.username,
          email: email,
        });
        console.log(customer, "HERE IS THE CUSTOMER STRIPE ID")
        userData.customer_stripe_id = customer.id;
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
          userInfo: userData,
          status: HttpStatus.CREATED
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
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.verified) {
        throw new HttpException('User not verified', HttpStatus.NON_AUTHORITATIVE_INFORMATION);
      }

      const validate = await bcrypt.compare(userData.password, user.password);
      console.log("validate", validate);


      if (!validate) {
        throw new HttpException('Incorrect credentials', HttpStatus.UNAUTHORIZED);
      }

      const accessToken = jwt.sign(
        { userEmail: userData.email ,userId:user.id},
        process.env.SECRET_KEY,
        { expiresIn: '1d' },
      );
      const refreshToken = jwt.sign(
        { userEmail: userData.email,userId:user.id },
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: '1d' },
      );
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      await this.usersService.update(user.id, user);

      delete user.password;
      return {
        message: 'SUCCESSFULLY LOGGED IN',
        user: user,
        status: HttpStatus.OK
      };


    } catch (e) {
      throw new HttpException(
        {
          status: e.status||HttpStatus.BAD_REQUEST,
          error: e.message || e,
        },
        HttpStatus.BAD_REQUEST,
      );
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
