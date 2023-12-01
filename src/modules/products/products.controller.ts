import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile, UploadedFiles
} from "@nestjs/common";
import { ProductsService } from './products.service';
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {ProductDTO, ProductUpdateDTO} from "./dto";
import {Product} from "./models/product.model";
import { MulterFile } from 'multer';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: ProductDTO): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product[]> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: ProductUpdateDTO): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() image: MulterFile,
  ): Promise<any> {
    try {
      const result = await this.productsService.uploadImage(id, image);
      return { message: result.message, imagePath: result.imagePath };
    } catch (error) {
      console.error(error);
      return { error: 'Ошибка при загрузке картинки!' };
    }
  }
}
