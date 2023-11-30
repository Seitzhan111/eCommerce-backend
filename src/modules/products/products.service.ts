import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Product} from "./models/product.model";
import {ProductDTO, ProductUpdateDTO} from "./dto";

@Injectable()
export class ProductsService {
  constructor(
      @InjectModel(Product)
      private readonly productRepository: typeof Product,
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
}
