import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configurations from "../../configurations/configuratins";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/models/user.model";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../token/token.module";
import { ResetPasswordController } from "../../reset-password/reset-password.controller";
import { ResetPasswordService } from "../../reset-password/reset-password.service";
import { MailerModule } from "../mail/mail.module";
import { ResetPasswordModule } from "../../reset-password/reset-password.module";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configurations]
  }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        synchronize: true,
        autoLoadModels: true,
        models: [User],
      })
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    MailerModule,
    ResetPasswordModule
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class AppModule {}
