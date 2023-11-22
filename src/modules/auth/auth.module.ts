import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";
import { JwtStrategy } from "../../strategy";
import {MailerService} from "../mail/mail.service";

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService]
})
export class AuthModule {}
