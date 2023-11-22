import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, UpdateUserDTO } from "./dto";
import {Op} from "sequelize";
import {MailerService} from "../mail/mail.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userRepository: typeof User,
        private readonly mailerService: MailerService
    ) {}

    async hashPassword(password: string): Promise<string> {
        try {
            return bcrypt.hash(password, 7)
        }catch (error) {
            throw error
        }
    }
    async findUserByEmail(email: string): Promise<User> {
        try {
            if (email) {
                return this.userRepository.findOne({
                    where: { email }
                });
            }
            return null;
        }catch (error) {
            throw error
        }
    }

    async findUserByUsername(username: string): Promise<User> {
        try {
            if (username) {
                return this.userRepository.findOne({
                    where: { username }
                });
            }
            return null;
        }catch (error) {
            throw error
        }
    }

    async findUserByIdentifier(identifier: string): Promise<User> {
        try {
            if (identifier) {
                return this.userRepository.findOne({
                    where: {
                        [Op.or]: [
                            { email: identifier },
                            { username: identifier },
                        ],
                    },
                });
            }
            return null;
        }catch (error) {
            throw error
        }
    }

    async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
        try {
            dto.password = await this.hashPassword(dto.password)
            const user = await this.userRepository.create({
                fullName: dto.fullName,
                username: dto.username,
                phone: dto.phone,
                email: dto.email,
                password: dto.password,
                confirmationCode: Math.random().toString(36).slice(2),
                isConfirmed: false,
            })
            dto.confirmationCode = user.confirmationCode;
            await this.mailerService.sendConfirmationEmail(dto.email, dto.confirmationCode);
            return dto
        }catch (error) {
            throw error
        }
    }

    async confirmUser(confirmationCode: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { confirmationCode } });
        if (user) {
            user.isConfirmed = true;
            user.confirmationCode = null;
            await user.save();
        }
        return user;
    }

    async publicUserByIdentifier(identifier: string): Promise<User> {
        try {
            if (identifier) {
                return this.userRepository.findOne({
                    where: {
                        [Op.or]: [
                            { email: identifier },
                            { username: identifier },
                        ],
                    },
                    attributes: { exclude: ['password'] },
                });
            }
            return null;
        }catch (error) {
            throw error
        }
    }

    async updateUser(email: string, username: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
        try {
            await this.userRepository.update(dto, {where: {[Op.or]: [{ email }, { username }]}})
            return dto
        }catch (error) {
            throw error
        }
    }

    async deleteUser(email: string, username: string): Promise<boolean> {
        try {
            await this.userRepository.destroy({where: {[Op.or]: [{ email }, { username }]}})
            return true
        }catch (error) {
            throw error
        }
    }
}
