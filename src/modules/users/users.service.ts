import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from 'bcrypt'
import {CreateUserDTO} from "./dto";
import {AppError} from "../../common/errors";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userRepository: typeof User) {}
    async hashPassword(password) {
        return bcrypt.hash(password, 7)
    }
    async findUserByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } })
    }
    async createUser(userDto: CreateUserDTO): Promise<CreateUserDTO> {
        const existUser = await this.findUserByEmail(userDto.email)
        if (existUser) throw new BadRequestException(AppError.USER_EXIST)
        userDto.password = await this.hashPassword(userDto.password)
        await this.userRepository.create({
            firstName: userDto.firstName,
            username: userDto.username,
            email: userDto.email,
            password: userDto.password
        })
        return userDto
    }
}
