import {Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";
import { JwtStrategy } from "../../strategy/jwt.strategy";
import {MailerService} from "../mail/mail.service";
import {GoogleStrategy} from '../../strategy/google.strategy'
import {FacebookStrategy} from "../../strategy/facebook .strategy";
import {VkStrategy} from "../../strategy/vk.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RolesGuard } from "../../guards/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secret_jwt'),
        signOptions: { expiresIn: configService.get('expire_jwt') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService, GoogleStrategy, FacebookStrategy, VkStrategy, RolesGuard]
})

export class AuthModule {}
