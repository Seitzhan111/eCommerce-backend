import {Controller, Post, Body, Get, Query, Res} from '@nestjs/common';
import {TokenService} from "../modules/token/token.service";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {AuthService} from "../modules/auth/auth.service";
import {Response} from "express";

@Controller('reset-password')
export class ResetPasswordController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly authService: AuthService
    ) {}

    @Post()
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ resetToken: string }> {
        const resetToken = await this.tokenService.generateJwtToken(resetPasswordDto.email);
        return { resetToken };
    }

    @Get()
    async resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
        try {
            // Ваш код для верификации и обработки токена
            const decodedToken = await this.tokenService.verifyResetToken(token);

            // Если токен валиден, вы можете отобразить страницу сброса пароля
            // В реальном приложении вы, вероятно, хотите рендерить HTML-страницу с формой смены пароля.

            return res.status(200).json({ message: 'Password reset page' });
        } catch (error) {
            // Если токен недействителен или истек, обработайте ошибку соответственно
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
    }

}