import {Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch, Req} from '@nestjs/common';
import { CategoryService } from './category.service';
import {Category} from "./models/category.model";
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {CreateCategoryDTO} from "./dto";

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCategories(@Req() req): Promise<Category[]> {
        const user = req.user
        return this.categoryService.findAll(user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param('id') id: number, @Req() req): Promise<Category | null> {
        const user = req.user
        return this.categoryService.findById(id, user);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateCategoryDTO, @Req() req): Promise<Category> {
        return this.categoryService.create(dto, +req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() categoryData: Partial<Category>): Promise<number> {
        return this.categoryService.update(id, categoryData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<number> {
        return this.categoryService.remove(id);
    }
}