import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import { UpdateUserDTO } from "./dto";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

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

    @Get()
    getAllUsers() {
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

    @Post(':userId/update-password')
    async updatePassword(@Param('userId') userId: string, @Body() data: { currentPassword: string, newPassword: string }): Promise<{ message: string }> {
        await this.usersService.updatePassword(userId, data.newPassword, true, data.currentPassword);
        return { message: 'Пароль успешно изменен!' };
    }
}
