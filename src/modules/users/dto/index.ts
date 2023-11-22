import {IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateUserDTO {
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
    confirmationCode: string;
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
}
