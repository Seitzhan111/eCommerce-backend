import {MiddlewareConsumer, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";
import { JwtStrategy } from "../../strategy/jwt.strategy";
import {MailerService} from "../mail/mail.service";
import {GoogleStrategy} from '../../strategy/google.strategy'
import {PassportModule} from "@nestjs/passport";
import * as passport from 'passport';
import {FacebookStrategy} from "../../strategy/facebook .strategy";

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService, GoogleStrategy, FacebookStrategy]
})

export class AuthModule {}
