import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BlogDTO {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  image?: string
}