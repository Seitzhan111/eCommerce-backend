import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogDTO } from "./dto";
import { Blog } from "./models/blog.model";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorator/roles-auth.decorator";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterFile } from 'multer';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiTags('API')
  @ApiResponse({status: 201})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: BlogDTO): Promise<Blog>{
    return this.blogsService.create(dto)
  }

  @Get()
  findAll() {
    return this.blogsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Blog> {
    return this.blogsService.findOne(id)
  }

  @ApiTags('API')
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: BlogDTO): Promise<Blog> {
    return this.blogsService.update(id, dto);
  }

  @ApiTags('API')
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.blogsService.delete(id);
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
      const result = await this.blogsService.uploadImage(id, image);
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
  @Delete(':id/images/:index')
  async deleteImage(
    @Param('id') blogId: number,
    @Param('index') imageIndex: number,
  ): Promise<{ message: string }> {
    return this.blogsService.deleteImage(blogId, imageIndex);
  }
}
