import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, UpdateUserDTO } from "./dto";
import {Op, where} from "sequelize";
import {MailerService} from "../mail/mail.service";
import {AppError} from "../../common/constants/errors";
import {getLogger} from "nodemailer/lib/shared";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userRepository: typeof User,
        private readonly mailerService: MailerService
    ) {}

    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, 10)
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
                confirmationCode: Math.random().toString(36).slice(2) || null,
                isConfirmed: dto.isConfirmed,
                isSocialRegistration: dto.isSocialRegistration ? 'true' : 'false'
            })
            dto.confirmationCode = user.confirmationCode;

            if (!dto.isSocialRegistration) {
                await this.mailerService.sendConfirmationEmail(dto.email, dto.confirmationCode);
            }

            const { password, ...userWithoutPassword } = user.toJSON();

            return userWithoutPassword;

        }catch (error) {
            throw error
        }
    }

    async confirmUser(confirmationCode: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { confirmationCode } });
            if (user) {
                user.isConfirmed = true;
                user.confirmationCode = null;
                await user.save();
            }
            return user;
        }catch (error) {
            throw error
        }
    }

    async updatePassword(id: string, newPassword: string, checkCurrentPassword: boolean = false, currentPassword?: string): Promise<void> {
        try {
            const user = await this.userRepository.findOne({where: {id}});

            if (!user) {
                throw new NotFoundException('Пользователь не существует');
            }

            if (checkCurrentPassword) {
                const isCurrentPasswordValid = await this.checkCurrentPassword(user, currentPassword);

                if (!isCurrentPasswordValid) {
                    throw new UnauthorizedException('Текущий пароль не корректен');
                }
            }

            const hashedPassword = await this.hashPassword(newPassword);

            await this.userRepository.update(
                { password: hashedPassword },
                { where: { id } }
            );
        }catch (error) {
            throw error
        }
    }

    private async checkCurrentPassword(user: User, currentPassword: string): Promise<boolean> {
        return await bcrypt.compare(currentPassword, user.password);
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
            const userByEmail = await this.findUserByEmail(dto.email)
            const userByUsername = await this.findUserByUsername(dto.username)
            if (userByEmail) {
                throw new BadRequestException(AppError.USER_EMAIL_EXIST)
            }else if (userByUsername) {
                throw new BadRequestException(AppError.USER_LOGIN_EXIST)
            }else {
                await this.userRepository.update(dto, {where: {[Op.or]: [{ email }, { username }]}})
            }
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
