import {Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch, Req} from '@nestjs/common';
import { CategoryService } from './category.service';
import {Category} from "./models/category.model";
import {JwtAuthGuard} from "../../guards/jwt.guard";
import {CategoryDTO} from "./dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorator/roles-auth.decorator";
import { RolesGuard } from "../../guards/roles.guard";

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAllCategories(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<Category | null> {
        return this.categoryService.findById(id);
    }

    @ApiTags('API')
    @ApiResponse({status: 201})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() dto: CategoryDTO): Promise<Category> {
        return this.categoryService.create(dto);
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: CategoryDTO): Promise<Category> {
        return this.categoryService.update(id, dto);
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        return this.categoryService.remove(id);
    }
}