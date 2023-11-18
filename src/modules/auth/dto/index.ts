import { IsEmail, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @Length(5)
  password: string
}