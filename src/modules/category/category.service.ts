import {BadRequestException, Injectable, Req} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Category} from "./models/category.model";
import {Product} from "../products/models/product.model";
import {User} from "../users/models/user.model";
import {CreateCategoryDTO} from "./dto";
import {Repository} from "sequelize-typescript";
@Injectable()
export class CategoryService {
    constructor(
      @InjectModel(Category)
      private readonly categoryRepository: Repository<Category>,
    ) {
    }

    async findAll(user: User): Promise<Category[]> {
        const userId = user.id
        return this.categoryRepository.findAll({
            where: { userId },
            // include: [{ model: Product, as: 'products' }, { model: User, as: 'user' }],
        });
    }

    async findById(id: number, userId: number): Promise<Category | null> {
        const existCategory = await this.categoryRepository.findOne({
            where: { id, userId },
            // include: [{ model: Product, as: 'products' }, { model: User, as: 'user' }],
        });

        if (!existCategory) {
            throw new BadRequestException(`У вас нет категории с ${id} идентификатором`)
        }

        return existCategory;
    }

    async create(dto: CreateCategoryDTO, id: number): Promise<Category> {
        const isExist = await this.categoryRepository.findOne({
            where: { name: dto.name }
        })

        if (isExist) throw new BadRequestException('Такая категория уже существует!')
        const newCategory = {
            name: dto.name,
            userId: id
        }
        return await this.categoryRepository.create(newCategory)
    }


    async update(id: number, userId: number, dto: CreateCategoryDTO): Promise<Category> {
        try {
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: dto.name },
            });

            if (existingCategory) throw new BadRequestException('Такая категория уже существует!')

            await this.categoryRepository.update(dto, { where: { id, userId } });

            const updatedCategory = await this.categoryRepository.findByPk(id);

            return updatedCategory;
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number, userId: number): Promise<{ message: string }> {
        const existCategory = await this.categoryRepository.findOne({
            where: { id, userId },
        });

        if (!existCategory) {
            throw new BadRequestException(`У вас нет категории с идентификатором ${id}`);
        }

        await this.categoryRepository.destroy({ where: { id, userId } });

        return { message: `Категория с идентификатором ${id} успешно удалена.` };
    }
}