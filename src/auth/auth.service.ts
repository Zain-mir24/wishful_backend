import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { userDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async signUp(userData) {
    const accessToken = jwt.sign(
      { user_email: userData.email },
      'your-secret-key',
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      { user_email: userData.email },
      'your-secret-refresh-key',
      { expiresIn: '17h' },
    );

    userData.accessToken = accessToken;
    userData.refreshToken = refreshToken;

    const getUser = await this.usersService.create(userData);

    if (getUser !== 'User email already exist') {
      await this.mailerService
        .sendMail({
          to: 'zainmir1000@gmail.com', // list of receivers
          from: 'zainnaeemk10@gmail.com', // sender address
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: `Yelo apna toeken{accessToken}`, // plaintext body
          html: `<b>Yelo apna token ${accessToken}</b>`, // HTML body content
        })
        .then((r) => {
          console.log(r, 'SEND RESPONSE');
        })
        .catch((e) => {
          console.log(e, 'ERRRORR');
        });
      return {
        Message: 'Check email to verify your signup',
        accessToken,
        refreshToken,
      };
    }
    return getUser;
  }

  async verify(token: string) {
    try {
      const verify = jwt.verify(token, process.env.SECRET_KEY);
      if (verify) {
        const email = verify.user_email;
        let userData = await this.usersService.findByEmail(email);
        userData.verified = true;
        const update = await this.usersService.update(userData.id, userData);
        return update;
      } else {
        return 'Token expireed';
      }
    } catch (e) {
      return e;
    }
  }

  async login(userData: userDto) {
    try {
      let user = await this.usersService.findByEmail(userData.email);
      if (user) {
        const validate = await bcrypt.compare(userData.password, user.password);
        console.log(validate);
        if (validate) {
          const accessToken = jwt.sign(
            { user_email: userData.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' },
          );
          const refreshToken = jwt.sign(
            { user_email: userData.email },
            process.env.SECRET_REFRESH_KEY,
            { expiresIn: '1h' },
          );
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await this.usersService.update(user.id, user);

          return {
            MESSAGE: 'SUCCESSFULLY LOGGED IN',
            User:user
          };
        } else {
          return 'INCORRECT CREDENTAIL';
        }
      }
    } catch (e) {
      return 'INCORRECT CREDENTAIL';
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
      return e
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
