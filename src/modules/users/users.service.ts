import {
    BadRequestException,
    HttpException, HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import * as bcrypt from 'bcrypt'
import { AddRoleDTO, CreateUserDTO, RemoveRoleDTO, UpdateUserDTO } from "./dto";
import {Op} from "sequelize";
import {MailerService} from "../mail/mail.service";
import {AppError} from "../../common/constants/errors";
import { TokenService } from "../token/token.service";
import {RolesService} from "../roles/roles.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MulterFile } from 'multer';
import { Role } from "../roles/models/roles.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userRepository: typeof User,
        private readonly mailerService: MailerService,
        private readonly tokenService: TokenService,
        private readonly roleService: RolesService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
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
                const lowerCasedIdentifier = identifier.toLowerCase()
                return this.userRepository.findOne({
                    where: {
                        [Op.or]: [
                            { email: lowerCasedIdentifier },
                            { username: lowerCasedIdentifier },
                        ],
                    },
                    include: {all: true}
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
                username: dto.username.toLowerCase(),
                phone: dto.phone,
                email: dto.email.toLowerCase(),
                password: dto.password,
                confirmationCode: dto.isSocialRegistration ? null : Math.random().toString(36).slice(2),
                isConfirmed: dto.isConfirmed,
                isSocialRegistration: dto.isSocialRegistration ? 'true' : 'false',
                role: dto.role
            })

            const role = await this.roleService.getRoleByValue("USER")
            await user.$set('roles', [role.id]);
            user.roles = [role];

            dto.confirmationCode = user.confirmationCode;

            if (!dto.isSocialRegistration) {
                await this.mailerService.sendConfirmationEmail(dto.email, dto.confirmationCode);
            }

            const token = await this.tokenService.generateJwtToken({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles
            })

            const { password, ...userWithoutPassword } = user.toJSON();
            userWithoutPassword.roles = user.roles
            userWithoutPassword.token = token

            return userWithoutPassword;

        }catch (error) {
            throw error
        }
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}})
        return users
    }

    async confirmUser(confirmationCode: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { confirmationCode } });
            if (user) {
                user.isConfirmed = true;
                user.confirmationCode = null;
                await user.save();
            }
            const { password, isSocialRegistration, ...userWithoutPassword } = user.toJSON();

            return userWithoutPassword;
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
                    include: [{ model: Role, attributes: ['value'] }],
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

    async uploadAvatar(file: MulterFile, id: number): Promise<any> {
        try {
            const avatarPath = await this.cloudinaryService.upload(file);
            await this.userRepository.update({ avatar: avatarPath }, { where: { id } });
            return { message: 'Аватар успешно загрузился!', avatarPath };
        } catch (error) {
            console.error(error);
            throw new Error('Ошибка при загрузке файла аватара!');
        }
    }

    async deleteAvatar(userId: number): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findByPk(userId);
            if (!user) {
                throw new Error('Пользователь не найден!');
            }
            if (!user.avatar) {
                throw new Error('У пользователя нет аватара для удаления!');
            }
            await this.cloudinaryService.delete(user.avatar);
            user.avatar = null;
            await user.save();

            return { message: 'Аватар успешно удален!' };
        } catch (error) {
            console.error(error);
            throw new Error('Ошибка при удалении файла аватара!');
        }
    }

    async addRole(dto: AddRoleDTO) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleByValue(dto.value)
        if (role && user) {
            await user.$add('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
    }
    async RemoveRole(dto: RemoveRoleDTO) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleById(dto.roleId)
        if (role && user) {
            await user.$remove('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не найдена', HttpStatus.NOT_FOUND)
    }
}
