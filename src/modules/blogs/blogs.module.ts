import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Blog } from "./models/blog.model";
import { JwtService } from "@nestjs/jwt";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
  imports: [SequelizeModule.forFeature([Blog]), CloudinaryModule],
  controllers: [BlogsController],
  providers: [BlogsService, JwtService, CloudinaryService]
})
export class BlogsModule {}
