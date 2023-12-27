import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Product} from "./models/product.model";
import {ProductDTO, ProductUpdateDTO} from "./dto";
import { MulterFile } from 'multer';
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Op } from "sequelize";

@Injectable()
export class ProductsService {
  constructor(
      @InjectModel(Product)
      private readonly productRepository: typeof Product,
      private readonly cloudinaryService: CloudinaryService,
  ) {}

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.productRepository.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('Продукт не найден');
    }

    return products;
  }

  async uploadImages(images: MulterFile[]): Promise<string[]> {
    const uploadedImages = [];

    for (const image of images) {
      const imageUrl = await this.cloudinaryService.upload(image);
      uploadedImages.push(imageUrl);
    }

    return uploadedImages;
  }

  async create(dto: ProductDTO): Promise<Product> {
    try {
      const isExist = await this.productRepository.findOne({
        where: { name: dto.name }
      });

      if (isExist) {
        throw new BadRequestException('Продукт с таким названием уже существует!');
      }

      const newProduct = {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image: null,
        sales: dto.sales || null,
        categoryId: dto.categoryId
      };

      return await this.productRepository.create(newProduct);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadImage(id: string, image: MulterFile): Promise<any> {
    try {
      const product = await this.productRepository.findByPk(id);

      if (!product) {
        throw new NotFoundException('Продукт не найден!');
      }

      const imagePath = await this.cloudinaryService.upload(image);

      product.image = imagePath;

      await product.save();

      return { message: 'Картинка успешно загрузилась!', imagePath };
    } catch (error) {
      throw new BadRequestException('Ошибка при загрузке картинки!');
    }
  }


  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll()
  }

  async findById(id: string): Promise<any | undefined> {
    const product = await this.productRepository.findAll({ where: { id: id } });
    return Promise.resolve(product);
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
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const existProduct = await this.productRepository.findOne({
        where: { id },
      });
      if (!existProduct) return {message: `Продукт с идентификатором ${id} не существует`}

      await this.productRepository.destroy({ where: { id } });

      return { message: `Продукт с идентификатором ${id} успешно удален.` };
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteImage(productId: number): Promise<{ message: string }> {
    try {
      const product = await this.productRepository.findByPk(productId);
      if (!product) {
        throw new NotFoundException('Продукт не найден!');
      }

      const imagePath = product.image;

      if (imagePath) {
        await this.cloudinaryService.delete(imagePath);
        product.image = null;
        await product.save();
        return { message: 'Изображение успешно удалено!' };
      } else {
        console.warn('No image to delete. No action taken.');
        return { message: 'Нет изображения для удаления. Не выполнено никаких действий.' };
      }
    } catch (error) {
      console.error('Error while deleting image:', error);
      throw new BadRequestException('Ошибка при удалении изображения!');
    }
  }
}
