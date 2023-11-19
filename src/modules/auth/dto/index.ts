import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDTO {
  @ApiProperty()
  @IsOptional() // Добавлено для того, чтобы email был необязательным полем
  @IsEmail() // Валидация только если поле предоставлено
  email?: string;

  @ApiProperty()
  @IsOptional() // Добавлено для того, чтобы username был необязательным полем
  @IsString()
  username?: string;

  @ApiProperty()
  @Length(5)
  password: string;
}