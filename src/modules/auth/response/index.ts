import { IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthUserResponse {
  @ApiProperty()
  @IsString()
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

  @ApiProperty()
  @IsString()
  token: string
}