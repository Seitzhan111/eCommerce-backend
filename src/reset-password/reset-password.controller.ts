import { Controller, Get, Param, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { UsersService } from "../modules/users/users.service";
import { MailerService } from "../modules/mail/mail.service";

@Controller('reset-password')
export class ResetPasswordController {
    constructor(
      private readonly resetPasswordService: ResetPasswordService,
      private readonly usersService: UsersService,
      private readonly mailerService: MailerService
    ) {}

    @Post(':userId')
    async saveResetToken(@Param('userId') userId: string, @Body() body: { email: string }): Promise<{ resetToken: string }> {
        const { email } = body;
        try {
            const resetToken = await this.resetPasswordService.saveResetToken(userId);

            // Отправка электронного письма с ссылкой для сброса пароля
            const resetLink = `http://localhost:4430/reset-password/${resetToken}`;
            const emailContent = `Click on the following link to reset your password: ${resetLink}`;
            console.log(email);

            await this.mailerService.sendEmail(email, 'Password Reset', emailContent);
            return { resetToken };
        }catch (error) {
            throw error
        }
    }

    @Get(':resetToken')
    getUserIdByResetToken(@Param('resetToken') resetToken: string): { userId: string } {
        const userId = this.resetPasswordService.getUserIdByResetToken(resetToken);
        if (!userId) {
            throw new NotFoundException('Reset token not found');
        }
        return { userId };
    }

    @Post(':resetToken/complete')
    async completePasswordReset(@Param('resetToken') resetToken: string, @Body() newPassword: { password: string }): Promise<{ message: string }> {
        const userId = await this.resetPasswordService.getUserIdByResetToken(resetToken);
        if (!userId) {
            throw new NotFoundException('Reset token not found');
        }

        try {
            // Ваш код для завершения сброса пароля, например, сохранение нового пароля в базе данных
            await this.usersService.updatePassword(userId, newPassword.password);

            // Удалить токен после завершения сброса пароля
            await this.resetPasswordService.removeResetToken(resetToken);

            return { message: 'Password reset completed successfully' };
        } catch (error) {
            console.error('Error updating password:', error);
            throw new BadRequestException('Failed to complete password reset');
        }
    }
}