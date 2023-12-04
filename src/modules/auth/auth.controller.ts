import {Body, Controller, Get, NotFoundException, Post, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "../users/dto";
import { UserLoginDTO } from "./dto";
import { AuthUserResponse } from "./response";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {UsersService} from "../users/users.service";
import {ResetPasswordDto} from "../../reset-password/dto/reset-password.dto";
import {GoogleGuard} from "../../guards/google.guard";
import {FacebookGuard} from "../../guards/facebook.guard";
import {VkGuard} from "../../guards/vk.guard";
import { JwtAuthGuard } from "../../guards/jwt.guard";

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
      return { message: 'Пользователь успешно подтвержден!', user: confirmedUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'Пользователь с таким кодом подтверждения не существует!' };
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.sendResetPasswordEmail(resetPasswordDto.email);
    return { message: 'Email sent for password reset' };
  }

  @UseGuards(GoogleGuard)
  @Get('google/login')
  async googleLogin() {
    return {msg: 'Google Authentication'}
  }

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback() {
    return {msg: 'OK'}
  }

  @UseGuards(FacebookGuard)
  @Get('facebook/login')
  async facebookLogin() {
    return {msg: 'Facebook Authentication'}
  }

  @UseGuards(FacebookGuard)
  @Get('facebook/callback')
  async facebookCallback() {
    return {msg: 'OK'}
  }

  @UseGuards(VkGuard)
  @Get('vk/login')
  async vkLogin() {
    return {msg: 'VK Authentication'}
  }

  @UseGuards(VkGuard)
  @Get('vk/callback')
  async vkCallback() {
    return {msg: 'OK'}
  }
}
