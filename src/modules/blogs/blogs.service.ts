import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Blog } from "./models/blog.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { BlogDTO } from "./dto";
import { MulterFile } from 'multer';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog) private readonly blogRepository: typeof Blog,
              private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(dto: BlogDTO): Promise<Blog> {
    try {
      const isExist = await this.blogRepository.findOne({where: {title: dto.title}})
      if (isExist) throw new BadRequestException('Блог с таким заголовком уже существует!')
      const newBlog = {
        title: dto.title,
        content: dto.content,
        image: dto.image || null,
      }
      return await this.blogRepository.create(newBlog)
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.findAll()
  }

  async findOne(id: number): Promise<Blog> {
    return await this.blogRepository.findOne({where: {id}})
  }

  async update(id: number, dto: BlogDTO): Promise<Blog> {
    try {
      await this.blogRepository.update(dto, { where: { id } })
      const updateBlog = await this.blogRepository.findByPk(id)
      return updateBlog
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number): Promise<{message: string}> {
    try {
      const isExist = await this.blogRepository.findOne({where: {id}})
      if (!isExist) return {message: `Блог с идентификатором ${id} не существует`}
      await this.blogRepository.destroy({where: {id}})
      return { message: `Блог с идентификатором ${id} успешно удален.` };
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadImage(id: string, image: MulterFile): Promise<any> {
    try {
      const blog = await this.blogRepository.findByPk(id);

      if (!blog) {
        throw new NotFoundException('Блог не найден!');
      }

      const imagePath = await this.cloudinaryService.upload(image);

      blog.image = imagePath;

      await blog.save();

      return { message: 'Картинка успешно загрузилась!', imagePath };
    } catch (error) {
      throw new NotFoundException('Ошибка при загрузке картинки!');
    }
  }

  async deleteImage(blogId: number): Promise<{ message: string }> {
    try {
      const blog = await this.blogRepository.findByPk(blogId);
      if (!blog) {
        throw new NotFoundException('Блог не найден!');
      }

      // Удаляем изображение
      if (blog.image) {
        await this.cloudinaryService.delete(blog.image);
        blog.image = null; // Устанавливаем поле image в null

        await blog.save();

        return { message: 'Изображение успешно удалено!' };
      } else {
        console.warn('No image to delete.');
        return { message: 'Нет изображения для удаления.' };
      }
    } catch (error) {
      console.error('Error while deleting image:', error);
      throw new NotFoundException('Ошибка при удалении изображения!');
    }
  }
}
