import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDTO } from "../users/dto";
import { AppError } from "../../common/constants/errors";
import { UserLoginDTO } from "./dto";
import * as bcrypt from 'bcrypt'
import { AuthUserResponse } from "./response";
import { TokenService } from "../token/token.service";
import { User } from "../users/models/user.model";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail_host'),
      port: parseInt(this.configService.get('mail_port')),
      auth: {
        user: this.configService.get('mailDev_incoming_user'),
        pass: this.configService.get('mailDev_incoming_pass'),
      },
    });
  }

  async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      const userByEmail = await this.userService.findUserByEmail(dto.email)
        const userByUsername = await this.userService.findUserByUsername(dto.username)
      if (userByEmail) {
        throw new BadRequestException(AppError.USER_EMAIL_EXIST)
      }else if (userByUsername) {
        throw new BadRequestException(AppError.USER_LOGIN_EXIST)
      }else {
        return this.userService.createUser(dto)
      }

    }catch (error) {
      throw error;
    }
  }

  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    try {
      let existUser: User | null;
      if (dto.email || dto.username) existUser = await this.userService.findUserByIdentifier(dto.email || dto.username)
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_FOUND)
      const validatePassword = await bcrypt.compare(dto.password, existUser.password)
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA)
      const token = await this.tokenService.generateJwtToken({
        id: existUser.id,
        username: existUser.username,
        email: existUser.email,
      })
      let user: User | null;
      if (dto.email || dto.username) {
        const identifier = (dto.email || dto.username).toLowerCase();
        user = await this.userService.publicUserByIdentifier(identifier)
      }

      const {password, ...userWithoutPassword} = user.toJSON()
      userWithoutPassword.token = token

      return userWithoutPassword

    } catch (error) {
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    try {
      const resetToken = await this.tokenService.generateJwtToken({ user: { email } });
      const resetLink = `http://localhost:4430/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: this.configService.get('mailDev_incoming_user'),
        to: email,
        subject: 'Сброс пароля',
        html: `<p>Нажмите на ссылку: <a href="${resetLink}">here</a> для сброса вашего пароля.</p>`,
      };
      await this.transporter.sendMail(mailOptions);
    }catch (error) {
      console.error('Ошибка при отправке электронного письма сброса пароля:', error);
      throw new Error('Не удалось отправить электронное письмо сброса пароля');
    }
  }
}
