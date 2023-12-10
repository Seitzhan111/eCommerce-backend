import { BadRequestException, Injectable } from "@nestjs/common";
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
        images: dto.images || null,
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
      const blog = await this.blogRepository.findOne({where: {id}});

      if (!blog) {
        throw new Error('Блог не найден!');
      }

      const imagePath = await this.cloudinaryService.upload(image);

      blog.images = [...(blog.images || []), imagePath];
      await blog.save();

      return { message: 'Картинка успешно загрузилась!', imagePath };
    } catch (error) {
      throw new Error('Ошибка при загрузке картинки!');
    }
  }

  async deleteImage(blogId: number, imageIndex: number): Promise<{ message: string }> {
    try {
      const blog = await this.blogRepository.findByPk(blogId);
      if (!blog) {
        throw new Error('Блог не найден!');
      }
      const images = blog.images || [];
      if (images.length > 0 && imageIndex >= 0 && imageIndex < images.length) {
        await this.cloudinaryService.delete(images[imageIndex]);
        images.splice(imageIndex, 1);
        blog.images = images;
        await this.blogRepository.update({ images }, { where: { id: blogId } });
        return { message: 'Изображение успешно удалено!' };
      } else {
        console.warn('Invalid index or empty array. No action taken.');
        return { message: 'Неверный индекс или пустой массив. Не выполнено никаких действий.' };
      }
    } catch (error) {
      console.error('Error while saving product:', error);
      throw new Error('Ошибка при сохранении продукта!');
    }
  }
}
