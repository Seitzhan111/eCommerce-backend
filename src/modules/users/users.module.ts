import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {MailerService} from "../mail/mail.service";
import { TokenModule } from "../token/token.module";
import {Role} from "../roles/models/roles.model";
import {UserRoles} from "../roles/models/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles]), TokenModule, RolesModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService, MailerService, JwtService],
  exports: [UsersService]
})
export class UsersModule {}
