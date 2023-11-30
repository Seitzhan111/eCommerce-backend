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
    @Matches(
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        {message: 'Слабый пароль!'}
    )
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

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
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
        default: 'user',
        description: 'User role (user or admin)',
    })
    role: 'user' | 'admin';

    @IsString()
    @IsOptional()
    avatar?: string

    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
