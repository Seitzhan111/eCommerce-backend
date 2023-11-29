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
    ) {}

    async findAll(user: User): Promise<Category[]> {
        const userId = user.id
        return this.categoryRepository.findAll({
            where: {userId},
            include: [{ model: Product, as: 'products' }, { model: User, as: 'user' }],
        });
    }

    async findById(id: number, user: User): Promise<Category | null> {
        const userId = user.id
        const existCategory = this.categoryRepository.findOne({
            where: { id, userId},
            include: [{ model: Product, as: 'products' }, { model: User, as: 'user' }],
        });

        if (!existCategory) {
            throw new BadRequestException('У вас нет категории с указанным идентификатором.')
        }

        return existCategory;
    }

    async create(dto: CreateCategoryDTO, id: number): Promise<Category> {
        console.log('Received DTO:', dto);
        console.log('Parsed userId:', id);
        const isExist = await this.categoryRepository.findOne({
            where: {
                userId: id,
                name: dto.name
            }
        })

        if (isExist) throw new BadRequestException('Така категория уже существует!')
        const newCategory = {
            name: dto.name,
            userId: id
        }
        return await this.categoryRepository.create(newCategory)
    }

    async update(id: number, categoryData: Partial<Category>): Promise<number> {
        const [affectedCount] = await this.categoryRepository.update(categoryData, { where: { id } });
        return affectedCount;
    }

    async remove(id: number): Promise<number> {
        const result = await this.categoryRepository.destroy({ where: { id } });
        return result;
    }
}