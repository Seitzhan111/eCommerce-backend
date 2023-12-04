import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Product} from "./models/product.model";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [SequelizeModule.forFeature([Product]), CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
})
export class ProductsModule {}
