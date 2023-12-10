import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Category} from "./models/category.model"
import {CategoryDTO} from "./dto";

@Injectable()
export class CategoryService {
    constructor(
      @InjectModel(Category)
      private readonly categoryRepository: typeof Category,
    ) {
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.findAll();
    }

    async findById(id: number): Promise<Category> {
        const existCategory = await this.categoryRepository.findOne({ where: { id } });
        return existCategory;
    }

    async create(dto: CategoryDTO): Promise<Category> {
        const isExist = await this.categoryRepository.findOne({ where: { name: dto.name } })

        if (isExist) throw new BadRequestException('Такая категория уже существует!')

        return await this.categoryRepository.create({name: dto.name})
    }


    async update(id: number, dto: CategoryDTO): Promise<Category> {
        try {
            const existingCategory = await this.categoryRepository.findOne({ where: { name: dto.name } });

            if (existingCategory) throw new BadRequestException('Такая категория уже существует!')

            await this.categoryRepository.update(dto, { where: { id } });

            const updatedCategory = await this.categoryRepository.findByPk(id);

            return updatedCategory;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            await this.categoryRepository.destroy({ where: { id } });
            return { message: `Категория с идентификатором ${id} успешно удалена.` };
        }catch (error) {
            throw new BadRequestException(error);
        }
    }
}