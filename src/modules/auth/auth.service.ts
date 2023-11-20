import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDTO } from "../users/dto";
import { AppError } from "../../common/constants/errors";
import { UserLoginDTO } from "./dto";
import * as bcrypt from 'bcrypt'
import { AuthUserResponse } from "./response";
import { TokenService } from "../token/token.service";
import { User } from "../users/models/user.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService
  ) {}

  async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      const userByEmail = await this.userService.findUserByEmail(dto.email)
      const userByUsername = await this.userService.findUserByUsername(dto.username)
      if (userByEmail) throw new BadRequestException(AppError.USER_EMAIL_EXIST)
      else if (userByUsername) throw new BadRequestException(AppError.USER_LOGIN_EXIST)
      else return this.userService.createUser(dto)
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
      const userData = {
        username: existUser.username,
        email: existUser.email
      }
      const token = await this.tokenService.generateJwtToken(userData)
      let user: User | null;
      if (dto.email || dto.username) {
        user = await this.userService.publicUserByIdentifier(dto.email || dto.username)
      }
      return {...user, token}
    } catch (error) {
      throw error;
    }
  }
}
