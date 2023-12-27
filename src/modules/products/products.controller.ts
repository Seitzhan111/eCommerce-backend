import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile, Query, NotFoundException, InternalServerErrorException, HttpStatus, HttpException, Req
} from "@nestjs/common";
import { ProductsService } from './products.service';
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {ProductDTO, ProductUpdateDTO} from "./dto";
import {Product} from "./models/product.model";
import { MulterFile } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorator/roles-auth.decorator";
import { RolesGuard } from "../../guards/roles.guard";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Get('search')
  async searchProducts(@Query('query') query: string) {
    try {
      const products = await this.productsService.searchProducts(query);
      return products;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('Error in searchProducts:', error);
        throw new InternalServerErrorException();
      }
    }
  }

  @ApiResponse({ status: 201, type: ProductDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() dto: ProductDTO): Promise<Product> {
    try {
      return this.productsService.create(dto);
    } catch (error) {
      throw new HttpException(error.message || 'Ошибка при создании продукта', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query('id') id: string) {
    try {
      if (id) {
        const product = await this.productsService.findById(id);
        return product ? { data: product } : { message: 'Продукт не найден' };
      } else {
        const products = await this.productsService.findAll();
        return { data: products };
      }
    } catch (error) {
      return { error: 'Произошла ошибка при обработке запроса' };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product[]> {
    return this.productsService.findOne(id);
  }

  @ApiTags('API')
  @ApiResponse({status: 200, type: ProductUpdateDTO})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: ProductUpdateDTO): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @ApiTags('API')
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }

  @ApiTags('API')
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @ApiTags('API')
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/image')
  async deleteImage(
    @Param('id') productId: number,
    @Param('index') imageIndex: number,
  ): Promise<{ message: string }> {
    return this.productsService.deleteImage(productId);
  }
}
