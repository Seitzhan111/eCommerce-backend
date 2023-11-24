import {Body, Controller, Get, NotFoundException, Post, Req, Res, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "../users/dto";
import { UserLoginDTO } from "./dto";
import { AuthUserResponse } from "./response";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {UsersService} from "../users/users.service";
import {ResetPasswordDto} from "../../reset-password/dto/reset-password.dto";
import {GoogleGuard} from "../../guards/google.guard";
import {Request, Response} from "express";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly usersService: UsersService
  ) {}

  @ApiTags('API')
  @ApiResponse({status: 201, type: CreateUserDTO})
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
    return this.authService.registerUsers(dto)


  }

  @ApiTags('API')
  @ApiResponse({status: 200, type: AuthUserResponse})
  @Post('login')
  login(@Body() dto: UserLoginDTO): Promise<AuthUserResponse> {
    return this.authService.loginUser(dto)
  }

  @Post('confirm')
  async confirm(@Body('confirmationCode') confirmationCode: string) {
    try {
      const confirmedUser = await this.usersService.confirmUser(confirmationCode);
      return { message: 'User confirmed successfully', user: confirmedUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'User not found with the provided confirmation code' };
      }
      throw error;
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.sendResetPasswordEmail(resetPasswordDto.email);
    return { message: 'Email sent for password reset' };
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  async oauth2Login() {
    return {msg: 'Google Authentication'}
  }


  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback() {
    return {msg: 'OK'}
  }
}
