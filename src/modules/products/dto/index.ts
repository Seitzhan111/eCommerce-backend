import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProductDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty()
    @IsOptional()
    image?: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    sales?: boolean

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    userId?: number[]

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    categoryId?: number[]
}

export class ProductUpdateDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    price?: string

    @ApiProperty()
    @IsOptional()
    image?: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    sales?: boolean

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    categoryId?: number[]
}