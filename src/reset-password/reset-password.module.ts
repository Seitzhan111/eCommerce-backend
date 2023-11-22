import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UsersModule } from '../modules/users/users.module';
import { MailerModule } from "../modules/mail/mail.module";
import { TokenModule } from "../modules/token/token.module";

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
  imports: [UsersModule, MailerModule, TokenModule],
})
export class ResetPasswordModule {}