import {IsEmail, IsOptional, IsString, Length} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @Length(3)
    fullName: string

    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    phone: string

    @ApiProperty()
    @Length(5)
    password: string
}

export class UpdateUserDTO {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(3)
    fullName: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    message: string
}
