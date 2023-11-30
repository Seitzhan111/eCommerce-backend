import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { ProductsService } from './products.service';
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {ProductDTO, ProductUpdateDTO} from "./dto";
import {Product} from "./models/product.model";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: ProductDTO, @Req() req): Promise<Product> {
    return this.productsService.create(dto, +req.user.id);
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
  update(@Param('id') id: number, @Body() dto: ProductUpdateDTO, @Req() req): Promise<Product> {
    return this.productsService.update(id, +req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req): Promise<{ message: string }> {
    return this.productsService.remove(id, +req.user.id);
  }
}
