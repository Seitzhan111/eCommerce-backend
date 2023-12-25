import { Body, Controller, Get, NotFoundException, Post, Req, Res, UseGuards } from "@nestjs/common";
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
import { AuthGuard } from "@nestjs/passport";

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
  googleLogin(@Res() res: Response) {
    (res as any).redirect('http://localhost:4430/auth/google/login');
  }

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const user = req['user']; // Получение пользователя из успешной аутентификации
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Редирект на промежуточный маршрут
      (res as any).redirect('http://localhost:3000');
    } catch (error) {
      // Обработка ошибок аутентификации
      console.error('Google Authentication Error:', error);
      (res as any).redirect('http://localhost:3000/auth/error');
    }
  }

  @Get('auth/success')
  async successRedirect(@Res() res: Response): Promise<void> {
    // Редирект с фронтенда после успешной аутентификации
    (res as any).redirect('http://localhost:3000/success');
  }

  @Get('auth/error')
  async errorRedirect(@Res() res: Response): Promise<void> {
    // Редирект с фронтенда при ошибке аутентификации
    (res as any).redirect('http://localhost:3000/error');
  }

  @UseGuards(FacebookGuard)
  @Get('facebook/login')
  async facebookLogin() {
    return {msg: 'Facebook Authentication'}
  }

  @UseGuards(FacebookGuard)
  @Get('facebook/callback')
  async facebookCallback(@Req() req, @Res() res: Response) {
    (res as any).redirect('http://localhost:3000');
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
