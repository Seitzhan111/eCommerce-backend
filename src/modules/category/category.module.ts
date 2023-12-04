import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Category} from "./models/category.model";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService]
})
export class CategoryModule {}
