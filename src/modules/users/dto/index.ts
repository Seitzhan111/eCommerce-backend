import { IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @Length(3)
    firstName: string

    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @Length(5)
    password: string
}

export class UpdateUserDTO {
    @ApiProperty()
    @IsString()
    @Length(3)
    firstName: string

    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsEmail()
    email: string
}