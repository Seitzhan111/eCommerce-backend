import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches
} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    id?: string

    @ApiProperty()
    @IsString()
    @Length(3)
    fullName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    phone: string

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z])(?=.*\d)/, { message: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру' })
    @Matches(/^.{6,}$/, { message: 'Пароль должен содержать не менее 6 символов' })
    password: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    confirmationCode?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isConfirmed?: boolean

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isSocialRegistration?: boolean;

    @ApiProperty({
        default: 'user',
        description: 'User role (user or admin)',
    })
    role: 'user' | 'admin';

    @IsString()
    @IsOptional()
    avatar?: string
}

export class UpdateUserDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(3)
    fullName: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone: string

    @ApiProperty({
        default: 'USER'
    })
    @IsOptional()
    role?: 'USER' | 'ADMIN';

    @IsString()
    @IsOptional()
    avatar?: string
}


export class AddRoleDTO {
    @IsString()
    value: string

    @IsNumber()
    userId: number
}

export class RemoveRoleDTO {
    @IsNumber()
    roleId: number

    @IsNumber()
    userId: number
}