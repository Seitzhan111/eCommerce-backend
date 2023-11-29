import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {MailerService} from "../mail/mail.service";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [SequelizeModule.forFeature([User]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService, MailerService],
  exports: [UsersService]
})
export class UsersModule {}
