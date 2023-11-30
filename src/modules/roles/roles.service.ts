import { Injectable } from '@nestjs/common';
import {RoleDTO} from "./dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./models/roles.model";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {}

    async createRole(dto: RoleDTO) {
        const role = await this.roleRepository.create({value: dto.value})
        return role
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role
    }
}
