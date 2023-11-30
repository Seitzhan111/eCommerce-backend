import {Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch, Req} from '@nestjs/common';
import { CategoryService } from './category.service';
import {Category} from "./models/category.model";
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {CategoryDTO} from "./dto";

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAllCategories(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param('id') id: number): Promise<Category | null> {
        return this.categoryService.findById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CategoryDTO): Promise<Category> {
        return this.categoryService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() dto: CategoryDTO): Promise<Category> {
        return this.categoryService.update(id, dto);
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        return this.categoryService.remove(id);
    }
}