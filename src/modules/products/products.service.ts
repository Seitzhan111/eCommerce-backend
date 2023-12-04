import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Product} from "./models/product.model";
import {ProductDTO, ProductUpdateDTO} from "./dto";
import { MulterFile } from 'multer';
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class ProductsService {
  constructor(
      @InjectModel(Product)
      private readonly productRepository: typeof Product,
      private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: ProductDTO): Promise<Product> {
    try {
      const isExist = await this.productRepository.findOne({
        where: {name: dto.name}
      })
      if (isExist) throw new BadRequestException('Продукт с таким названием уже существует!')
      const newProduct = {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        images: dto.images || null,
        sales: dto.sales || null,
        categoryId: dto.categoryId
      }
      return await this.productRepository.create(newProduct)
    }catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll()
  }

  async findOne(id: number) {
    return await this.productRepository.findAll({where: {id}})
  }

  async update(id: number, dto: ProductUpdateDTO): Promise<Product> {
    try {
      await this.productRepository.update(dto, { where: { id } });
      const updatedProduct = await this.productRepository.findByPk(id);
      return updatedProduct
    }catch (error) {
      throw error
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const existProduct = await this.productRepository.findOne({
        where: { id },
      });

      await this.productRepository.destroy({ where: { id } });

      return { message: `Продукт с идентификатором ${id} успешно удален.` };
    }catch (error) {
      throw error
    }
  }


  async uploadImage(id: string, image: MulterFile): Promise<any> {
    try {
      const product = await this.productRepository.findOne({where: {id}});

      if (!product) {
        throw new Error('Продукт не найден!');
      }

      const imagePath = await this.cloudinaryService.upload(image);

      product.images = [...(product.images || []), imagePath];
      await product.save();

      return { message: 'Картинка успешно загрузилась!', imagePath };
    } catch (error) {
      throw new Error('Ошибка при загрузке картинки!');
    }
  }

  async deleteImage(productId: number, imageIndex: number): Promise<{ message: string }> {
    try {
      const product = await this.productRepository.findByPk(productId);
      if (!product) {
        throw new Error('Продукт не найден!');
      }
      const images = product.images || [];
      if (images.length > 0 && imageIndex >= 0 && imageIndex < images.length) {
        await this.cloudinaryService.delete(images[imageIndex]);
        images.splice(imageIndex, 1);
        product.images = images;
        await this.productRepository.update({ images }, { where: { id: productId } });
        return { message: 'Изображение успешно удалено!' };
      } else {
        console.warn('Invalid index or empty array. No action taken.');
        return { message: 'Неверный индекс или пустой массив. Не выполнено никаких действий.' };
      }
    }  catch (error) {
      console.error('Error while saving product:', error);
      throw new Error('Ошибка при сохранении продукта!');
    }
  }
}
