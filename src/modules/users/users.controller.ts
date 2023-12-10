import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {UsersService} from "./users.service";
import { AddRoleDTO, RemoveRoleDTO, UpdateUserDTO } from "./dto";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { MulterFile } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "../auth/decorator/roles-auth.decorator";
import { RolesGuard } from "../../guards/roles.guard";


@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService) {}

    @ApiTags('API')
    @ApiResponse({status: 200, type: UpdateUserDTO})
    @UseGuards(JwtAuthGuard)
    @Patch()
    updateUser(@Body() updateDto: UpdateUserDTO, @Req() request): Promise<UpdateUserDTO> {
        const user = request.user
        return this.usersService.updateUser(user.email, user.username, updateDto)
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAllUsers(@Req() req) {
        return this.usersService.getAllUsers()
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteUser(@Req() request) {
        const user = request.user
        return this.usersService.deleteUser(user.email, user.username)
    }
    @ApiTags('API')
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Post(':userId/update-password')
    async updatePassword(@Param('userId') userId: string, @Body() data: { currentPassword: string, newPassword: string }): Promise<{ message: string }> {
        await this.usersService.updatePassword(userId, data.newPassword, true, data.currentPassword);
        return { message: 'Пароль успешно изменен!' };
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@UploadedFile() avatar: MulterFile, @Req() request): Promise<any> {
        try {
            const result = await this.usersService.uploadAvatar(avatar, request.user.id);
            return { message: result.message, avatarPath: result.avatarPath };
        } catch (error) {
            console.error(error);
            return { error: 'Ошибка при загрузки аватара!' };
        }
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Delete('avatar')
    async deleteAvatar(@Req() request): Promise<{ message: string }> {
        const userId = request.user.id;
        return this.usersService.deleteAvatar(userId);
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    userInfo(@Req() req) {
        return this.usersService.findUserByIdentifier(req.user.email)
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDTO) {
        return this.usersService.addRole(dto)
    }

    @ApiTags('API')
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/role-remove')
    RemoveRole(@Body() dto: RemoveRoleDTO) {
        return this.usersService.RemoveRole(dto)
    }
}
